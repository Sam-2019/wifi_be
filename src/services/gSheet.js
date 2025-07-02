import { gsUri } from "../config/constants.js";

export const writeToSheet = async (payload, path) => {
  const updatedPayload =
    path === "pendingRegistration"
      ? {
          ...payload,
          path,
        }
      : payload;

  fetch(gsUri, {
    method: "POST",
    mode: "no-cors",
    body: JSON.stringify(updatedPayload),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(() => {
    // console.log("Data sent to Google Scripts successfully");
  });
};
