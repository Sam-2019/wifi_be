import path from "path";
import "dotenv/config";

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
const componentPath = "src/ui/components/";

const clientID = process.env.MERCHANT;
const authToken = process.env.BASIC_AUTH;
const server_url = process.env.SERVER_URL;
const hostUrl = process.env.TRANSACTION_STATUS_CHECK_URL;

const dbUri = process.env.DB_URL;
const dbName = process.env.DB_NAME;
const gsUri = process.env.GOOGLE_SCRIPTS;

const secret = process.env.SESSION_SECRET;
const crypto = process.env.SESSION_CRYPTO_SECRET;
const dbCollection = process.env.SESSION_COLLECTION;

const apiUrl = `${hostUrl}/${clientID}/status`;
const internalServerError = "Internal Server Error";

const ttl = 14 * 24 * 60 * 60;

const excludeItems = {
  _id: 0,
  regID: 0,
  credentials: 0,
  createdAt: 0,
  updatedAt: 0,
  __v: 0,
};

const salt = Number(process.env.SALT);
const cookie = process.env.COOKIE_NAME;
const cookiePass = process.env.COOKIE_PASSWORD;

const adminCredentials = {
  role: process.env.USER_ROLE,
  email: process.env.USER_EMAIL,
  userID: process.env.USER_ID,
  fullName: process.env.USER_NAME,
  password: process.env.USER_PASSWORD,
};

const topup = "Top Up";
const registration = "Registration";

export {
  ttl,
  salt,
  dbUri,
  admin,
  topup,
  gsUri,
  apiUrl,
  cookie,
  dbName,
  secret,
  crypto,
  hubtel,
  success,
  paystack,
  __dirname,
  assetPath,
  forbidden,
  authToken,
  server_up,
  cookiePass,
  server_url,
  successful,
  production,
  companyName,
  server_down,
  development,
  unauthorized,
  registration,
  dbCollection,
  excludeItems,
  authorization,
  componentPath,
  adminCredentials,
  internalServerError,
};
