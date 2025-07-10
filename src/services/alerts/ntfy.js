import { ntfyUri, ntfyTopic, ntfyAuthorization } from "../config/constants.js";

const priority = 4;
const topic = ntfyTopic;
// const tags = ["warning", "cd"];

const setupAlert = (title, message) => {
  return {
    topic: topic,
    title: title,
    // "tags": tags,
    priority: priority,
    message: JSON.stringify(message),
  };
};

const successAlert = (payload) => {
  return setupAlert("Account Provisioned", payload);
};

const failAlert = (payload) => {
  return setupAlert("Account Provisioned", payload);
};

export const ntfy = async ({ payload, route }) => {
  if (!ntfyUri || !ntfyTopic || !ntfyAuthorization) {
    console.error("Ntfy configuration is missing.");
    return;
  }
  if (!route) {
    console.error("Route is required for ntfy notification.");
    return;
  }

  if (!payload) {
    console.error("Payload is required for ntfy notification.");
    return;
  }

  const getInfo = {
    name: payload?.fullName,
    blockCourt: payload?.blockCourt,
    roomNumber: payload?.roomNumber,
    clientReference: payload?.clientReference,
    userName: payload?.credentials?.username,
    registrationType: payload?.registrationType,
  };

  const getPayload = (route) => {
    switch (route) {
      case "/provisionSuccess":
        return successAlert(getInfo);
      case "/provisionFailed":
        return failAlert(payload);
      default:
        console.error("Invalid alert type provided.");
        return null;
    }
  };

  await fetch(ntfyUri, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ntfyAuthorization}`,
    },
    body: JSON.stringify(getPayload(route)),
  });
};
