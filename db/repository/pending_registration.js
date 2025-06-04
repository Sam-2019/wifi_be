import Model from "../modelsXschema/pending_registration.js";

const getPendingRegistration = async () => {
  return await Model.find({});
};

const addPendingRegistration = async (data) => {
  return await Model.create(data);
};

const findPendingRegistration = async (clientReference) => {
  return await Model.findOne({
    clientReference: clientReference,
  });
};

export { getPendingRegistration, addPendingRegistration, findPendingRegistration };
