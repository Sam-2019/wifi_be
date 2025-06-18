import { model, Schema } from "mongoose";

const dataSchema = new Schema(
  {
    regID: { type: String },
    fullName: { type: String },
    phoneNumber: { type: String },
    email: { type: String, lowercase: true },
    dateOfBirth: { type: Date },
    blockCourt: { type: String },
    roomType: { type: String },
    roomNumber: { type: String },
    isCustodian: { type: Boolean, default: false },
    dateTime: { type: Date, default: Date.now() },
    credentials: { type: Object },
  },
  {
    timestamps: true,
  },
);

const Customer = model("Customer", dataSchema);
export default Customer;