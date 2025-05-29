import { model } from "mongoose";
import { dataSchema } from "../schema/sms";

export default model("SmsReceipt", dataSchema);