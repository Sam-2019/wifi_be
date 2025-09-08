import {
  fetchRequest,
  registerSale,
  modifiedSalesRecord,
  modifiedSalesRecordII,
} from "../config/utils.js";
import express from "express";
import {
  hubtel,
  success,
  httpStatus,
  emptyRequest,
  internalServerError,
} from "../config/constants.js";
import { ntfy } from "../services/alerts.js";
import { authMiddleware } from "../config/middleware.js";
import { findSale } from "../services/db/repository/sale.js";
import { addCallback } from "../services/db/repository/callback.js";
import { getRegistrationByReference } from "../services/db/repository/registration.js";

const router = express.Router();

router.post("/payment/callback", async (req, res) => {
  const results = req.body;
  if (results === undefined || results === null) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: emptyRequest });
  }

  const logCallback = { provider: hubtel, response: results };
  const responseCode = results.ResponseCode;
  const message = results.Message;

  if (message !== success) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: `Payment callback with status: ${responseCode}` });
  }

  const responseData = results.Data;
  const clientReference = responseData.ClientReference;

  try {
    await addCallback(logCallback);
    const registrationByRef = await getRegistrationByReference(clientReference);
    if (!registrationByRef) {
      return res.status(httpStatus.NOT_FOUND).json({ message: "Registration not found" });
    }

    const sale = await findSale(clientReference);
    if (sale) {
      return res.status(httpStatus.OK).json({ message: "Duplicate", data: sale });
    }

    const modData = modifiedSalesRecordII({ registrationByRef, results });
    await registerSale({ route: "/payment/callback", payload: modData });
    res.status(httpStatus.CREATED).json({ message: success });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(internalServerError);
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
    return res.status(httpStatus.BAD_REQUEST).json({ message: emptyRequest });
  }

  try {
    const response = await fetchRequest(results);
    if (!response.ok) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: `Transaction status: ${response.statusText}` });
    }

    const responseData = await response.json();
    const dataPayload = responseData.data;
    await ntfy({ route: "/payment/status", payload: dataPayload });
    res.status(httpStatus.OK).json(responseData);
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(internalServerError);
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
    return res.status(httpStatus.BAD_REQUEST).json({ message: emptyRequest });
  }

  const clientReference = results.clientReference;

  try {
    const registrationByRef = await getRegistrationByReference(clientReference);
    if (registrationByRef === null || registrationByRef === undefined) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({
          message: `Registration with ref: ${clientReference} not found`,
        });
    }

    const sale = await findSale(clientReference);
    if (sale) {
      return res.status(httpStatus.OK).json({ message: "Duplicate", data: sale });
    }

    const response = await fetchRequest(results);
    if (!response.ok) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: `Transaction status: ${response.statusText}` });
    }

    const responseData = await response.json();
    if (responseData?.data?.status === "Paid") {
      const modData = modifiedSalesRecord({ registrationByRef, responseData });
      await registerSale({ route: "/payment/sync", payload: modData });
    }
    res.status(httpStatus.OK).json(responseData);
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(internalServerError);
  }
});

export { router as paymentRouter };
