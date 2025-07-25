import Bree from "bree";
import path from "path";
import mongoose from "mongoose";
import Graceful from "@ladjs/graceful";
import { __dirname } from "../../config/constants.js";

async function startBree() {
  const bree = new Bree({
    removeCompleted: true,
    root: path.resolve("./src/services/jobs"),
    jobs: [
      {
        name: "provisionAccount",
        timeout: false,
        interval: "30m",
      },
      {
        name: "resetCounter",
        timeout: false,
        interval: "5m",
      },
    ],
    logger: console,
  });

  try {
    await bree.start();
    console.log("Bree started successfully. Jobs scheduled.");
  } catch (error) {
    console.error("Error starting Bree:", error);
  }

  // Optional: Graceful shutdown
  process.on("SIGINT", async () => {
    console.log("Stopping Bree...");
    await bree.stop();
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log(
        "Mongoose default connection disconnected through app termination"
      );
    }
    process.exit(0);
  });

  const graceful = new Graceful({
    brees: [bree],
    mongooses: [mongoose],
  });
  graceful.listen();
}

export { startBree };
