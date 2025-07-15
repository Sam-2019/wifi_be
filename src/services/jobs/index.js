
import Bree from "bree";
import path from "path";
import Cabin from "cabin";
import Graceful from "@ladjs/graceful";

const bree = new Bree({
  logger: new Cabin(),
  removeCompleted: true,
  outputWorkerMetadata: true,
  root: path.resolve("./src/services/jobs"),
  jobs: [
    {
      name: "provisionAccount",
      timeout: '2 hours'
    },
  ],
});

const graceful = new Graceful({
  brees: [bree],
});
graceful.listen();

export { bree };
