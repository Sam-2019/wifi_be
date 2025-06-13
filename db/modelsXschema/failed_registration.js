import { model, Schema } from "mongoose";

const dataSchema = new Schema(
  {
    regID: { type: String },
    fullName: { type: String },
    phoneNumber: { type: String },
    subscriptionPlan: { type: String },
    planFee: { type: Number },
    registrationFee: { type: Number },
    totalCost: { type: Number },
    clientReference: { type: String },
    email: { type: String },
    dateOfBirth: { type: Date },
    blockCourt: { type: String },
    roomType: { type: String },
    roomNumber: { type: String },
    isCustodian: { type: Boolean, default: false },
    dateTime: { type: Date, default: Date.now() },
    credentials: { type: String },
    provider: { type: String },
    registrationType: { type: String },
    purchaseInfo: { type: String },
  },
  {
    timestamps: true,
  }
);

export default model("FailedRegistration", dataSchema);
