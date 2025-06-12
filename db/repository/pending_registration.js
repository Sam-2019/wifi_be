import Model from "../modelsXschema/pending_registration.js";

const getPendingRegistration = async () => {
  return await Model.find({});
};

const addPendingRegistration = async (data) => {
  return await Model.create(data);
};

const findPendingRegistration = async (clientReference) => {
  return await Model.findOne(
    {
      clientReference: clientReference,
    },
    { _id: 0 },
  )
    .sort({ $natural: -1 })
    .lean();
};

export {
  getPendingRegistration,
  addPendingRegistration,
  findPendingRegistration,
};
