import { model, Schema } from "mongoose";
import beautify from "mongoose-beautiful-unique-validation";

const dataSchema = new Schema(
  {
    regID: { type: String },
    fullName: { type: String },
    phoneNumber: { type: String },
    email: { type: String, lowercase: true, unique: true },
    dateOfBirth: { type: Date },
    blockCourt: { type: String },
    roomType: { type: String },
    roomNumber: { type: String },
    isCustodian: { type: Boolean, default: false },
    dateTime: { type: Date, default: Date.now() },
    credentials: {
      userName: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

dataSchema.plugin(beautify);

const Customer = model("Customer", dataSchema);
export default Customer;
