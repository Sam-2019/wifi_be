import Sale from "../modelsXschema/sale.js";

const getSales = async () => {
  return await Sale.find({});
};

const addSale = async (data) => {
  return await Sale.create(data);
};

const findSale = async (id) => {
  return await Sale.findOne({
    id: id,
  });
};

export { getSales, addSale, findSale };
