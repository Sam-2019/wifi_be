import "dotenv/config";
import express from "express";
import { mikro } from "../config/mikrotik.js";
import {
  addPendingRegistration,
  findPendingRegistration,
} from "../db/repository/pending_registration.js";
import { writeToSheet } from "../config/gSheet.js";
import { addSale } from "../db/repository/sale.js";
import { success } from "../config/constants.js";

const router = express.Router();
router.get("/", async function (req, res) {
  try {
    res.status(200).json({ message: "Hello World!" });
  } catch (error) {
    console.error("Error in /:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/register", async function (req, res) {
  const results = req.body;

  try {
    console.log(results);
    res.status(200).json({ message: "Registrations" });
  } catch (error) {
    console.error("Error in /register:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/register", async function (req, res) {
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

router.post("/payment/callback", async function (req, res) {
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
    const updatedDate = {
      ...foundPendingRegistration.toObject(),
      provider: "HUBTEL",
      providerResponse: stringifyResponse,
    };
    await addSale(updatedDate);

    res.status(200).json({ message: success });
  } catch (error) {
    console.error("Error processing payment callback:", error);
    return res.status(500).send("Internal Server Error");
  }
});

router.get("/mikrotik", async function (req, res) {
  await mikro
    .talk(["/interface/print"])
    .then((response) => {
      console.log(response);
      mikro.close();
      res.status(200).json({ message: "Mikrotik command executed" });
    })
    .catch((error) => {
      console.error(error);
      mikro.close();
      res.status(400).json({ message: "Mikrotik command failed" });
    });
});

router.post("/mikrotik", async function (req, res) {
  await mikro
    .talk(["/interface/print"])
    .then((response) => {
      console.log(response);
      mikro.close();
      res.status(200).json({ message: "Mikrotik command executed" });
    })
    .catch((error) => {
      console.error(error);
      mikro.close();
      res.status(400).json({ message: "Mikrotik command failed" });
    });
});

export default router;