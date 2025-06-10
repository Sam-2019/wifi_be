import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import { isDevelopment } from "../config/constants.js";

const DEV_DB = process.env.DEV_DB;
const PROD_DB = process.env.PROD_DB;
const PROD_DB_NAME = process.env.PROD_DB_NAME;
const DEV_DB_NAME = process.env.DEV_DB_NAME;

const SECRET = process.env.SESSION_SECRET;
const CRYPTO = process.env.SESSION_CRYPTO_SECRET;
const DB_COLLECTION = process.env.SESSION_COLLECTION;

const DB_URI = isDevelopment ? DEV_DB : PROD_DB;
const DB_NAME = isDevelopment ? DEV_DB_NAME : PROD_DB_NAME;

const ttl = 14 * 24 * 60 * 60;

const dbConn = mongoose.connection;
dbConn.on("connected", () => {
  console.log("Mongoose connected");
});

const connectDB = () => {
  mongoose.connect(DB_URI, {
    dbName: DB_NAME,
    autoIndex: false,
  });
};

const disconnectDB = () => {
  mongoose.connection.close();
};

const dbSession = {
  resave: true,
  saveUninitialized: true,
  secret: SECRET,
  store: MongoStore.create({
    mongoUrl: DB_URI,
    dbName: DB_NAME,
    collectionName: DB_COLLECTION,
    ttl: ttl,
    crypto: { secret: CRYPTO },
    
  }),
};

export { connectDB, disconnectDB, dbSession };
