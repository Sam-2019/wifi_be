import { model, Schema } from "mongoose";

const dataSchema = new Schema(
  {
    name: { type: String },
    phoneNumber: { type: String },
    category: { type: String },
    comment: { type: String },
  },
  {
    timestamps: true,
  }
);

const Feedback = model("Feedback", dataSchema);
export default Feedback;
