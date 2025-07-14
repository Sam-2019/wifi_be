import "dotenv/config";
import { authToken, hubtel, apiUrl } from "./constants.js";

export const fetchOption = {
  method: "GET",
  headers: {
    Authorization: `Bearer ${authToken}`,
    "Content-Type": "application/json",
  },
};

export const fetchRequest = async (results) => {
  const queryParams = {
    clientReference: results.clientReference,
    transactionId: results.transactionId,
    externalTransactionId: results.externalTransactionId,
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
