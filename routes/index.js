import "dotenv/config";
import path from "path";
import express from "express";
import {
  hubtel,
  apiUrl,
  success,
  authToken,
  __dirname,
  internalServerError,
} from "../config/constants.js";
import {
  addRegistration,
  findRegistration,
  getRegistrations,
} from "../db/repository/registration.js";
import {
  addFailedRegistration,
  findFailedRegistration,
  getFailedRegistrations,
} from "../db/repository/failed_registration.js";
import {
  addPendingRegistration,
  findPendingRegistration,
  getPendingRegistrations,
} from "../db/repository/pending_registration.js";
import { writeToSheet } from "../config/gSheet.js";
import { addSale, getSales } from "../db/repository/sale.js";

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

router.get("/api/registrations", async (req, res) => {
  try {
    const registrations = await getRegistrations();
    if (!registrations || registrations.length === 0) {
      return res
        .status(404)
        .json({ message: "No records found", data: [] });
    }
    res.status(200).json({ message: "Registrations found", data: registrations });
  } catch (error) {
    console.error("Error in /registrations:", error);
    res.status(500).send(internalServerError);
  }
});

router.post("/api/registrant", async (req, res) => {
  const results = req.body;

  if (
    (results === undefined || results === null ||
      results.phoneNumber === undefined || results.phoneNumber === null ||
      results.email === undefined || results.email === null ||
      results.userName === undefined || results.userName === null)
    // results.clientReference === undefined || results.clientReference === null
  ) {
    console.error("Received with no data");
    return res.status(400).send("Received with no data");
  }

  try {
    const registrant = await findRegistration(results);
    if (!registrant || registrant.length === 0) {
      return res.status(404).json({ message: "No registrant found", data: null });
    }
    res.status(200).json({ message: "Registrant found", data: registrant });
  } catch (error) {
    console.error("Error in /registrant:", error);
    res.status(500).send(internalServerError);
  }
});

router.post("/api/registration", async (req, res) => {
  const results = req.body;

  if (
    results === undefined ||
    results === null ||
    results.clientReference === undefined ||
    results.clientReference === null
  ) {
    console.error("Registration received with no data");
    return res.status(400).send("Registration received with no data");
  }

  try {
    const registration = await addRegistration(results);
    res
      .status(200)
      .json({ message: "Registration Successful", data: registration });
  } catch (error) {
    console.error("Error in /registration", error);
    res.status(500).send(internalServerError);
  }
});

router.get("/api/sales", async (req, res) => {
  try {
    const sales = await getSales();
    if (!sales || sales.length === 0) {
      return res.status(404).json({ message: "No sales found", data: [] });
    }
    res.status(200).json({ message: sales });
  } catch (error) {
    console.error("Error in /sales:", error);
    res.status(500).send(internalServerError);
  }
});

router.post("/api/sale", async (req, res) => {
  const results = req.body;

  if (
    results === undefined ||
    results === null ||
    results.clientReference === undefined ||
    results.clientReference === null
  ) {
    console.error("Registration received with no data");
    return res.status(400).send("Registration received with no data");
  }

  try {
    await addSale(results);
    await writeToSheet(results);
    res.status(200).json({ message: "Sale Successful" });
  } catch (error) {
    console.error("Error in /sale:", error);
    res.status(500).send(internalServerError);
  }
});

router.get("/api/pending-registrations", async (req, res) => {
  try {
    const pending_registrations = await getPendingRegistrations();
    if (!pending_registrations || pending_registrations.length === 0) {
      return res
        .status(404)
        .json({ message: "No pending registrations found", data: [] });
    }
    res.status(200).json({ message: "Pending registrations found", data: pending_registrations });
  } catch (error) {
    console.error("Error in /pending-registrations", error);
    res.status(500).send(internalServerError);
  }
});

router.post("/api/pending-registration", async (req, res) => {
  const results = req.body;

  if (
    results === undefined ||
    results === null ||
    results.clientReference === undefined ||
    results.clientReference === null
  ) {
    console.error("Registration received with no data");
    return res.status(400).send("Registration received with no data");
  }

  try {
    await addPendingRegistration(results);
    await writeToSheet(results);
    res.status(200).json({ message: "Pending Registration Successful" });
  } catch (error) {
    console.error("Error in /pending-registration:", error);
    res.status(500).send(internalServerError);
  }
});

router.get("/api/failed-registrations", async (req, res) => {
  try {
    const failed_registrations = await getFailedRegistrations();
    if (!failed_registrations || failed_registrations.length === 0) {
      return res.status(404).json({ message: "No failed registrations found", data: [] });
    }
    res.status(200).json({ message: "Failed registrations found", data: failed_registrations });
  } catch (error) {
    console.error("Error in /failed-registrations:", error);
    res.status(500).send(internalServerError);
  }
});

router.get("/api/failed-registration", async (req, res) => {
  const results = req.body;

  if (
    (results === undefined || results === null ||
      results.phoneNumber === undefined || results.phoneNumber === null ||
      results.email === undefined || results.email === null
      // results.clientReference === undefined || results.clientReference === null
    )
  ) {
    console.error("Received with no data");
    return res.status(400).send("Received with no data");
  }
  try {
    const failedRegistration = await findFailedRegistration(results);
    if (!failedRegistration || failedRegistration.length === 0) {
      return res.status(404).json({ message: "No failed registration found", data: null });
    }
    res.status(200).json({ message: "Failed registration found", data: failedRegistration });
  } catch (error) {
    console.error("Error in /failed-registrations:", error);
    res.status(500).send(internalServerError);
  }
});

router.post("/api/failed-registration", async (req, res) => {
  const results = req.body;

  if (
    results === undefined ||
    results === null ||
    results.clientReference === undefined ||
    results.clientReference === null
  ) {
    console.error("Received with no data");
    return res.status(400).send("Received with no data");
  }

  try {
    await addFailedRegistration(results);
    res.status(200).json({ message: "Failed registration recorded" });
  } catch (error) {
    console.error("Error in /failed-registration:", error);
    res.status(500).send(internalServerError);
  }
});

router.post("/api/payment/callback", async (req, res) => {
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
    const foundPendingRegistration = await findPendingRegistration(
      clientReference
    );

    if (!foundPendingRegistration) {
      return res.status(404).send("Registration not found");
    }

    const stringifyResponse = JSON.stringify(results);
    const updatedData = {
      ...foundPendingRegistration,
      provider: hubtel.toUpperCase(),
      providerResponse: stringifyResponse,
      transactionId: responseData.transactionId,
      externalTransactionId: responseData.externalTransactionId,
    };
    await addSale(updatedData);

    res.status(200).json({ message: success });
  } catch (error) {
    console.error("Error processing payment callback:", error);
    return res.status(500).send(internalServerError);
  }
});

router.post("/api/payment/status", async (req, res) => {
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
    transactionId: results.transactionId,
    externalTransactionId: results.externalTransactionId,
  };

  const queryString = new URLSearchParams(queryParams).toString();
  const endpoint = `${apiUrl}?${queryString}`;

  fetch(endpoint, {
    method: "GET",
    headers: {
      Authorization: `Basic ${authToken}`,
      "Content-Type": "application/json",
    },
  })
    .then(async (response) => {
      if (!response.ok) {
        console.error(
          "Failed to fetch transaction status:",
          response.statusText
        );
        return res
          .status(400)
          .json({ message: "Failed to fetch transaction status" });
      }
      const data = await response.json();
      res.status(200).json(data);
    })
    .catch((error) => {
      console.error("Error fetching transaction status:", error);
      res.status(500).send(internalServerError);
    });
});

export default router;
