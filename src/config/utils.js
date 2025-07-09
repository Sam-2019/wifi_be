import { authToken, hubtel } from "./constants";

export const getFetchOption = {
    method: "GET",
    headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
    },
};

export const fetchRequest = async (results, options = getFetchOption) => {
    const queryParams = {
        clientReference: results.clientReference,
        transactionId: results.transactionId,
        externalTransactionId: results.externalTransactionId,
    };

    const queryString = new URLSearchParams(queryParams).toString();
    const endpoint = `${apiUrl}?${queryString}`;

    try {
        const response = await fetch(endpoint, options);
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
}