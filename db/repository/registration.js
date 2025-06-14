import Model from "../modelsXschema/registration.js";
import { excludeItems } from "../../config/constants.js";

const getRegistrations = async () => {
  return await Model.find({}, excludeItems).lean();
};

const addRegistration = async (data) => {
  return await Model.create(data);
};

const findRegistration = async (data) => {
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

export { getRegistrations, addRegistration, findRegistration };
