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
  emailExists,
  userExists,
} from "../config/constants.js";
import {
  addRegistration,
  getRegistration,
  getRegistrations,
} from "../services/db/repository/registration.js";
import {
  addFailedRegistration,
  getFailedRegistration,
  getFailedRegistrations,
} from "../services/db/repository/failed_registration.js";
import {
  addPendingRegistration,
  getPendingRegistration,
  getPendingRegistrations,
} from "../services/db/repository/pending_registration.js";
import {
  addCustomer,
  getCustomer,
  getCustomers,
  checkUsernameAvailability,
} from "../services/db/repository/customer.js";
import { writeToSheet } from "../services/gSheet.js";
import { addSale, findSale, getSales } from "../services/db/repository/sale.js";
import { authMiddleware } from "../config/middleware.js";

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

router
  .route("/api/sale")
  .get(async (req, res) => {
    const results = req.query;

    if (results === undefined || results === null) {
      console.error("Received with no data");
      return res.status(400).send("Received with no data");
    }

    try {
      const sale = await findSale(results);
      if (!sale || sale.length === 0) {
        return res.status(404).json({ message: "No sale found", data: null });
      }
      res.status(200).json({ message: "Sale found", data: sale });
    } catch (error) {
      console.error("Error in /Sale:", error);
      res.status(500).send(internalServerError);
    }
  })
  .post(async (req, res) => {
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
      await writeToSheet(results, "sales");
      res.status(200).json({ message: "Sale added" });
    } catch (error) {
      console.error("Error in /sale:", error);
      res.status(500).send(internalServerError);
    }
  });

router.get("/api/registrations", async (req, res) => {
  try {
    const registrations = await getRegistrations();
    if (!registrations || registrations.length === 0) {
      return res
        .status(404)
        .json({ message: "No registrations found", data: [] });
    }
    res
      .status(200)
      .json({ message: "Registrations found", data: registrations });
  } catch (error) {
    console.error("Error in /registrations:", error);
    res.status(500).send(internalServerError);
  }
});

router
  .route("/api/registration")
  .get(authMiddleware, async (req, res) => {
    const results = req.query;

    if (results === undefined || results === null) {
      console.error("Received with no data");
      return res.status(400).send("Received with no data");
    }
    try {
      const registration = await getRegistration(results);
      if (!registration || registration.length === 0) {
        return res
          .status(404)
          .json({ message: "No registration found", data: null });
      }
      res
        .status(200)
        .json({ message: "registration found", data: registration });
    } catch (error) {
      console.error("Error in /registration:", error);
      res.status(500).send(internalServerError);
    }
  })
  .post(authMiddleware, async (req, res) => {
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
      await addRegistration(results);
      res.status(200).json({ message: "Registration added" });
    } catch (error) {
      console.error("Error in /registration", error);
      res.status(500).send(internalServerError);
    }
  });

router.get("/api/pending-registrations", authMiddleware, async (req, res) => {
  try {
    const pending_registrations = await getPendingRegistrations();
    if (!pending_registrations || pending_registrations.length === 0) {
      return res
        .status(404)
        .json({ message: "No pending registrations found", data: [] });
    }
    res.status(200).json({
      message: "Pending registrations found",
      data: pending_registrations,
    });
  } catch (error) {
    console.error("Error in /pending-registrations", error);
    res.status(500).send(internalServerError);
  }
});

router
  .route("/api/pending-registration")
  .get(authMiddleware, async (req, res) => {
    const results = req.query;

    if (results === undefined || results === null) {
      console.error("Received with no data");
      return res.status(400).send("Received with no data");
    }
    try {
      const pending_registration = await getPendingRegistration(results);
      if (!pending_registration || pending_registration.length === 0) {
        return res
          .status(404)
          .json({ message: "No pending registrations found", data: null });
      }
      res.status(200).json({
        message: "Pending registration found",
        data: pending_registration,
      });
    } catch (error) {
      console.error("Error in /pending-registration", error);
      res.status(500).send(internalServerError);
    }
  })
  .post(authMiddleware, async (req, res) => {
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
      await writeToSheet(results, "pendingRegistration");
      res.status(200).json({ message: "Pending Registration added" });
    } catch (error) {
      console.error("Error in /pending-registration:", error);
      res.status(500).send(internalServerError);
    }
  });

