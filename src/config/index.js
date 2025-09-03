const config = {
  storage: {
    bucketName: process.env.S3_BUCKET_NAME,
  },
  database: {
    name: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  notify: {
    uri: process.env.NTFY_URL,
    topic: process.env.NTFY_TOPIC,
    auth: process.env.NTFY_AUTH,
  },
};

export { config };
