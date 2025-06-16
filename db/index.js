import {
  ttl,
  dbUri,
  crypto,
  dbName,
  secret,
  dbCollection,
  isDevelopment,
} from "../config/constants.js";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import { seed } from "../config/seed.js";

const dbConn = mongoose.connection;
dbConn.on("connected", () => {
  // if (isDevelopment) seed();
  console.log("Mongoose connected");
});

const connectDB = () => {
  mongoose.connect(dbUri, {
    dbName: dbName,
    autoIndex: true,
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
