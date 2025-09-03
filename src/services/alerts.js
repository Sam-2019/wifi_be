import { config } from "../config/index.js";

const priority = 4;
const topic = config.notify.topic;
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
  if (!config.notify.uri || !config.notify.topic || !config.notify.auth) return;
  if (!route) return;
  if (!payload) return;

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

  await fetch(config.notify.uri, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.notify.auth}`,
    },
    body: JSON.stringify(alert),
  });
};
