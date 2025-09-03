import "dotenv/config";
import path from "path";

const admin = "admin";
const hubtel = "hubtel";
const success = "success";
const paystack = "paystack";
const forbidden = "Forbidden";
const assetPath = "./assets/";
const successful = "successful";
const production = "production";
const __dirname = path.resolve();
const server_up = "server is up";
const development = "development";
const companyName = "PentagonWifi";
const unauthorized = "Unauthorized";
const server_down = "server is down";
const authorization = "authorization";
const emailExists = "Email already exist";
const componentPath = "src/ui/components/";
const userExists = "Username already exist";
const emptyRequest = "Received with no data";

const clientID = process.env.MERCHANT;
const authToken = process.env.BASIC_AUTH;
const server_url = process.env.SERVER_URL;
const hostUrl = process.env.TRANSACTION_STATUS_CHECK_URL;

const dbUri = process.env.DB_URL;
const dbName = process.env.DB_NAME;
const gsUri = process.env.GOOGLE_SCRIPTS;

const apiUrl = `${hostUrl}/${clientID}/status`;
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

const topup = "Top Up";
const membership = "Membership";
const registration = "Registration";

const httpStatus = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

export {
  dbUri,
  admin,
  topup,
  gsUri,
  apiUrl,
  dbName,
  hubtel,
  success,
  ntfyUri,
  paystack,
  ntfyTopic,
  __dirname,
  assetPath,
  forbidden,
  authToken,
  server_up,
  server_url,
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
  ntfyAuthorization,
  internalServerError,
  excludeItemsRegistrations,
};
