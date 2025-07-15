
import { ntfy } from "../alerts/ntfy.js";
import { connectDB } from "../db/index.js";
import { parentPort } from "node:worker_threads";
import { createUser } from "../mikrotik/index.js";
import { getSelectedPlan } from "../../config/constants.js";
import { getUnprovisionedCustomers, updateProfileCreated } from "../db/repository/customer.js";

const provisionAccount = async () => {
  await connectDB();
  const customers = await getUnprovisionedCustomers();

  if (customers.length === 0) { return };
  const firstCustomer = customers[0]
  const profile = getSelectedPlan();
  const results = {
    ...firstCustomer,
    profile: profile,
    comment: `Automated-${new Date().toISOString()}`,
  };

  createUser(results)
    .then(async (response) => {
      const userName = firstCustomer?.credentials?.userName;
      await updateProfileCreated(userName);
      await ntfy({ route: "/provisionSuccess", payload: results });
    })
    .catch(async (error) => {
      await ntfy({ route: "/provisionFailed", payload: error });
    });

  if (parentPort) parentPort.postMessage("done");
};

provisionAccount();
