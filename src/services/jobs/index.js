import Axe from "axe";
import Bree from "bree";
import path from "path";
import Cabin from "cabin";
import mongoose from "mongoose";
import Graceful from "@ladjs/graceful";
import Signale from "signale/signale.js";

const logger = new Axe({
  logger: new Signale(),
  meta: {
    show: false,
  },
});

const cabin = new Cabin({
  logger: logger,
});

const bree = new Bree({
  logger: cabin,
  removeCompleted: true,
  outputWorkerMetadata: true,
  root: path.resolve("./src/services/jobs"),
  jobs: [
    {
      name: "provisionAccount",
      interval: "at 12:00 pm",
    },
  ],
});

const graceful = new Graceful({
  mongooses: [mongoose],
  brees: [bree],
});
graceful.listen();

export { bree, cabin };
