import mongoose from "mongoose";
import { dbUri, dbName } from "../../config/constants.js";

const dbConn = mongoose.connection;
dbConn.on("connected", () => {
  console.log("Mongoose connected");
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

export { connectDB, disconnectDB };
