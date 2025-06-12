import { gs_uri } from "./constants.js";

export const writeToSheet = async (payload) => {
  fetch(gs_uri, {
    method: "POST",
    mode: "no-cors",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(() => {
    console.log("Data sent to Google Scripts successfully");
  });
};