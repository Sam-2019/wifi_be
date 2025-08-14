import "dotenv/config";
import { ntfy } from "../services/alerts.js";
import { writeToSheet } from "../services/gSheet.js";
import { addSale } from "../services/db/repository/sale.js";
import { addTopup } from "../services/db/repository/topup.js";
import { addCustomer } from "../services/db/repository/customer.js";
import { allocateRouter } from "../services/db/repository/router.js";
import {
  hubtel,
  apiUrl,
  authToken,
  registration,
} from "./constants.js";

const fetchOption = {
  method: "GET",
  headers: {
    Authorization: `Basic ${authToken}`,
    "Content-Type": "application/json",
  },
};

export const fetchRequest = async (results) => {
  const queryParams = {
    clientReference: results.clientReference,
  };

  const queryString = new URLSearchParams(queryParams).toString();
  const endpoint = `${apiUrl}?${queryString}`;

  try {
    const response = await fetch(endpoint, fetchOption);
    return response;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

export const modifiedSalesRecord = ({ registrationByRef, responseData }) => {
  const dataPayload = responseData?.data;
  return {
    ...registrationByRef,
    provider: hubtel.toUpperCase(),
    providerResponse: responseData,
    transactionId: dataPayload?.transactionId,
    externalTransactionId: dataPayload?.externalTransactionId,
  };
};

export const modifiedSalesRecordII = ({ registrationByRef, results }) => {
  const dataPayload = results?.Data;
  return {
    ...registrationByRef,
    provider: hubtel.toUpperCase(),
    providerResponse: results,
    transactionId: dataPayload?.TransactionId,
    externalTransactionId: dataPayload?.ExternalTransactionId,
  };
};

export const registerSale = async ({ route, payload }) => {
  await addSale(payload);
  if (payload.registrationType === registration) {
    await addCustomer(payload);
    // const station = payload?.blockCourt;
    // const customerId = await addCustomer(payload);
    // if (payload.isCustodian === true) await allocateRouter({ station, customerId });
  } else {
    await addTopup(payload);
  }
  await writeToSheet(payload, route);
  await ntfy({ route: route, payload: payload });
};
