import path from "path";
import cors from "cors";
import { ping } from "../src/services/pinger.js";
import bodyParser from "body-parser";
import express, { json } from "express";
import router from "../src/routes/index.js";
import { connectDB } from "../src/services/db/index.js";
import { __dirname } from "../src/config/constants.js";
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
  // app.use(compression());
  app.use(bodyParser.json());
  app.disable("x-powered-by");
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, "/public")));

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

start();
