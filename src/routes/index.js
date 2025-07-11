import path from "path";
import express from "express";
import apiRouter from "./api.js";
import { __dirname } from "../config/constants.js";

const router = express.Router();
router.get("/", async (req, res) => {
  try {
    res.status(200);
    res.sendFile(path.join(`${__dirname}/public/up.html`));
  } catch (error) {
    res.status(500);
    res.sendFile(path.join(`${__dirname}/public/down.html`));
  }
});
router.use("/api", apiRouter);

export default router;
