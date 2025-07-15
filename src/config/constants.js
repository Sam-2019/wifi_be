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

const clientID = process.env.MERCHANT;
const authToken = process.env.BASIC_AUTH;
const server_url = process.env.SERVER_URL;
const hostUrl = process.env.TRANSACTION_STATUS_CHECK_URL;

const dbUri = process.env.DB_URL;
const dbName = process.env.DB_NAME;
const gsUri = process.env.GOOGLE_SCRIPTS;
const ntfyUri = process.env.NTFY_URL;
const ntfyTopic = process.env.NTFY_TOPIC;
const ntfyAuthorization = process.env.NTFY_AUTHORIZATION;

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
  regID: 0,
  createdAt: 0,
  updatedAt: 0,
  __v: 0,
};

const topup = "Top Up";
const registration = "Registration";

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
  companyName,
  emailExists,
  server_down,
  development,
  unauthorized,
  registration,
  excludeItems,
  authorization,
  componentPath,
  ntfyAuthorization,
  internalServerError,
  excludeItemsRegistrations
};
