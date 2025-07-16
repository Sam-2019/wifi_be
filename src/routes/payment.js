import "dotenv/config";
import express from "express";
import {
  hubtel,
  success,
  registration,
  internalServerError,
} from "../config/constants.js";
import { ntfy } from "../services/alerts.js";
import { writeToSheet } from "../services/gSheet.js";
import { authMiddleware } from "../config/middleware.js";
import { addCustomer } from "../services/db/repository/customer.js";
import { addCallback } from "../services/db/repository/callback.js";
import { addSale, findSale } from "../services/db/repository/sale.js";
import { getRegistrationByReference } from "../services/db/repository/registration.js";
import { fetchRequest, modifiedSalesRecord, modifiedSalesRecordII } from "../config/utils.js";

const router = express.Router();

router.post("/payment/callback", async (req, res) => {
  const results = req.body;

  if (results === undefined || results === null) {
    console.error("Payment callback received with no data");
    return res.status(400).send("Payment callback received with no data");
  }

  const logCallback = { provider: hubtel, response: results }
  const responseCode = results.ResponseCode;
  const message = results.Message;

  if (message !== success) {
    console.error("Payment callback failed with status:", responseCode);
    return res.status(400).send("Payment callback failed");
  }

  const responseData = results.Data;
  const clientReference = responseData.ClientReference;

  try {
    await addCallback(logCallback);
    const registrationByRef = await getRegistrationByReference(clientReference);
    if (!registrationByRef) {
      console.error("Registration not found for client reference:", clientReference);
      return res.status(404).send("Registration not found");
    }

    const sale = await findSale(clientReference);
    if (sale) { return res.status(200).json({ message: "Sale exists", data: sale }) }

    const modData = modifiedSalesRecordII(registrationByRef, results);

    await addSale(modData);
    if (registrationByRef.registrationType === registration) { addCustomer(registrationByRef) }
    await writeToSheet(modData, "Callback");
    await ntfy({ route: "/payment/callback", payload: modData });
    res.status(200).json({ message: success });
  } catch (error) {
    console.error("Error processing payment callback:", error);
    return res.status(500).send(internalServerError);
  }
});

router.post("/payment/status", authMiddleware, async (req, res) => {
  const results = req.body;

  if (
    results === undefined ||
    results === null ||
    results.clientReference === undefined ||
    results.clientReference === null
  ) {
    return res.status(400).send("Payment status received with no data");
  }

  try {
    const response = await fetchRequest(results);

    if (!response.ok) {
      console.error("Failed to fetch transaction status:", response.statusText);
      return res
        .status(400)
        .json({ message: "Failed to fetch transaction status" });
    }

    const responseData = await response.json();
    const dataPayload = responseData.data;
    await ntfy({ route: "/payment/status", payload: dataPayload });
    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error in /payment/status:", error);
    res.status(500).send(internalServerError);
  }
});

router.post("/payment/sync", authMiddleware, async (req, res) => {
  const results = req.body;

  if (
    results === undefined ||
    results === null ||
    results.clientReference === undefined ||
    results.clientReference === null
  ) {
    return res.status(400).send("Received with no data");
  }

  const clientReference = results.clientReference;

  try {
    const registrationByRef = await getRegistrationByReference(clientReference);
    if (registrationByRef === null || registrationByRef === undefined) {
      console.error("Registration not found for client reference:", clientReference);
      return res.status(404).send("Registration not found");
    }

    const sale = await findSale(clientReference);
    if (getSale) { return res.status(200).json({ message: "Sale exists", data: sale }) }

    const response = await fetchRequest(results);
    if (!response.ok) {
      console.error("Failed to fetch transaction status:", response.statusText);
      return res
        .status(400)
        .json({ message: "Failed to fetch transaction status" });
    }
    const responseData = await response.json();

    if (responseData?.data?.status === "Paid") {
      const modData = modifiedSalesRecord(registrationByRef, responseData);
      await addSale(modData);
      if (registrationByRef.registrationType === registration) { addCustomer(registrationByRef) }
      await writeToSheet(modData, "Sales");
      await ntfy({ route: "/payment/sync", payload: modData });
    }
    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error in /payment/sync:", error);
    res.status(500).send(internalServerError);
  }
});

export { router as paymentRouter };
