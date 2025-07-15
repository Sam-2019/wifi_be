import RouterOSClient from "ros-client";
import {
  mikrotikCredentials,
  defaultMikrotikServer,
} from "../../config/constants.js";

// Create API client instance
const api = new RouterOSClient({
  ...mikrotikCredentials,
  tls: false,
});

const modifiedUser = (user) => {
  return {
    id: user[0]?.id,
    name: user[0]?.name,
    server: user[0]?.server,
    profile: user[0]?.profile,
    uptime: user[0]?.uptime,
    bytesIn: user[0]?.["bytes-in"],
    bytesOut: user[0]?.["bytes-out"],
    packetsIn: user[0]?.["packets-in"],
    packetsOut: user[0]?.["packets-out"],
    dynamic: user[0]?.dynamic,
    disabled: user[0]?.disabled,
    comment: user[0]?.comment,
  };
};

const getUsers = async () => {
  try {
    await api.connect();
    const users = await api.send(["/ip/hotspot/user/print"]);
    await api.close();
    return users;
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
};

const getUser = async (userName) => {
  try {
    await api.connect();
    const user = await api.send([
      "/ip/hotspot/user/print",
      `?name=${userName}`,
    ]);
    await api.close();
    return modifiedUser(user);
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
};

const disableUser = async (userName) => {
  try {
    await api.connect();
    const user = await api.send([
      "/ip/hotspot/user/set",
      `=.id=${userName}`,
      "=disabled=true",
    ]);
    await api.close();
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
};

const enableUser = async (userName) => {
  try {
    await api.connect();
    const user = await api.send([
      "/ip/hotspot/user/set",
      `=.id=${userName}`,
      "=disabled=false",
    ]);
    await api.close();
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
};

const createUser = async (userData) => {
  try {
    await api.connect();
    const user = await api.send([
      "/ip/hotspot/user/add",
      `=name=${userData?.credentials?.userName}`,
      `=password=${userData?.credentials?.password}`,
      `=email=${userData?.email}`,
      `=profile=${userData?.profile}`,
      `=server=${defaultMikrotikServer}`,
      `=comment=${userData?.comment}`,
    ]);
    await api.close();
    return modifiedUser(user);
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
};

export { getUsers, getUser, disableUser, enableUser, createUser };
