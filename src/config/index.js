import "dotenv/config";

const config = {
  server: {
    port: process.env.PORT,
    uri: process.env.SERVER_URL,
  },
  database: {
    uri: process.env.DB_URL,
    name: process.env.DB_NAME,
  },
  notify: {
    uri: process.env.NTFY_URL,
    topic: process.env.NTFY_TOPIC,
    auth: process.env.NTFY_AUTH,
  },
  google: {
    uri: process.env.GOOGLE_SCRIPTS,
  },
  authorization: {
    bearer: process.env.AUTHORIZATION,
  },
  gateway: {
    clientid: process.env.MERCHANT,
    token: process.env.BASIC_AUTH,
    url: process.env.TRANSACTION_STATUS_CHECK_URL,
  },
};

export { config };
