import "dotenv/config";
import express from "express";
import {
  addPendingRegistration,
  findPendingRegistration,
  getPendingRegistrations,
} from "../db/repository/pending_registration.js";
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
import { writeToSheet } from "../config/gSheet.js";
import { addSale, getSales } from "../db/repository/sale.js";
import {
  success,
  hubtel,
  __dirname,
  authToken,
  apiUrl,
  internalServerError,
} from "../config/constants.js";
import path from "path";

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
    const results = await getRegistrations();
    if (!results || results.length === 0) {
      return res
        .status(404)
        .json({ message: "No registration found", data: [] });
    }
    res.status(200).json({ message: results });
  } catch (error) {
    console.error("Error in /registrations:", error);
    res.status(500).send(internalServerError);
  }
});

router.get("/api/registration", async (req, res) => {
  const results = req.body;

  if (results === undefined || results === null) {
    console.error("Received with no data");
    return res.status(400).send("Received with no data");
  }

  try {
    const result = await findRegistration();
    if (!result || result.length === 0) {
      return res.status(404).json({ message: "No record found", data: [] });
    }
    res.status(200).json({ message: result });
  } catch (error) {
    console.error("Error in /registration:", error);
    res.status(500).send(internalServerError);
  }
});

router.post("/api/registeration", async (req, res) => {
  const results = req.body;

  if (results === undefined || results === null) {
    console.error("Registration received with no data");
    return res.status(400).send("Registration received with no data");
  }

  try {
    const response = await addRegistration(results);
    res
      .status(200)
      .json({ message: "Registration Successful", data: response });
  } catch (error) {
    console.error("Error in /register:", error);
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
    console.error("Error in /register/sale:", error);
    res.status(500).send(internalServerError);
  }
});

router.post("/api/sale", async (req, res) => {
  const results = req.body;

  if (results === undefined || results === null) {
    console.error("Registration received with no data");
    return res.status(400).send("Registration received with no data");
  }

  try {
    await addSale(results);
    await writeToSheet(results);
    res.status(200).json({ message: "Sale Successful" });
  } catch (error) {
    console.error("Error in /register/sale:", error);
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
    res.status(200).json({ message: pending_registrations });
  } catch (error) {
    console.error("Error in /register:", error);
    res.status(500).send(internalServerError);
  }
});

router.post("/api/pending-registration", async (req, res) => {
  const results = req.body;

  if (results === undefined || results === null) {
    console.error("Registration received with no data");
    return res.status(400).send("Registration received with no data");
  }

  try {
    await addPendingRegistration(results);
    await writeToSheet(results);
    res.status(200).json({ message: "Registration Successful" });
  } catch (error) {
    console.error("Error in /register/sale/intent:", error);
    res.status(500).send(internalServerError);
  }
});

router.get("/api/failed-registrations", async (req, res) => {
  try {
    const results = await getFailedRegistrations();
    if (!results || results.length === 0) {
      return res.status(404).json({ message: "No record found", data: [] });
    }
    res.status(200).json({ message: results });
  } catch (error) {
    console.error("Error in /register/failed-registrations:", error);
    res.status(500).send(internalServerError);
  }
});

router.get("/api/failed-registration", async (req, res) => {
  const results = req.body;

  if (results === undefined || results === null) {
    console.error("Received with no data");
    return res.status(400).send("Received with no data");
  }
  try {
    const result = await findFailedRegistration(data);
    if (!result || result.length === 0) {
      return res.status(404).json({ message: "No record found", data: [] });
    }
    res.status(200).json({ message: result });
  } catch (error) {
    console.error("Error in /failed-registrations:", error);
    res.status(500).send(internalServerError);
  }
});

router.post("/api/failed-registration", async (req, res) => {
  const results = req.body;

  if (results === undefined || results === null) {
    console.error("Received with no data");
    return res.status(400).send("Received with no data");
  }

  try {
    await addFailedRegistration(results);
    res.status(200).json({ message: "Failed Payment recorded" });
  } catch (error) {
    console.error("Error in /register/failed-registration:", error);
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
      transactionId: responseData.ClientReference,
      externalTransactionId: responseData.ClientReference,
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
