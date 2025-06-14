import Model from "../modelsXschema/failed_registration.js";
import { excludeItems } from "../../config/constants.js";

const getFailedRegistrations = async () => {
  return await Model.find({}, excludeItems).lean();
};

const addFailedRegistration = async (data) => {
  return await Model.create(data);
};

const findFailedRegistration = async (data) => {
  const phoneNumber = data.phoneNumber;
  const email = data.email;
  // const clientReference = data.clientReference;

  return await Model.findOne(
    {
      phoneNumber: phoneNumber,
      email: email,
      // clientReference: clientReference,
    },
    excludeItems
  ).lean();
};

export {
  getFailedRegistrations,
  addFailedRegistration,
  findFailedRegistration,
};
