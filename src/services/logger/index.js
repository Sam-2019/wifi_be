import Axe from "axe";
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

const graceful = new Graceful({
  mongooses: [mongoose],
});
graceful.listen();

export { cabin };
