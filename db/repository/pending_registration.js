import Model from "../modelsXschema/pending_registration.js";
import { excludeItems } from "../../config/constants.js";

const getPendingRegistrations = async () => {
  return await Model.find({}, excludeItems).lean();
};

const addPendingRegistration = async (data) => {
  return await Model.create(data);
};

const findPendingRegistration = async (clientReference) => {
  return await Model.findOne(
    {
      clientReference: clientReference,
    },
    excludeItems
  )
    .sort({ $natural: -1 })
    .lean();
};

export {
  getPendingRegistrations,
  addPendingRegistration,
  findPendingRegistration,
};
