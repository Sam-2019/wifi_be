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
    id: user[0]?.id || null,
    name: user[0]?.name,
    server: user[0]?.server,
    profile: user[0]?.profile,
    limitUptime: user[0]?.["limit-uptime"],
    uptime: user[0]?.["uptime"],
    bytesIn: user[0]?.["bytes-in"],
    bytesOut: user[0]?.["bytes-out"],
    packetsIn: user[0]?.["packets-in"],
    packetsOut: user[0]?.["packets-out"],
    dynamic: user[0]?.dynamic,
    disabled: user[0]?.disabled,
    comment: user[0]?.comment,
  };
};

const pingMikrotik = async () => {
  try {
    return await api.connect();
  } catch (err) {
    throw err.message;
  }
};

const getUsers = async () => {
  try {
    await api.connect();
    const users = await api.send(["/ip/hotspot/user/print"]);
    await api.close();
    return users;
  } catch (err) {
    throw err.message;
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

    if (user.length === 0) {
      return null;
    }
    return modifiedUser(user);
  } catch (err) {
    throw err.message;
  }
};

const disableUser = async (userName) => {
  try {
    await api.connect();
    await api.send([
      "/ip/hotspot/user/set",
      `=.id=${userName}`,
      "=disabled=true",
    ]);
    await api.close();
  } catch (err) {
    throw err.message;
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
    throw err.message;
  }
};

const createUser = async (userData) => {
  try {
    await api.connect();
    await api.send([
      "/ip/hotspot/user/add",
      `=name=${userData?.name}`,
      `=password=${userData?.password}`,
      `=email=${userData?.email}`,
      `=profile=${userData?.profile}`,
      `=server=${defaultMikrotikServer}`,
      `=comment=${userData?.comment}`,
    ]);
    await api.close();
    return true;
  } catch (err) {
    throw err.message;
  }
};

export { pingMikrotik, getUsers, getUser, disableUser, enableUser, createUser };
