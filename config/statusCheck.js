import { apiUrl, authToken } from "./constants.js";

const checkTransactionStatus = async (reference) => {
  const queryParams = {
    clientReference: reference,
  };
  const queryString = new URLSearchParams(queryParams).toString();
  const endpoint = `${apiUrl}?${queryString}`;

  return fetch(endpoint, {
    method: "GET",
    headers: {
      Authorization: `Basic ${authToken}`,
      "Content-Type": "application/json",
    },
  });
};

export { checkTransactionStatus };
