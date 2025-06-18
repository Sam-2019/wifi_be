import Registration from "../modelsXschema/registration.js";
import { excludeItems, registration, topup } from "../../config/constants.js";

const getRegistrations = async () => {
  return await Registration.find({}, excludeItems).lean();
};

const addRegistration = async (data) => {
  return await Registration.create(data);
};

const findRegistration = async (data) => {
  const email = data?.email;
  const userName = data?.userName;
  const phoneNumber = data?.phoneNumber;
  // const clientReference = data.clientReference;

  return await Registration.findOne(
    {
      "credentials.userName": userName,
      phoneNumber: phoneNumber,
      email: email,
      registrationType: registration,
      // clientReference: clientReference,
    },
    excludeItems
  ).lean();
};

export { getRegistrations, addRegistration, findRegistration };
