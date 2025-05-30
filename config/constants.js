import path from "path";
import "dotenv/config";

const development = "development";
const production = "production";

const unauthorized = "Unauthorized";
const forbidden = "Forbidden";
const authorization = "authorization";
const success = "Success";
const hubtel = process.env.VITE_HUBTEL;

const __dirname = path.resolve();

export {
  development,
  production,
  unauthorized,
  forbidden,
  authorization,
  success,
  hubtel,
  __dirname,
};
