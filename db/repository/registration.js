import Model from "../modelsXschema/registration.js";

const getRegistration = async () => {
  return await Model.find({});
};

const addRegistration = async (data) => {
  return await Model.create(data);
};

const findRegistration = async (clientReference) => {
  return await Model.findOne({
    clientReference: clientReference,
  });
};

export { getRegistration, addRegistration, findRegistration };
