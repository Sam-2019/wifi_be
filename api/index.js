import path from "path";
import cors from "cors";
import debug from "debug";
import Cabin from "cabin";
import bodyParser from "body-parser";
import express, { json } from "express";
import Signale from "signale/signale.js";
import responseTime from "response-time";
import requestId from "express-request-id";
import router from "../src/routes/index.js";
import requestReceived from "request-received";
import { bree } from "../src/services/jobs/index.js";
import { __dirname } from "../src/config/constants.js";
import { connectDB } from "../src/services/db/index.js";
import { adminjs, adminRouter } from "../src/services/admin/index.js";

const port = process.env.PORT || 4000;

// initialize cabin
const cabin = new Cabin({
  axe: {
    logger: new Signale(),
  },
});

const start = async () => {
  const app = express();
  app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST"],
    }),
  );
  await connectDB();

  app.use(json());

  app.use(requestReceived);
  app.use(responseTime());
  app.use(requestId());
  app.use(cabin.middleware);
  app.use("/", router);
  app.use(bodyParser.json());
  app.disable("x-powered-by");
  app.use(adminjs.options.rootPath, adminRouter);
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, "/public")));

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`AdminJS started on ${port}${adminjs.options.rootPath}`);
  });
  await bree.start();

  process.on("SIGTERM", () => {
    debug("SIGTERM signal received: closing HTTP server");
    server.close(() => {
      debug("HTTP server closed");
    });
  });
};

start();
