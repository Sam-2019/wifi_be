import { connectDB } from "../db";
import { createUser } from "../mikrotik/index.js";
import { todaySales } from "../db/repository/sale.js";
import { getSelectedPlan } from "../../config/constants.js";
import { ntfy } from "../alerts/ntfy.js";

const setupUser = async () => {
  await connectDB();
  const paidRegistrants = await todaySales();
  if (paidRegistrants.length > 0) {
    console.log(`Today's sales: ${paidRegistrants.length}`);
    paidRegistrants.forEach((user) => {
      console.log(`User: ${user.credentials.userName}, Email: ${user.email}`);
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
          // console.error(`Error adding user ${user.credentials.userName}:`, error);
        });
    });
  } else {
    console.log("No sales found for today.");
  }
};

setupUser();
