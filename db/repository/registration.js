import Registration from "../modelsXschema/registration.js";
import { excludeItems } from "../../config/constants.js";

const getRegistrations = async () => {
  return await Registration.find({}, excludeItems).lean();
};

const addRegistration = async (data) => {
  return await Registration.create(data);
};

const findRegistration = async (data) => {
  const phoneNumber = data.phoneNumber;
  const email = data.email;
  // const clientReference = data.clientReference;

  return await Registration.findOne(
    {
      phoneNumber: phoneNumber,
      email: email,
      // clientReference: clientReference,
    },
    excludeItems
  ).lean();
};

export { getRegistrations, addRegistration, findRegistration };
