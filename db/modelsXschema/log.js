import { model, Schema } from "mongoose";

const dataSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  recordId: { type: "String", required: true },
  recordTitle: { type: "String" },
  difference: "Object",
  action: { type: "String" },
  resource: { type: "String" },
  userId: { type: "String" },
});

const Logger = model("Log", dataSchema);
export default Logger;
