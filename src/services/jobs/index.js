import Axe from "axe";
import Bree from "bree";
import path from "path";
import Cabin from "cabin";
import Graceful from "@ladjs/graceful";
import Signale from "signale/signale.js";

const bree = new Bree({
  logger: new Cabin({
    logger: new Axe({
      logger: new Signale(),
      meta: {
        show: false,
      },
    })
  }),
  removeCompleted: true,
  outputWorkerMetadata: true,
  root: path.resolve("./src/services/jobs"),
  jobs: [
    {
      name: "provisionAccount",
      cron: '0 */2 * * *'
    },
  ],
});

const graceful = new Graceful({
  brees: [bree],
});
graceful.listen();

export { bree };
