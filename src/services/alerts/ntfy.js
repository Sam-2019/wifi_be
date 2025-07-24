import {
  ntfyUri,
  ntfyTopic,
  ntfyAuthorization,
} from "../../config/constants.js";

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

  const getPayload = (route) => {
    switch (route) {
      case "/provisionFailed":
        return setupAlert("Account Creation Failed", payload);
      case "/provisionSuccess":
        return setupAlert("Account Creation", payload);
      case "/allProvisioned":
        return setupAlert("All Provisioned", "All customers provisioned");
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
