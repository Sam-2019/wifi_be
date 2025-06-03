import path from "path";
import "dotenv/config";

const development = "development";
const production = "production";

const unauthorized = "Unauthorized";
const forbidden = "Forbidden";
const authorization = "authorization";
const success = "success";
const hubtel = "hubtel";

const __dirname = path.resolve();
const server_down = "server is down";
const server_up = "server is up";
const server_url = process.env.SERVER_URL;

export {
  development,
  production,
  unauthorized,
  forbidden,
  authorization,
  success,
  hubtel,
  __dirname,
  server_down,
  server_up,
  server_url,
};
