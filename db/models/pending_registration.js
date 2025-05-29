import { model } from "mongoose";
import { dataSchema } from "../schema/pending_registration.js";

export default model("PendingRegistration", dataSchema);