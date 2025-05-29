import { Schema } from "mongoose";

const dataSchema = new Schema(
 {
  mobile_number: {
   type: String,
  },
  message: {
   type: String,
  },
  from: {
   type: String,
  },
  provider: {
   type: String,
  },
  payload: {
   type: Object,
  },
 },
 { timestamps: true }
);

export { dataSchema };