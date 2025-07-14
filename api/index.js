import path from "path";
import cors from "cors";
import bodyParser from "body-parser";
import express, { json } from "express";
import responseTime from "response-time";
import requestId from "express-request-id";
import router from "../src/routes/index.js";
import requestReceived from "request-received";
import { ping } from "../src/services/pinger.js";
import { __dirname } from "../src/config/constants.js";
import { connectDB } from "../src/services/db/index.js";
import { cabin } from "../src/services/logger/index.js";

const port = process.env.PORT || 4000;

const start = async () => {
  const app = express();
  app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST"],
    }),
  );

  await connectDB();

  ping();
  app.use(json());
  app.use(requestReceived);
  app.use(responseTime());
  app.use(requestId());
  app.use(cabin.middleware);
  app.use("/", router);
  app.use(responseTime());
  app.use(requestReceived);
  app.use(bodyParser.json());
  app.disable("x-powered-by");
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, "/public")));

  app.listen(port, () => {
    cabin.info(`Server is running on port ${port}`);
  });
};

start();
