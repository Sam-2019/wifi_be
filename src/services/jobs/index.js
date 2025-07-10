import Bree from "bree";
import path from "path";
import Cabin from "cabin";
import Graceful from "@ladjs/graceful";
import Signale from "signale/signale.js";
import { disconnectDB } from "../db/index.js";

// initialize cabin
const cabin = new Cabin({
    axe: {
        logger: new Signale()
    }
});

const bree = new Bree({
    logger: cabin,
    root: path.resolve("./src/services/jobs"),
    jobs: [
        // runs `./jobs/worker-1.js` after 1 minute and every 1 minutes thereafter
        {
            name: "provisionAccount",
            timeout: "1m",
            interval: "1m",
        },
    ],
});

const graceful = new Graceful({
    brees: [bree],
    mongooses: [disconnectDB]
});
graceful.listen();

export { bree };
