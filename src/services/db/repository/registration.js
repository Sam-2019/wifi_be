import Registration from "../modelsXschema/registration.js";
import { excludeItems, registration, excludeItemsRegistrations } from "../../../config/constants.js";

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
    excludeItems
  ).lean();
};

const getRegistrationByReference = async (data) => {
  const clientReference = data;
  
  return await Registration.findOne(
    {
      clientReference: clientReference
    },
    excludeItemsRegistrations
  )
    .sort({ $natural: -1 })
    .lean();
}
export { addRegistration, getRegistration, getRegistrations, getRegistrationByReference };
