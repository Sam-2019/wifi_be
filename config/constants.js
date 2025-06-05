import path from "path";
import "dotenv/config";

const development = "development";
const production = "production";

const unauthorized = "Unauthorized";
const forbidden = "Forbidden";
const authorization = "authorization";
const success = "success";
const successful = "successful";
const hubtel = "hubtel";

const __dirname = path.resolve();
const server_down = "server is down";
const server_up = "server is up";

const server_url = process.env.SERVER_URL;
const clientID = process.env.MERCHANT;
const hostUrl = process.env.TRANSACTION_STATUS_CHECK_URL;
const authToken = process.env.BASIC_AUTH;
const apiUrl = `${hostUrl}/${clientID}/status`;
const isDevelopment = process.env.NODE_ENV === development;
const serverMode  = isDevelopment ? "Development Mode" : "Production Mode";

export {
  development,
  production,
  unauthorized,
  forbidden,
  authorization,
  success,
  successful,
  hubtel,
  __dirname,
  server_down,
  server_up,
  server_url,
  authToken,
  apiUrl,
  isDevelopment,
  serverMode
};
