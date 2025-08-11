import { model, Schema } from "mongoose";

const dataSchema = new Schema(
  {
    regID: { type: String },
    serialNo: { type: String },
    station: { type: String },
    isConfigured: { type: Boolean, default: false },
    isAllocated: { type: Boolean, default: false },
    customerId: { type: Schema.Types.ObjectId, ref: "Customer" },
  },
  {
    timestamps: true,
  }
);

const Router = model("Router", dataSchema);
export default Router;
