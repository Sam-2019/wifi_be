import { resetCounter } from "../mikrotik/index.js";
import { dataPlans } from "../../config/constants.js";
import { connectDB, disconnectDB } from "../db/index.js";
import { getActiveTopup } from "../db/repository/topup.js";

const resetCounter = async () => {
  try {
    console.log(`[${new Date().toISOString()}] resetCounter job started.`);
    await connectDB();
    const customer = await getActiveTopup();

    if (!customer) {
      const message = "☑️ No Topup";
      console.log(message);
      return;
    }
    const userName = customer?.credentials?.userName;
    const userInfo = await getUser(userName);

    if (!userInfo) {
      const message = `☑️ User not found`;
      console.log(message);
      return;
    }

    const userID = userInfo?.id;
    const userUptime = userInfo?.uptime;

    if (userUptime === dataPlans.DAILY.uptime) {
      await resetCounter(userID);
      const message = `✅ Reset Counter: ${customer?.fullName} - ${userData?.name}`;
      console.log(message);
      return;
    }
  } catch (error) {
    const message = `❌ Error: ${error}`;
    console.error(message);
  } finally {
    await disconnectDB();
    console.log(`[${new Date().toISOString()}] resetCounter job finished.`);
    process.exit(0);
  }
};

await resetCounter();
