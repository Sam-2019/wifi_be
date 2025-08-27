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

const getExpiredMembership = async () => {
  return await Membership.findOne({ status: "expired" }).lean();
};

export { getMemberships, addMembership, getActiveMembership, getExpiredMembership };
