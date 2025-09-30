import path from "path";

const admin = "admin";
const topup = "Top Up";
const hubtel = "hubtel";
const success = "success";
const paystack = "paystack";
const forbidden = "Forbidden";
const assetPath = "./assets/";
const successful = "successful";
const production = "production";
const membership = "Membership";
const __dirname = path.resolve();
const server_up = "server is up";
const development = "development";
const companyName = "PentagonWifi";
const registration = "Registration";
const unauthorized = "Unauthorized";
const server_down = "server is down";
const authorization = "authorization";
const emailExists = "Email already exist";
const componentPath = "src/ui/components/";
const userExists = "Username already exist";
const emptyRequest = "Received with no data";
const internalServerError = "Internal Server Error";

const excludeItems = {
  _id: 0,
  regID: 0,
  credentials: 0,
  createdAt: 0,
  updatedAt: 0,
  __v: 0,
};

const excludeItemsRegistrations = {
  _id: 0,
  createdAt: 0,
  updatedAt: 0,
  __v: 0,
};

const httpStatus = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  FOUND: 302,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

export {
  admin,
  topup,
  hubtel,
  success,
  paystack,
  __dirname,
  assetPath,
  forbidden,
  server_up,
  successful,
  production,
  userExists,
  httpStatus,
  membership,
  companyName,
  emailExists,
  server_down,
  development,
  emptyRequest,
  unauthorized,
  registration,
  excludeItems,
  authorization,
  componentPath,
  internalServerError,
  excludeItemsRegistrations,
};
