import { MikroClient } from "mikro-client";

export const mikrotikOptions = {
  host: "XXX.XXX.XXX.XXX",
  port: "XXXX",
  username: "xxxxx",
  password: "xxxxx",
  timeout: 5000,
};

export const mikro = new MikroClient(mikrotikOptions);