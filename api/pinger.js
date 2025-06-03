import axios from "axios";
import { server_url, server_up, server_down } from "../config/constants.js";

async function pingServer() {
  return axios
    .get(server_url)
    .then((res) => server_up)
    .catch((error) => server_down);
}

function pinger(callback, timer) {
  setInterval(async function () {
    console.log("Pinger running");
    await callback();
  }, timer);
}

const ping = () => {
  console.log("Pinger started");
  pinger(pingServer, 3 * 60 * 1000);
};

export { ping };