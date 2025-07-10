import Sale from "../modelsXschema/sale.js";
import { excludeItems } from "../../../config/constants.js";

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

const todaySales = async () => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  return await Sale
    .where('createdAt').gte(startOfDay).lte(endOfDay)
    .where('registrationType', /^Registration/i)
    .lean();
};

export { getSales, addSale, findSale, todaySales };
