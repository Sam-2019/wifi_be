import "dotenv/config";
import { authToken, hubtel, apiUrl } from "./constants.js";

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

export const modifiedSalesRecord = (registrationByRef, responseData) => {
  const dataPayload = responseData?.data;
  return {
    ...registrationByRef,
    provider: hubtel.toUpperCase(),
    providerResponse: responseData,
    transactionId: dataPayload?.transactionId,
    externalTransactionId: dataPayload?.externalTransactionId,
  };
};


export const modifiedSalesRecordII = (registrationByRef, responseData) => {
  const dataPayload = responseData?.Data;
  return {
    ...registrationByRef,
    provider: hubtel.toUpperCase(),
    providerResponse: responseData,
    transactionId: dataPayload?.transactionId,
    externalTransactionId: dataPayload?.externalTransactionId,
  };
};