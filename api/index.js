import cors from "cors";
import { ping } from "./pinger.js";
import bodyParser from "body-parser";
import express, { json } from "express";
import router from "../routes/index.js";
import AdminJSExpress from "@adminjs/express";
import { connectDB, dbSession } from "../db/index.js";
import { adminjs, authenticate } from "../admin/index.js";
// import { authMiddleware } from "../config/middleware.js";
import { cookie, cookiePass } from "../config/constants.js";

const port = process.env.PORT || 4000;

const start = async () => {
  const app = express();
  app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST"],
    }),
  );
  connectDB();

  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    adminjs,
    {
      authenticate,
      cookieName: cookie,
      cookiePassword: cookiePass,
    },
    null,
    dbSession,
  );
  app.use(adminjs.options.rootPath, adminRouter);

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(json());
  app.use(express.static("./public"));
  app.use("/", router);
  ping();

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`AdminJS started on ${port}${adminjs.options.rootPath}`);
  });
};

start();
