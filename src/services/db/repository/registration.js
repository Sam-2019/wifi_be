import Registration from "../modelsXschema/registration.js";
import { excludeItems, registration } from "../../../config/constants.js";

const getRegistrations = async () => {
  return await Registration.find({}, excludeItems).lean();
};

const addRegistration = async (data) => {
  return await Registration.create(data);
};

const getRegistration = async (data) => {
  const email = data?.email;
  const userName = data?.userName;
  const phoneNumber = data?.phoneNumber;

  return await Registration.findOne(
    {
      email: email,
      phoneNumber: phoneNumber,
      registrationType: registration,
      "credentials.userName": userName,
    },
    excludeItems,
  ).lean();
};

export { addRegistration, getRegistration, getRegistrations };
