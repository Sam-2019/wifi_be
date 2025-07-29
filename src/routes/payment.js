import "dotenv/config";
import {
  fetchRequest,
  registerSale,
  handleEmptyRequest,
  modifiedSalesRecord,
  modifiedSalesRecordII,
} from "../config/utils.js";
import express from "express";
import { ntfy } from "../services/alerts.js";
import { authMiddleware } from "../config/middleware.js";
import { findSale } from "../services/db/repository/sale.js";
import { addCallback } from "../services/db/repository/callback.js";
import { getRegistrationByReference } from "../services/db/repository/registration.js";
import { hubtel, success, internalServerError, emptyRequest } from "../config/constants.js";

const router = express.Router();

router.post("/payment/callback", async (req, res) => {
  handleEmptyRequest({ req, res });
  const results = req.query;

  const logCallback = { provider: hubtel, response: results };
  const responseCode = results.ResponseCode;
  const message = results.Message;

  if (message !== success) {
    return res.status(400).json({ message: `Payment callback with status: ${responseCode}` });
  }

  const responseData = results.Data;
  const clientReference = responseData.ClientReference;

  try {
    await addCallback(logCallback);
    const registrationByRef = await getRegistrationByReference(clientReference);
    if (!registrationByRef) {
      return res.status(404).json({ message: "Registration not found" });
    }

    const sale = await findSale(clientReference);
    if (sale) { return res.status(200).json({ message: "Duplicate", data: sale }) }

    const modData = modifiedSalesRecordII({ registrationByRef, results });

    await registerSale({ route: "/payment/callback", payload: modData });
    res.status(200).json({ message: success });
  } catch (error) {
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
       return res.status(400).json({ message: emptyRequest });
  }

  try {
    const response = await fetchRequest(results);
    if (!response.ok) { return res.status(400).json({ message: `Transaction status: ${response.statusText}` }); }

    const responseData = await response.json();
    const dataPayload = responseData.data;
    await ntfy({ route: "/payment/status", payload: dataPayload });
    res.status(200).json(responseData);
  } catch (error) {
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
   return res.status(400).json({ message: emptyRequest });
  }

  const clientReference = results.clientReference;

  try {
    const registrationByRef = await getRegistrationByReference(clientReference);
    if (registrationByRef === null || registrationByRef === undefined) {
      return res.status(404).json({ message: `Registration with ref: ${clientReference} not found` });
    }

    const sale = await findSale(clientReference);
    if (sale) { return res.status(200).json({ message: "Duplicate", data: sale }) }

    const response = await fetchRequest(results);
    if (!response.ok) {
      return res.status(400).json({ message: `Transaction status: ${response.statusText}` });
    }
    const responseData = await response.json();

    if (responseData?.data?.status === "Paid") {
      const modData = modifiedSalesRecord({ registrationByRef, responseData });
      await registerSale({ route: "/payment/sync", payload: modData });
    }
    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).send(internalServerError);
  }
});

export { router as paymentRouter };
