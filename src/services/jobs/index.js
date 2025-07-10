import Bree from "bree";
import path from "path";
import Cabin from "cabin";
import Graceful from "@ladjs/graceful";
import Signale from "signale/signale.js";

// initialize cabin
const cabin = new Cabin({
  axe: {
    logger: new Signale(),
  },
});

const bree = new Bree({
  removeCompleted: true,
  closeWorkerAfterMs: "5m",
  logger: cabin,
  root: path.resolve("./src/services/jobs"),
  jobs: [
    // runs `./jobs/worker-1.js` after 1 minute and every 1 minutes thereafter
    {
      name: "provisionAccount",
      interval: "at 6:00 pm",
    },
  ],
});

const graceful = new Graceful({
  brees: [bree],
  // mongooses: [disconnectDB],
});
graceful.listen();

export { bree };
