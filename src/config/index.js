const config = {
  storage: {
    bucketName: process.env.S3_BUCKET_NAME,
  },
  database: {
    uri: process.env.DB_URI,
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
};

export { config };
