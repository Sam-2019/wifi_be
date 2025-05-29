import Model from "../models/sale.js";

const getSales = async () => {
  return await Model.find({});
};

const addSale = async (data) => {
  return await Model.create(data);
};

const findSale = async (id) => {
  return await Model.findOne({
    id: id,
  });
};

export { getSales, addSale, findSale };
