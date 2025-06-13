import Model from "../modelsXschema/failed_registration.js";

const getFailedRegistrations = async () => {
  return await Model.find({});
};

const addFailedRegistration = async (data) => {
  return await Model.create(data);
};

const findFailedRegistration = async (clientReference) => {
  return await Model.findOne(
    {
      clientReference: clientReference,
    },
    { _id: 0 }
  )
    .sort({ $natural: -1 })
    .lean();
};

export {
  getFailedRegistrations,
  addFailedRegistration,
  findFailedRegistration,
};
