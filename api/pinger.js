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
    await callback();
  }, timer);
}

const ping = () => {
  pinger(pingServer, 25 * 60 * 1000);
};

export { ping };