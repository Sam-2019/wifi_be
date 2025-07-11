import { ntfy } from "../alerts/ntfy.js";
import { connectDB } from "../db/index.js";
import { createUser } from "../mikrotik/index.js";
import { yesterdaySales } from "../db/repository/sale.js";
import { getSelectedPlan } from "../../config/constants.js";

const setupUser = async () => {
  await connectDB();
  const paidRegistrants = await yesterdaySales();
  if (paidRegistrants.length > 0) {
    paidRegistrants.forEach((user) => {
      const profile = getSelectedPlan(user.subscriptionPlan);
      const results = {
        ...user,
        profile: profile,
      };
      createUser(results)
        .then(async (response) => {
          await ntfy({ route: "/provisionSuccess", payload: results });
        })
        .catch(async (error) => {
          await ntfy({ route: "/provisionFailed", payload: error });
        });
    });
  } else {
    console.log("No sales found for today.");
  }
};

setupUser();
