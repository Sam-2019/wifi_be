import { config } from "./index.js";
import { ntfy } from "../services/alerts.js";
import { hubtel, topup } from "./constants.js";
import { writeToSheet } from "../services/gSheet.js";
import { addSale } from "../services/db/repository/sale.js";
import { addTopup } from "../services/db/repository/topup.js";
import { addMembership } from "../services/db/repository/membership.js";

const fetchOption = {
  method: "GET",
  headers: {
    Authorization: `Basic ${config.gateway.token}`,
    "Content-Type": "application/json",
  },
};

export const fetchRequest = async (results) => {
  const statusUrl = `${config.gateway.url}/${config.gateway.clientid}/status`;
  const queryParams = {
    clientReference: results.clientReference,
  };

  const queryString = new URLSearchParams(queryParams).toString();
  const endpoint = `${statusUrl}?${queryString}`;

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
  if (payload.registrationType === topup) {
    await addTopup(payload);
  } else {
    await addMembership(payload);
  }
  await writeToSheet(payload);
  await ntfy({ route: route, payload: payload });
};
