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

const bearer = process.env.BEARER;
const baseURL = process.env.BASE_PROD_URL;

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

const mikrotikCredentials = {
  port: process.env.MIKROTIK_PORT,
  host: process.env.MIKROTIK_HOST,
  username: process.env.MIKROTIK_USERNAME,
  password: process.env.MIKROTIK_PASSWORD,
};

const topup = "Top Up";
const registration = "Registration";

const dataPlans = {
  DAILY: {
    name: "Daily",
    uptime: "1d",
    uptimeSub: "1d 00:00:00",
    uptimeSeconds: 86400,
  },
  WEEKLY: {
    name: "Weekly",
    uptime: "7d",
    uptimeSub: "7d 00:00:00",
    uptimeSeconds: 604800,
  },
  MONTHLY: {
    name: "Monthly",
    uptime: "30d",
    uptimeSub: "30d 00:00:00",
    uptimeSeconds: 2592000,
  },
  MEMBERSHIP: {
    name: "Membership",
    uptime: "1h",
    uptimeSub: "01:00:00",
    uptimeSeconds: 3600,
  },
};

const getSelectedPlan = (data) => {
  const key = Object.keys(dataPlans).find((planKey) => data.includes(planKey));

  return key ? dataPlans[key] : dataPlans.DAILY;
};

// A simple parser for uptime string to seconds
const parseUptimeToSeconds = (uptimeString) => {
  let totalSeconds = 0;
  // Handle days
  const dMatch = uptimeString.match(/(\d+)d/);
  if (dMatch) totalSeconds += Number.parseInt(dMatch[1], 10) * 86400; // 24 * 60 * 60
  // Handle hours
  const hMatch = uptimeString.match(/(\d+)h/);
  if (hMatch) totalSeconds += Number.parseInt(hMatch[1], 10) * 3600;
  // Handle minutes
  const mMatch = uptimeString.match(/(\d+)m/);
  if (mMatch) totalSeconds += Number.parseInt(mMatch[1], 10) * 60;
  // Handle seconds
  const sMatch = uptimeString.match(/(\d+)s/);
  if (sMatch) totalSeconds += Number.parseInt(sMatch[1], 10);

  return totalSeconds;
};

const httpStatus = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export {
  ttl,
  admin,
  topup,
  hubtel,
  bearer,
  success,
  baseURL,
  paystack,
  dataPlans,
  __dirname,
  assetPath,
  forbidden,
  server_up,
  httpStatus,
  successful,
  production,
  companyName,
  server_down,
  development,
  unauthorized,
  registration,
  excludeItems,
  authorization,
  componentPath,
  getSelectedPlan,
  mikrotikCredentials,
  internalServerError,
  parseUptimeToSeconds,
};
