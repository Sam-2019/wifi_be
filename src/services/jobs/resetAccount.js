import mongoose from "mongoose";
import {
  getSelectedPlan,
  parseUptimeToSeconds,
} from "../src/config/constants.js";
import Graceful from "@ladjs/graceful";
import { ntfy } from "../src/services/alerts/ntfy.js";
import { connectDB } from "../src/services/db/index.js";
import { getActiveTopup } from "../src/services/db/repository/topup.js";
import { getUser, resetCounter } from "../src/services/mikrotik/index.js";

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

    const plan = customer?.subscriptionPlan;
    const selectedPlan = getSelectedPlan(plan);
    const planUptime = selectedPlan?.uptime;
    const planUptimeSeconds = parseUptimeToSeconds(planUptime);

    const user = await getUser(userName);
    if (!user) return;
    const userUptime = user?.uptime;
    const userUptimeSeconds = parseUptimeToSeconds(userUptime);

    const userInfo = {
      id: user?.id,
      uptime: user?.uptime,
      userName: userName,
      fullName: customer?.fullName,
    };

    // const message = `${userInfo.userName} - ${userInfo.uptime}`;
    // if (userInfo?.uptime !== planUptime) return;
    if (userUptimeSeconds < planUptimeSeconds) return;

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
