import Bree from "bree";
import path from "path";
import Graceful from "@ladjs/graceful";
import { __dirname } from "../../config/constants.js";

async function startBree() {
  const bree = new Bree({
    removeCompleted: true,
    root: path.resolve("./src/services/jobs"),
    jobs: [
      {
        closeWorkerAfterMs: "8",
        name: "provisionAccount",
        timeout: false,
        interval: "2m",
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
  });
  graceful.listen();
}

export { startBree };
