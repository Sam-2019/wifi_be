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
    {
      name: "provisionAccount",
      interval: "at 6:00 pm",
    },
  ],
});

const graceful = new Graceful({
  brees: [bree],
});
graceful.listen();

export { bree };
