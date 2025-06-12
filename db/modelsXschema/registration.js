import { model, Schema } from "mongoose";

const dataSchema = new Schema(
  {
    regID: { type: String, required: true },
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    subscriptionPlan: { type: String, required: true },
    planFee: { type: Number, required: true },
    registrationFee: { type: Number, required: true },
    totalCost: { type: Number, required: true },
    email: { type: String, required: true },
    dateOfBirth: { type: Date },
    blockCourt: { type: String },
    roomType: { type: String },
    roomNumber: { type: String },
    isCustodian: { type: Boolean, default: false },
    dateTime: { type: Date, default: Date.now() },
    credentials: { type: String },
    provider: { type: String },
    registrationType: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export default model("Registration", dataSchema);
