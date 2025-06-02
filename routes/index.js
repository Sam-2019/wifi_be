import "dotenv/config";
import express from "express";
import {
  addPendingRegistration,
  findPendingRegistration,
  getPendingRegistration,
} from "../db/repository/pending_registration.js";
import { writeToSheet } from "../config/gSheet.js";
import { addSale } from "../db/repository/sale.js";
import { success, hubtel, __dirname } from "../config/constants.js";
import path from "path";

const router = express.Router();
router.get("/", async function (req, res) {
  try {
    res.status(200);
    res.sendFile(path.join(__dirname + "/public/up.html"));
  } catch (error) {
    res.status(500);
    res.sendFile(path.join(__dirname + "/public/down.html"));
  }
});

router.get("/api/register/sale", async function (req, res) {
  const results = req.body;

  try {
    console.log(results);
    const sales = await getSales();
    if (!sales || sales.length === 0) {
      return res.status(404).json({ message: "No sales found" });
    }
    res.status(200).json({ message: sales });
  } catch (error) {
    console.error("Error in /register:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/api/register/sale", async function (req, res) {
  const results = req.body;

  try {
    await addSale(results);
    await writeToSheet(results);
    res.status(200).json({ message: "Registration Successful" });
  } catch (error) {
    console.error("Error in /register:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/api/register/sale/intent", async function (req, res) {
  const results = req.body;

  try {
    console.log(results);
    const pending_registrations = await getPendingRegistration();
    if (!pending_registrations || pending_registrations.length === 0) {
      return res
        .status(404)
        .json({ message: "No pending registrations found" });
    }
    res.status(200).json({ message: pending_registrations });
  } catch (error) {
    console.error("Error in /register:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/api/register/sale/intent", async function (req, res) {
  const results = req.body;

  try {
    await addPendingRegistration(results);
    await writeToSheet(results);
    res.status(200).json({ message: "Registration Successful" });
  } catch (error) {
    console.error("Error in /register:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/api/payment/callback", async function (req, res) {
  const results = req.body;
  const status = results.Status;

  if (status !== success) {
    console.error("Payment callback failed with status:", status);
    return res.status(400).send("Payment callback failed");
  }

  const responseData = results.Data;
  const clientReference = responseData.ClientReference;

  try {
    const foundPendingRegistration = await findPendingRegistration(
      clientReference
    );

    if (!foundPendingRegistration) {
      return res.status(404).send("Registration not found");
    }

    const stringifyResponse = JSON.stringify(results);
    const updatedData = {
      ...foundPendingRegistration.toObject(),
      provider: hubtel,
      providerResponse: stringifyResponse,
    };
    await addSale(updatedData);

    res.status(200).json({ message: success });
  } catch (error) {
    console.error("Error processing payment callback:", error);
    return res.status(500).send("Internal Server Error");
  }
});

export default router;
