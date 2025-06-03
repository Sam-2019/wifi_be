import { server_url } from "../config/constants.js";

async function pingServer() {
  fetch(server_url)
    .then((response) => {
      console.log("Server is up:", response.status);
    })
    .catch((error) => {
      console.error("Server is down:", error.message);
    });
}

function pinger(callback, timer) {
  setInterval(async () => {
    console.log("Pinger running");
    await callback();
  }, timer);
}

const ping = () => {
  console.log("Pinger started");
  pinger(pingServer, 13 * 60 * 1000);
};

export { ping };
