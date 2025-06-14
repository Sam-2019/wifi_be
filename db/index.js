import mongoose from "mongoose";
import { seed } from "../config/seed.js";
import {
  dbUri,
  dbName,
  isDevelopment,
  secret,
  dbCollection,
  ttl,
  crypto,
} from "../config/constants.js";
import MongoStore from "connect-mongo";

const dbConn = mongoose.connection;
dbConn.on("connected", () => {
  if (isDevelopment) seed();
  console.log("Mongoose connected");
});

const connectDB = () => {
  mongoose.connect(dbUri, {
    dbName: dbName,
    autoIndex: false,
  });
};

const disconnectDB = () => {
  mongoose.connection.close();
};

const dbSession = {
  resave: true,
  saveUninitialized: true,
  secret: secret,
  store: MongoStore.create({
    mongoUrl: dbUri,
    dbName: dbName,
    collectionName: dbCollection,
    ttl: ttl,
    crypto: { secret: crypto },
  }),
};

export { connectDB, disconnectDB, dbSession };
