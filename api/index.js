import path from "path";
import cors from "cors";
import bodyParser from "body-parser";
import express, { json } from "express";
import router from "../src/routes/index.js";
import { connectDB } from "../src/services/db/index.js";
import { __dirname } from "../src/config/constants.js";
import { adminjs, adminRouter } from "../src/services/admin/index.js";
import { bree } from "../src/services/jobs/index.js";
import Cabin from "cabin";
import Signale from "signale/signale.js";
import requestId from "express-request-id";
import requestReceived from "request-received";
import responseTime from "response-time";

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
};

start();
