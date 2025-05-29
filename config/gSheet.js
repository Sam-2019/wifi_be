import { development } from "./constants.js";

const NODE_ENV = process.env.NODE_ENV;
const DEV_GSHEET = process.env.VITE_GOOGLE_SCRIPTS_TEST;
const PROD_GSHEET = process.env.VITE_GOOGLE_SCRIPTS_LIVE;
const DB_URI = NODE_ENV === development ? DEV_GSHEET : PROD_GSHEET;

const writeToSheet = async (payload) => {
  fetch(DB_URI, {
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

export { writeToSheet };
