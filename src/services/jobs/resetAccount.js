import mongoose from "mongoose";
import Graceful from "@ladjs/graceful";
import { ntfy } from "../alerts/ntfy.js";
import { connectDB } from "../db/index.js";
import { dataPlans } from "../../config/constants.js";
import { getActiveTopup } from "../db/repository/topup.js";
import { getUser, resetCounter } from "../mikrotik/index.js";

const graceful = new Graceful({
  mongooses: [mongoose],
});

graceful.listen();

const resetAccount = async () => {
  try {
    console.log(`[${new Date().toISOString()}] resetCounter job started.`);
    await connectDB();

    const customer = await getActiveTopup();

    if (!customer) return;

    const userName = customer?.credentials?.userName;
    const user = await getUser(userName);

    if (!user) return;

    const userInfo = {
      id: user?.id,
      uptime: user?.uptime,
      userName: userName,
      fullName: customer?.fullName,
    };

    // const message = `${userInfo.userName} - ${userInfo.uptime}`;
    if (userInfo?.uptime !== dataPlans.DAILY.uptime) return;

    const state = await resetCounter(userInfo.id);
    if (state === true) {
      customer.status = "expired";
      await customer.save();
      const message = `👍🏾 Reset Counter: ${userInfo.fullName} - ${userInfo.userName}`;
      await ntfy({ payload: message });
      console.log(message);
    }
  } catch (error) {
    const message = `🤬 Reset Counter: ${error}`;
    await ntfy({ payload: message });
    console.error(message);
  } finally {
    console.log(`[${new Date().toISOString()}] resetCounter job finished.`);
    process.exit(0);
  }
};

await resetAccount();
