import { ntfy } from "../alerts/ntfy.js";
import { resetCounter } from "../mikrotik/index.js";
import { todaySales } from "../db/repository/sale.js";
import { dataPlans } from "../../config/constants.js";
import { connectDB, disconnectDB } from "../db/index.js";

const resetCounter = async () => {
  try {
    console.log(`[${new Date().toISOString()}] resetCounter job started.`);
    await connectDB();
    const noSale = "No Sale";
    const sale = await todaySales();

    if (!sale) {
      await ntfy({ route: "/noSale", payload: noSale });
      return;
    }

    const customer = sale[0];
    const userName = customer?.credentials.userName;
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
      const message = `✅ Reset Counter: ${customer.fullName} - ${userData.name}`;
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
