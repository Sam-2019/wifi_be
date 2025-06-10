import AdminJS from "adminjs";
import Sms from "../db/modelsXschema/sms.js";
import Sale from "../db/modelsXschema/sale.js";
import * as AdminJSMongoose from "@adminjs/mongoose";
import PendingRegistration from "../db/modelsXschema/pending_registration.js";

AdminJS.registerAdapter({
  Resource: AdminJSMongoose.Resource,
  Database: AdminJSMongoose.Database,
});

const DEFAULT_ADMIN = {
  email: process.env.USER_EMAIL,
  password: process.env.USER_PASSWORD,
};

const authenticate = async (email, password) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN);
  }
  return null;
};

const adminOptions = {
  resources: [PendingRegistration, Sale, Sms],
};

const admin = new AdminJS(adminOptions);

const COOKIE = process.env.COOKIE_NAME;
const COOKIE_PASS = process.env.COOKIE_PASSWORD;

export { admin, authenticate, COOKIE, COOKIE_PASS };
