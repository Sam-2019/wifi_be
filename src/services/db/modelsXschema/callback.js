import { model, Schema } from "mongoose";

const dataSchema = new Schema(
    {
        provider: { type: String },
        response: { type: Object }
    },
    {
        timestamps: true,
    },
);

const Callback = model("Callback", dataSchema);
export default Callback;
