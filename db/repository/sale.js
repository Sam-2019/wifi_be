import Sale from "../modelsXschema/sale.js";
import { excludeItems } from "../../config/constants.js";

const getSales = async () => {
  return await Sale.find({}, excludeItems).lean();
};

const addSale = async (data) => {
  return await Sale.create(data);
};

const findSale = async (data) => {
  const clientReference = data?.clientReference;

  return await Sale.findOne(
    {
      clientReference: clientReference,
    },
    excludeItems
  ).lean();
};

export { getSales, addSale, findSale };
