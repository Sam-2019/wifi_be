import { cabin } from "./logger/index.js";
import { server_url } from "../config/constants.js";

async function pingServer() {
  fetch(server_url)
    .then((response) => {
      cabin.info("Server is up:", response.status);
    })
    .catch((error) => {
      cabin.err("Server is down:", error.message);
    });
}

function pinger(callback, timer) {
  setInterval(async () => {
    cabin.info("Pinger running");
    await callback();
  }, timer);
}

const ping = () => {
  cabin.info("Pinger started");
  pinger(pingServer, 13 * 60 * 1000);
};

export { ping };
