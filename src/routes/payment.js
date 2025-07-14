import "dotenv/config";
import express from "express";
import {
  hubtel,
  success,
  registration,
  internalServerError,
  apiUrl,
  authToken,
} from "../config/constants.js";
import { ntfy } from "../services/alerts.js";
import { writeToSheet } from "../services/gSheet.js";
import { authMiddleware } from "../config/middleware.js";
import { addSale } from "../services/db/repository/sale.js";
import { addCustomer } from "../services/db/repository/customer.js";
import { fetchRequest, modifiedSalesRecord } from "../config/utils.js";
import { getRegistrationByReference } from "../services/db/repository/registration.js";
import { getPendingRegistration } from "../services/db/repository/pending_registration.js";

const router = express.Router();

router.post("/payment/callback", async (req, res) => {
  const results = req.body;

  if (results === undefined || results === null) {
    console.error("Payment callback received with no data");
    return res.status(400).send("Payment callback received with no data");
  }

  const responseCode = results.ResponseCode;
  const message = results.Message;

  if (message !== success) {
    console.error("Payment callback failed with status:", responseCode);
    return res.status(400).send("Payment callback failed");
  }

  const responseData = results.Data;
  const clientReference = responseData.ClientReference;

  try {
    const foundPendingRegistration =
      await getPendingRegistration(clientReference);

    if (!foundPendingRegistration) {
      return res.status(404).send("Registration not found");
    }

    // const stringifyResponse = JSON.stringify(results);
    const updatedData = {
      ...foundPendingRegistration,
      provider: hubtel.toUpperCase(),
      providerResponse: results,
      transactionId: responseData.transactionId,
      externalTransactionId: responseData.externalTransactionId,
    };
    await addSale(updatedData);
    await writeToSheet(results, "Pending Registration");
    await ntfy({ route: "/payment/callback", payload: results });
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
  const queryParams = {
    clientReference: results.clientReference,
  };

  const queryString = new URLSearchParams(queryParams).toString();
  const endpoint = `${apiUrl}?${queryString}`;
  const fetchOption = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`,
      Accept: "application/json",
    },
  };

  await ntfy({ route: "/payment/status", payload: authToken });
  await ntfy({ route: "/payment/status", payload: queryString });
  await ntfy({ route: "/payment/status", payload: endpoint });
  await ntfy({ route: "/payment/status", payload: fetchOption });

  try {
    const response = await fetch(endpoint, fetchOption);
    await ntfy({ route: "/payment/status", payload: response });
    res.status(200).json(response);
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

  const registrationByRef = await getRegistrationByReference(
    results.clientReference,
  );
  if (registrationByRef === null || registrationByRef === undefined) {
    console.error(
      "Registration not found for client reference:",
      results.clientReference,
    );
    return res.status(404).send("Registration not found");
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

    if (responseData?.data?.status === "Paid") {
      const modData = modifiedSalesRecord(registrationByRef, responseData);
      await addSale(modData);
      if (registrationByRef.registrationType === registration)
        addCustomer(registrationByRef);
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
