import { model, Schema } from "mongoose";

const dataSchema = new Schema({
  recordId: { type: String, required: true },
  recordTitle: { type: String },
  difference: { type: Object },
  action: { type: String },
  resource: { type: String },
  userId: { type: String },
},
  {
    timestamps: true,
  }
);

const Logger = model("Log", dataSchema);
export default Logger;
