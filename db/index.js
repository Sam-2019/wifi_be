import mongoose from "mongoose";
import { development } from "../config/constants.js";

const DEV_DB = process.env.DEV_DB;
const PROD_DB = process.env.PROD_DB;
const NODE_ENV = process.env.NODE_ENV;

const DB_URI = NODE_ENV === development ? DEV_DB : PROD_DB;
const dbConn = mongoose.connection;
dbConn.on("connected", () => {
  console.log("Mongoose connected");
});

const connectDB = () => {
  mongoose.connect(DB_URI, {
    autoIndex: false,
  });
};

const disconnectDB = () => {
  mongoose.connection.close();
};

export { connectDB, disconnectDB };
