import { config } from "../config/index.js";

export const writeToSheet = async (payload) => {
  fetch(config.google.uri, {
    method: "POST",
    mode: "no-cors",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(() => {
    // console.log("Data sent to Google Scripts successfully");
  });
};
