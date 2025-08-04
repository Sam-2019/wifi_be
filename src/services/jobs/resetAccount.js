import { ntfy } from "../alerts/ntfy.js";
import { dataPlans } from "../../config/constants.js";
import { connectDB, disconnectDB } from "../db/index.js";
import { getActiveTopup } from "../db/repository/topup.js";
import { getUser, resetCounter } from "../mikrotik/index.js";

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

    if (userInfo?.uptime !== dataPlans.DAILY.uptime) return;

    await resetCounter(userInfo.id);
    customer.status = "expired";
    await customer.save();
    await ntfy({ payload: `👍🏾 Reset Counter: ${userInfo.fullName} - ${userInfo.userName}` });
  } catch (error) {
    // const message = `🤬 Reset Counter: ${error}`;
    // await ntfy({ payload: message });
    // console.error(message);
  } finally {
    await disconnectDB();
    console.log(`[${new Date().toISOString()}] resetCounter job finished.`);
    process.exit(0);
  }
};

await resetAccount();
