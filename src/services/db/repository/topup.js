import Topup from "../modelsXschema/topup.js";
import { excludeItems } from "../../../config/constants.js";

const getTopups = async () => {
  return await Topup.find({}, excludeItems).lean();
};

const addTopup = async (data) => {
  return await Topup.create(data);
};

const getActiveTopup = async () => {
  return await Topup.findOne({ status: "active" })
};

export { getTopups, addTopup, getActiveTopup };
