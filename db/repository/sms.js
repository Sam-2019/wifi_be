import Model from "../modelsXschema/sms";

const getSms = async () => {
  return await Model.find({});
};

const addSms = async (data) => {
  return await Model.create(data);
};

const findSms = async (id) => {
  return await Model.findOne({
    id: id,
  });
};

export { getSms, addSms, findSms };
