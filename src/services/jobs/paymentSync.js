
import { connectDB } from "../db/index.js";
import { findSale } from "../db/repository/sale.js";
import { bearer, baseURL } from "../../config/constants.js";
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

      const sale = await findSale(clientReference)
      if (sale.clientReference) return;

      await fetch(`${baseURL}/api/payment/sync`, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify(payload),
        headers: {
          Authorization: `Bearer ${bearer}`,
          "Content-Type": "application/json",
        },
      }).then(async (response) => {
        if (response.status === 200) {
          return await ntfy({ route: "/paymentSync", payload: response });
        }
        await ntfy({ route: "/paymentSync", payload: "Registration not found" });
      }).catch(async (err) => {
        await ntfy({ route: "/paymentSync", payload: err });
      })
    });
  } else {
   console.log("All sales synced");
  }
};

paymentSync();
