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
const bearer = process.env.BEARER;
const dbName = process.env.DB_NAME;
const ntfyUri = process.env.NTFY_URL;
const gsUri = process.env.GOOGLE_SCRIPTS;
const ntfyTopic = process.env.NTFY_TOPIC;
const baseURL = process.env.BASE_PROD_URL;
const ntfyAuthorization = process.env.NTFY_AUTHORIZATION;

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

const mikrotikCredentials = {
  port: process.env.MIKROTIK_PORT,
  host: process.env.MIKROTIK_HOST,
  username: process.env.MIKROTIK_USERNAME,
  password: process.env.MIKROTIK_PASSWORD,
};
const defaultMikrotikServer = process.env.MIKROTIK_DEFAULT_SERVER || "hotspot1";

const topup = "Top Up";
const registration = "Registration";

const dataPlans = {
  DAILY: {
    name: "Daily",
    uptime: "1d",
    uptimeSub: "1d 00:00:00",
  },
  WEEKLY: {
    name: "Weekly",
    uptime: "7d",
    uptimeSub: "7d 00:00:00",
  },
  MONTHLY: {
    name: "Monthly",
    uptime: "30d",
    uptimeSub: "30d 00:00:00",
  },
  MEMBERSHIP: {
    name: "Membership",
    uptime: "1h",
    uptimeSub: "01:00:00",
  },
};

const getSelectedPlan = (data) => {
  const key = Object.keys(dataPlans).find((planKey) => data.includes(planKey));

  return key ? dataPlans[key] : dataPlans.DAILY;
};

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
  bearer,
  success,
  ntfyUri,
  baseURL,
  paystack,
  dataPlans,
  ntfyTopic,
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
  getSelectedPlan,
  adminCredentials,
  mikrotikCredentials,
  ntfyAuthorization,
  internalServerError,
  defaultMikrotikServer,
};
