import { model, Schema } from "mongoose";

const dataSchema = new Schema(
  {
    fullName: { type: String },
    email: {
      type: String,
      required: true,
    },
    encryptedPassword: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Admin", "Restricted"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", dataSchema);
export default User;
