import PendingRegistration from "../modelsXschema/pending_registration.js";
import { excludeItems } from "../../config/constants.js";

const getPendingRegistrations = async () => {
  return await PendingRegistration.find({}, excludeItems).lean();
};

const addPendingRegistration = async (data) => {
  return await PendingRegistration.create(data);
};

const findPendingRegistration = async (clientReference) => {
  return await PendingRegistration.findOne(
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
