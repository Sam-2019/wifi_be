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
    subscriptionPlan: payload?.subscriptionPlan,
    clientReference: payload?.clientReference,
    userName: payload?.credentials?.username,
    registrationType: payload?.registrationType,
  };

  const alert = setupAlert(route, getInfo);

  await fetch(ntfyUri, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ntfyAuthorization}`,
    },
    body: JSON.stringify(alert),
  });
};
