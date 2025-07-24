import process from "node:process";
import { ntfy } from "../alerts/ntfy.js";
import { connectDB, disconnectDB } from "../db/index.js";
import { createUser, getUser } from "../mikrotik/index.js";
import { getSelectedPlan } from "../../config/constants.js";
import { getUnprovisionedCustomer } from "../db/repository/customer.js";

const provisionAccount = async () => {
  try {
    console.log(`[${new Date().toISOString()}] accountProvision job started.`);
    await connectDB();
    const allProvisioned = "All customers provisioned";
    const customer = await getUnprovisionedCustomer();

    if (!customer) {
      await ntfy({ route: "/allProvisioned", payload: allProvisioned });
      return;
    }

    const results = {
      name: customer.credentials.userName,
      password: customer.credentials.password,
      email: customer.email,
      profile: getSelectedPlan(),
      comment: `Automated-${new Date().toISOString()}`,
    };

    const customerStatus = await getUser(results.name);

    if (customerStatus && customer.profileCreated === false) {
      customer.profileCreated = true;
      await customer.save();
      const message = `Updated ${customer.fullName} profileCreated: true`;
      console.log(message);
      return;
    }

    await createUser(results);
    customer.profileCreated = true;
    await customer.save();
    const message = `${customer.fullName} - ${results.name} provisioned`;
    await ntfy({ route: "/provisionSuccess", payload: message });
  } catch (error) {
    const message = `provisionAccount failed Error: ${error}`;
    await ntfy({ route: "/provisionFailed", payload: message });
    console.error(message);
  } finally {
    await disconnectDB();
    console.log(`[${new Date().toISOString()}] accountProvision job finished.`);
    process.exit(0);
  }
};

await provisionAccount();
