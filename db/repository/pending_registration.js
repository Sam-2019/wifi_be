import PendingRegistration from "../modelsXschema/pending_registration.js";

const getPendingRegistration = async () => {
  return await PendingRegistration.find({});
};

const addPendingRegistration = async (data) => {
  return await PendingRegistration.create(data);
};

const findPendingRegistration = async (clientReference) => {
  return await PendingRegistration.findOne({
    clientReference: clientReference,
  });
};

export {
  getPendingRegistration,
  addPendingRegistration,
  findPendingRegistration,
};
