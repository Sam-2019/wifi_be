import { model, Schema } from "mongoose";

const dataSchema = new Schema(
    {
        provider: { type: String },
        providerResponse: { type: Object },
        clientReference: { type: String },
        responseCode: { type: String },
        message: { type: String },
        transactionId: { type: String },
        externalTransactionId: { type: String },
        paymentDate: { type: Date }
    },
    {
        timestamps: true,
    },
);

const Callback = model("Callback", dataSchema);
export default Callback;
