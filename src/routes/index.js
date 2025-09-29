import path from "path";
import express from "express";
import apiRouter from "./api.js";
import { __dirname, httpStatus } from "../config/constants.js";

const router = express.Router();
router.get("/", (req, res) => {
  try {
    res
      .status(httpStatus.OK)
      .sendFile(path.join(`${__dirname}/public/home.html`));
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .sendFile(path.join(`${__dirname}/public/down.html`));
  }
});

router.use("/api", apiRouter);

router.get("/healthz", (req, res) => {
  try {
    res
      .status(httpStatus.OK)
      .sendFile(path.join(`${__dirname}/public/up.html`));
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .sendFile(path.join(`${__dirname}/public/down.html`));
  }
});

router.get("*", (_, res) => {
  return res
    .status(httpStatus.NOT_FOUND)
    .sendFile(path.join(`${__dirname}/public/404.html`));
});

export default router;
