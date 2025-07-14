import "dotenv/config";
import { authToken, hubtel, apiUrl } from "./constants.js";

const fetchOption = {
  method: "GET",
  headers: {
    Authorization: `Bearer ${authToken}`,
    "Content-Type": "application/json",
  },
};

export const fetchRequest = async (results) => {
  const queryParams = {
    clientReference: results.clientReference
  };

  const queryString = new URLSearchParams(queryParams).toString();
  const endpoint = `${apiUrl}?${queryString}`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });
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
