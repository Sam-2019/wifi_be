import RouterOSClient from "ros-client";
import { mikrotikCredentials, defaultMikrotikServer } from "../../config/constants";

// Create API client instance
const api = new RouterOSClient({
    ...mikrotikCredentials,
    tls: false, // Set to true for encrypted connection
});

const modifiedUser = (user) => {
    return {
        "id": user[0]?.id,
        "name": user[0]?.name,
        "server": user[0]?.server,
        "profile": user[0]?.profile,
        "uptime": user[0]?.uptime,
        "bytesIn": user[0]?.["bytes-in"],
        "bytesOut": user[0]?.["bytes-out"],
        "packetsIn": user[0]?.["packets-in"],
        "packetsOut": user[0]?.["packets-out"],
        "dynamic": user[0]?.dynamic,
        "disabled": user[0]?.disabled,
        "comment": user[0]?.comment,
    }
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
}

const getUser = async (username) => {
    try {
        await api.connect();
        const user = await api.send(["/ip/hotspot/user/print", `?name=${username}`]);
        await api.close();
        return modifiedUser(user);
    } catch (err) {
        console.error("❌ Error:", err.message);
    }
}

const disableUser = async (username) => {
    try {
        await api.connect();
        const user = await api.send(["/ip/hotspot/user/set", `=.id=${username}`, "=disabled=true"]);
        await api.close();
        return modifiedUser(user);
    } catch (err) {
        console.error("❌ Error:", err.message);
    }
}

const enableUser = async (username) => {
    try {
        await api.connect();
        const user = await api.send(["/ip/hotspot/user/set", `=.id=${username}`, "=disabled=false"]);
        await api.close();
        return modifiedUser(user);
    } catch (err) {
        console.error("❌ Error:", err.message);
    }
}

const addUser = async (userData) => {
    try {
        await api.connect();
        const user = await api.send([
            "/ip/hotspot/user/add",
            `=name=${userData?.username}`,
            `=password=${userData?.password}`,
            `=email=${userData?.email || ""}`,
            `=profile=${userData?.profile}`,
            `=server=${defaultMikrotikServer}`,
            `=comment=${userData?.comment || new Date().toISOString()}`,
        ]);
        await api.close();
        return modifiedUser(user);
    } catch (err) {
        console.error("❌ Error:", err.message);
    }
}

export { getUsers, getUser, disableUser, enableUser, addUser }