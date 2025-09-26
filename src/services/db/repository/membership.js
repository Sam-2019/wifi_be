import Membership from "../modelsXschema/membership.js";
import { excludeItems } from "../../../config/constants.js";

const getMemberships = async () => {
  return await Membership.find({}, excludeItems).lean();
};

const addMembership = async (data) => {
  return await Membership.create(data);
};

const getActiveMembership = async () => {
  return await Membership.findOne({ status: "activated" }).lean();
};

const getInactiveMembership = async () => {
  return await Membership.findOne({ status: "inactive" }).lean();
};

export { getMemberships, addMembership, getActiveMembership, getInactiveMembership };
