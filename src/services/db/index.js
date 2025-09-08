import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import { config } from "../../config/index.js";

const dbConn = mongoose.connection;
dbConn.on("connected", () => {
  console.log("Mongoose connected");
});

const connectDB = async () => {
  await mongoose.connect(config.database.uri, {
    dbName: config.database.name,
    autoIndex: true,
  });
};

const disconnectDB = async () => {
  await mongoose.connection.close();
  console.log("Mongoose disconnected");
};

const dbSession = {
  resave: true,
  saveUninitialized: true,
  secret: config.session.secret,
  store: MongoStore.create({
    mongoUrl: config.database.uri,
    dbName: config.database.name,
    mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
    collectionName: config.session.collection,
    ttl: 14 * 24 * 60 * 60,
    crypto: { secret: config.session.crypto },
  }),
};

export { connectDB, disconnectDB, dbSession };