router.get("/api/failed-registrations", authMiddleware, async (req, res) => {
  try {
    const failed_registrations = await getFailedRegistrations();
    if (!failed_registrations || failed_registrations.length === 0) {
      return res
        .status(404)
        .json({ message: "No failed registrations found", data: [] });
    }
    res.status(200).json({
      message: "Failed registrations found",
      data: failed_registrations,
    });
  } catch (error) {
    console.error("Error in /failed-registrations:", error);
    res.status(500).send(internalServerError);
  }
});

router
  .route("/api/failed-registration")
  .get(authMiddleware, async (req, res) => {
    const results = req.query;

    if (results === undefined || results === null) {
      console.error("Received with no data");
      return res.status(400).send("Received with no data");
    }

    try {
      const failedRegistration = await getFailedRegistration(results);
      if (!failedRegistration || failedRegistration.length === 0) {
        return res
          .status(404)
          .json({ message: "No failedRegistration found", data: null });
      }
      res.status(200).json({
        message: "failedRegistration found",
        data: failedRegistration,
      });
    } catch (error) {
      console.error("Error in /failed-registration:", error);
      res.status(500).send(internalServerError);
    }
  })
  .post(authMiddleware, async (req, res) => {
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
      res.status(200).json({ message: "Failed registration added" });
    } catch (error) {
      console.error("Error in /failed-registration:", error);
      res.status(500).send(internalServerError);
    }
  });

router.get("/api/customers", authMiddleware, async (req, res) => {
  try {
    const customers = await getCustomers();
    if (!customers || customers.length === 0) {
      return res.status(404).json({ message: "No customers found", data: [] });
    }
    res.status(200).json({ message: customers });
  } catch (error) {
    console.error("Error in /customers:", error);
    res.status(500).send(internalServerError);
  }
});

router
  .route("/api/customer")
  .get(authMiddleware, async (req, res) => {
    const results = req.query;

    if (
      results === undefined ||
      results === null ||
      results.phoneNumber === undefined ||
      results.phoneNumber === null ||
      results.email === undefined ||
      results.email === null ||
      results.userName === undefined ||
      results.userName === null
    ) {
      console.error("Received with no data");
      return res.status(400).send("Received with no data");
    }

    try {
      const customer = await getCustomer(results);
      if (!customer || customer.length === 0) {
        return res
          .status(404)
          .json({ message: "No customer found", data: null });
      }
      res.status(200).json({ message: "Customer found", data: customer });
    } catch (error) {
      console.error("Error in /customer:", error);
      res.status(500).send(internalServerError);
    }
  })
  .post(authMiddleware, async (req, res) => {
    const results = req.body;

    if (results === undefined || results === null) {
      console.error("Received with no data");
      return res.status(400).send("Received with no data");
    }

    try {
      await addCustomer(results);
      res.status(200).json({ message: "Customer added" });
    } catch (error) {
      console.error("Error in /customer:", error.message);
      if (error.code === 11000) {
        const emailMessage = error?.errmsg?.includes("email")
          ? emailExists
          : null;
        const userNameMessage = error?.errmsg?.includes("credentials.userName")
          ? userExists
          : null;

        const message = {
          email: emailMessage,
          userName: userNameMessage,
        };

        res.status(422).json({ message: "Duplicate error", data: message });
      } else {
        console.error("Error in /customer:", error);
        res.status(500).send(internalServerError);
      }
    }
  });

router.get("/api/customer/availabilty", authMiddleware, async (req, res) => {
  const results = req.query;
  if (
    results === undefined ||
    results === null ||
    results.userName === undefined ||
    results.userName === null
  ) {
    console.error("Received with no data");
    return res.status(400).send("Received with no data");
  }

  try {
    const customer = await checkUsernameAvailability(results);
    if (!customer || customer.length === 0) {
      return res.status(200).json({ message: "", data: null });
    }
    res.status(200).json({ message: "Duplicate error", data: userExists });
  } catch (error) {
    console.error("Error in /customer:", error);
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
    const foundPendingRegistration =
      await getPendingRegistration(clientReference);

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
          response.statusText,
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
