import mongoose from "mongoose";
import { seed } from "../../config/seed.js";
import { dbUri, dbName } from "../../config/constants.js";

const dbConn = mongoose.connection;
dbConn.on("connected", () => {
  seed();
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
