import { model } from "mongoose";
import { dataSchema } from "../schema/sale.js";

export default model("Sales", dataSchema);