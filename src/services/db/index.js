import mongoose from "mongoose";
import { cabin } from "../logger/index.js";
import { dbUri, dbName } from "../../config/constants.js";

const dbConn = mongoose.connection;
dbConn.on("connected", () => {
  cabin.info("Mongoose connected");
});

const connectDB = async () => {
  await mongoose.connect(dbUri, {
    dbName: dbName,
    // autoIndex: true,
  });
};

const disconnectDB = () => {
  mongoose.connection.close();
};

export { connectDB, disconnectDB };
