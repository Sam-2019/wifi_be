import Model from "../modelsXschema/sale.js";
import { excludeItems } from "../../config/constants.js";

const getSales = async () => {
  return await Model.find({}, excludeItems).lean();
};

const addSale = async (data) => {
  return await Model.create(data);
};

const findSale = async (data) => {
  const clientReference = data.clientReference;

  return await Model.findOne(
    {
      clientReference: clientReference,
    },
    excludeItems
  ).lean();
};

export { getSales, addSale, findSale };
