import path from "path";
import "dotenv/config";

const hubtel = "hubtel";
const success = "success";
const paystack = "paystack";
const forbidden = "Forbidden";
const successful = "successful";
const production = "production";
const __dirname = path.resolve();
const server_up = "server is up";
const development = "development";
const unauthorized = "Unauthorized";
const server_down = "server is down";
const authorization = "authorization";

const clientID = process.env.MERCHANT;
const authToken = process.env.BASIC_AUTH;
const server_url = process.env.SERVER_URL;
const hostUrl = process.env.TRANSACTION_STATUS_CHECK_URL;

const DEV_DB = process.env.DEV_DB;
const PROD_DB = process.env.PROD_DB;
const DEV_DB_NAME = process.env.DEV_DB_NAME;
const PROD_DB_NAME = process.env.PROD_DB_NAME;

const DEV_GSHEET = process.env.GOOGLE_SCRIPTS_TEST;
const PROD_GSHEET = process.env.GOOGLE_SCRIPTS_LIVE;

const apiUrl = `${hostUrl}/${clientID}/status`;
const internalServerError = "Internal Server Error";
const isDevelopment = process.env.NODE_ENV === development;
const serverMode = isDevelopment ? "Development Mode" : "Production Mode";

const db_uri = isDevelopment ? DEV_DB : PROD_DB;
const gs_uri = isDevelopment ? DEV_GSHEET : PROD_GSHEET;
const db_name = isDevelopment ? DEV_DB_NAME : PROD_DB_NAME;

const excludeItems = {
  _id: 0,
  regID: 0,
  credentials: 0,
  createdAt: 0,
  updatedAt: 0,
  __v: 0,
};

export {
  hubtel,
  apiUrl,
  db_uri,
  gs_uri,
  db_name,
  success,
  paystack,
  __dirname,
  forbidden,
  authToken,
  server_up,
  server_url,
  successful,
  serverMode,
  production,
  server_down,
  development,
  unauthorized,
  excludeItems,
  authorization,
  isDevelopment,
  internalServerError,
};
