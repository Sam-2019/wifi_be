import { connectDB } from "../db.js";
import { ntfy } from "../alerts/ntfy.js";
import { parentPort } from "node:worker_threads";
import { createUser } from "../mikrotik/index.js";
import { yesterdaySales } from "../db/repository/sale.js";
import { getSelectedPlan } from "../../config/constants.js";

const setupUser = async () => {
  await connectDB();
  const paidRegistrants = await yesterdaySales();
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
if (parentPort) parentPort.postMessage("done");
