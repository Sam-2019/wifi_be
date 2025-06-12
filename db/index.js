import mongoose from "mongoose";
import { seed } from "../config/seed.js";
import { db_uri, db_name, isDevelopment } from "../config/constants.js";

const dbConn = mongoose.connection;
dbConn.on("connected", () => {
  if (isDevelopment) seed();
  console.log("Mongoose connected");
});

const connectDB = () => {
  mongoose.connect(db_uri, {
    dbName: db_name,
    autoIndex: false,
  });
};

const disconnectDB = () => {
  mongoose.connection.close();
};

export { connectDB, disconnectDB };
