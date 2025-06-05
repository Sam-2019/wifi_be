import router from "../routes/index.js";
import express, { json } from "express";
import bodyParser from "body-parser";
// import { authMiddleware } from "../config/middleware.js";
import cors from "cors";
import { connectDB } from "../db/index.js";
import { ping } from "./pinger.js";

const app = express();
app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(json());
// app.use(authMiddleware);

connectDB();
app.use(express.static("./public"));

app.use("/", router);
app.set('port', process.env.PORT || 4000)
ping();

app.listen(4000, () => console.log(`Server is running on port ${app.get('port')}`));

export default app;