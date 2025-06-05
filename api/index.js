import router from "../routes/index.js";
import express, { json } from "express";
import bodyParser from "body-parser";
// import { authMiddleware } from "../config/middleware.js";
import cors from "cors";
import { connectDB } from "../db/index.js";
import { ping } from "./pinger.js";

const app = express();
const port = process.env.PORT || 4000;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  }),
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(json());
// app.use(authMiddleware);

connectDB();
app.use(express.static("./public"));

app.use("/", router);
ping();

app.listen(port, () => console.log(`Server is running on port ${port}`));

export default app;
