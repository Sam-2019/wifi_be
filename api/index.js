import path from "path";
import cors from "cors";
import bodyParser from "body-parser";
import express, { json } from "express";
import responseTime from "response-time";
import requestId from "express-request-id";
import router from "../src/routes/index.js";
import requestReceived from "request-received";
import { bree } from "../src/services/jobs/index.js";
import { cabin } from "../src/services/jobs/index.js";
import { __dirname } from "../src/config/constants.js";
import { connectDB } from "../src/services/db/index.js";
import { adminjs, adminRouter } from "../src/services/admin/index.js";


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
    console.log("SIGTERM signal received: closing HTTP server");
    server.close(() => {
      console.log("HTTP server closed");
    });
  });

  process.on("uncaughtException", (err) => {
    console.log(err, "uncaught exception detected");
    server.close(() => {
      process.exit(1);
    });

    setTimeout(() => {
      process.abort();
    }, 1000).unref();
    process.exit(1);
  });
};

start();
