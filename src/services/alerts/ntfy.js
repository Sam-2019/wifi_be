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
    message: message,
  };
};

export const ntfy = async ({ payload }) => {
  if (!ntfyUri || !ntfyTopic || !ntfyAuthorization) {
    console.error("Ntfy configuration is missing.");
    return;
  }

  if (!payload) {
    console.error("Payload is required for ntfy notification.");
    return;
  }

  const beforeColon = /^(.*?)(?=:)/gm;
  const afterColon = /(?<=: )(.*)/gm;

  const title = payload.match(beforeColon);
  const message = payload.match(afterColon);
  const alert = setupAlert(title[0], message[0]);

  await fetch(ntfyUri, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ntfyAuthorization}`,
    },
    body: JSON.stringify(alert),
  });
};
