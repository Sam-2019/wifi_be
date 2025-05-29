import "dotenv/config";
import express from "express";
import { MikroClient } from "mikro-client";
import { mikrotikOptions } from "../config/mikrotik.js";
import {
  addPendingRegistration,
  findPendingRegistration,
} from "../db/repository/pending_registration.js";
import { writeToSheet } from "../config/gSheet.js";
import { addSale } from "../db/repository/sale.js";
import { success } from "../config/constants.js";

const router = express.Router();
router.get("/", async function (req, res) {
  return res.status(200).json({ message: "Hello World!" });
});

router.get("/register", async function (req, res) {
  const results = req.body;
  console.log(results);
  return res.send("Register endpoint");
});

router.post("/register", async function (req, res) {
  const results = req.body;
  const parseResults = JSON.parse(results.body);
  await addPendingRegistration(parseResults);
  await writeToSheet(parseResults);
  res.status(200).json({ message: "Registration Successful" });
});

router.post("/payment/callback", async function (req, res) {
  const results = req.body;
  const status = results.Status;

  if (status !== success) {
    console.error("Payment callback failed with status:", status);
    return res.status(400).send("Payment callback failed");
  }

  const responseData = results.Data;
  const clientReference = responseData.ClientReference;
  const foundPendingRegistration = await findPendingRegistration(
    clientReference
  );

  if (!foundPendingRegistration) {
    return res.status(404).send("Registration not found");
  }

  const stringifyResponse = JSON.stringify(results);
  const updatedDate = {
    ...foundPendingRegistration.toObject(),
    provider: "HUBTEL",
    providerResponse: stringifyResponse,
  };
  await addSale(updatedDate);

  res.status(200).json({ message: success });
});

router.get("/mikrotik", async function (req, res) {
  const mikro = new MikroClient(mikrotikOptions);
  await mikro
    .talk(["/interface/print"])
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.error(error);
    });
});

router.post("/mikrotik", async function (req, res) {
  const mikro = new MikroClient(mikrotikOptions);
  await mikro
    .talk(["/interface/print"])
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.error(error);
    });
});

export default router;
