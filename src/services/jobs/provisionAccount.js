import { cabin } from "./index.js";
import process from "node:process";
import { ntfy } from "../alerts/ntfy.js";
import { connectDB } from "../db/index.js";
import { parentPort } from "node:worker_threads";
import { createUser } from "../mikrotik/index.js";
import { getSelectedPlan } from "../../config/constants.js";
import { getUnprovisionedCustomers, updateProfileCreated } from "../db/repository/customer.js";

const provisionAccount = async () => {
  await connectDB();
  const customers = await getUnprovisionedCustomers();
  if (customers.length > 0) {
    customers.forEach((user) => {
      const profile = getSelectedPlan();
      const results = {
        ...user,
        profile: profile,
        comment: `Automated-${new Date().toISOString()}`,
      };
      createUser(results)
        .then(async (response) => {
          await updateProfileCreated(user);
          await ntfy({ route: "/provisionSuccess", payload: response });
        })
        .catch(async (error) => {
          await ntfy({ route: "/provisionFailed", payload: error });
        });
    });
  } else {
    cabin.info("All customers provisioned");
  }

  if (parentPort) parentPort.postMessage("done");
  else process.exit(0);
};

provisionAccount();
