import { ntfy } from "../alerts/ntfy.js";
import { resetCounter } from "../mikrotik/index.js";
import { todaySales } from "../db/repository/sale.js";
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
  } catch (error) {
    console.error(error);
  } finally {
    await disconnectDB();
    console.log(`[${new Date().toISOString()}] resetCounter job finished.`);
    process.exit(0);
  }
};

await resetCounter();
