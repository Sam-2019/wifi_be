import path from "path";
import cors from "cors";
import { ping } from "./pinger.js";
import bodyParser from "body-parser";
import express, { json } from "express";
import router from "../routes/index.js";
import { connectDB } from "../db/index.js";
import { __dirname } from "../config/constants.js";
import { adminjs, adminRouter } from "../admin/index.js";
// import { authMiddleware } from "../config/middleware.js";

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

  ping();
  app.use(json());
  app.use("/", router);
  app.use(bodyParser.json());
  app.use(adminjs.options.rootPath, adminRouter);
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, "/public")));

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`AdminJS started on ${port}${adminjs.options.rootPath}`);
  });
};

start();
