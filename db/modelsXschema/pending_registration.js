import { model, Schema } from "mongoose";

const dataSchema = new Schema(
  {
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    subscriptionPlan: { type: String, required: true },
    planFee: { type: Number, required: true },
    registrationFee: { type: Number, required: true },
    totalCost: { type: Number, required: true },
    clientReference: { type: String, required: true },
    email: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    blockCourt: { type: String },
    roomType: { type: String },
    roomNumber: { type: String },
    isCustodian: { type: Boolean, default: false },
    dateTime: { type: String },
    credentials: { type: String },
    provider: { type: String },
    registrationType: { type: String, required: true },
    purchaseInfo: { type: String },
  },
  {
    timestamps: true,
  },
);

export default model("PendingRegistration", dataSchema);
