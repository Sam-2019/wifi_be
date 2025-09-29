import Callback from "../modelsXschema/callback.js";

const getCallbacks = async () => {
  return await Callback.find().lean();
};

const addCallback = async (payload) => {
  const { provider, response } = payload;
  const modData = {
    provider: provider,
    providerResponse: response,
    message: response?.Message,
    responseCode: response?.ResponseCode,
    clientReference: response?.Data?.ClientReference,
    transactionId: response?.Data?.TransactionId,
    externalTransactionId: response?.Data?.ExternalTransactionId,
    paymentDate: new Date(response?.Data?.PaymentDate),
  };
  return await Callback.create(modData);
};

export { getCallbacks, addCallback };
