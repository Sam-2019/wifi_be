import router from "../routes/index.js";
import express, { json } from "express";
import { authMiddleware } from "../config/middleware.js";

import helmet from "helmet";
import cors from "cors";
import { connectDB } from "../db/index.js";
const app = express();

app.use(helmet());
app.use(cors());
app.use(json());
// app.use(authMiddleware);

connectDB();
app.use("/api", router);

app.listen(4000, () => console.log("Server ready on port 4000."));

export default app;
