import {
  ttl,
  dbUri,
  crypto,
  dbName,
  secret,
  dbCollection,
} from "../../config/constants.js";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import { cabin } from "../jobs/index.js";

const dbConn = mongoose.connection;
dbConn.on("connected", () => {
  cabin.info("Mongoose connected");
});

const connectDB = async () => {
  await mongoose.connect(dbUri, {
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
