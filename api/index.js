import AdminJSExpress from "@adminjs/express";
import router from "../routes/index.js";
import express, { json } from "express";
import bodyParser from "body-parser";
// import { authMiddleware } from "../config/middleware.js";
import cors from "cors";
import { ping } from "./pinger.js";
import { connectDB, dbSession } from "../db/index.js";
import { admin, authenticate, COOKIE, COOKIE_PASS } from "../config/admin.js";

const port = process.env.PORT || 4000;

const start = async () => {
  const app = express();
  app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST"],
    })
  );
  connectDB();

  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate,
      cookieName: COOKIE,
      cookiePassword: COOKIE_PASS,
    },
    null,
    dbSession
  );
  app.use(admin.options.rootPath, adminRouter);

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(json());
  app.use(express.static("./public"));
  app.use("/", router);
  ping();

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`AdminJS started on ${port}${admin.options.rootPath}`);
  });
};

start();
