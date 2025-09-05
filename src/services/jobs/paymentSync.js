import { connectDB } from "../db/index.js";
import { config } from "../../config/index.js";
import { findSale } from "../db/repository/sale.js";
import { httpStatus } from "../../config/constants.js";
import { getTodaysRegistrations } from "../db/repository/registration.js";

const paymentSync = async () => {
  await connectDB();
  const registrations = await getTodaysRegistrations();
  if (registrations.length > 0) {
    registrations.forEach(async (user) => {
      const clientReference = user?.clientReference;
      const payload = {
        clientReference: clientReference,
      };

      const sale = await findSale(clientReference);
      if (sale.clientReference) return;

      await fetch(`${config.server.uri}/api/payment/sync`, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify(payload),
        headers: {
          Authorization: `Bearer ${config.authorization.bearer}`,
          "Content-Type": "application/json",
        },
      })
        .then(async (response) => {
          if (response.status === httpStatus.OK) {
            return await ntfy({ payload: `👍🏾 Payment Sync: ${response}` });
          }
          await ntfy({ payload: "🤷🏾 Payment Sync: Registration not found" });
        })
        .catch(async (err) => {
          await ntfy({ payload: `🤬 Payment Sync: ${err}` });
        });
    });
  } else {
    console.log("All sales synced");
  }
};

paymentSync();
