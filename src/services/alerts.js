import { ntfyUri, ntfyTopic, ntfyAuthorization } from "../config/constants.js";

const priority = 4;
const tags = ["registered"];
const topic = ntfyTopic;

const setupAlert = (title, message) => {
  return {
    topic: topic,
    message: message,
    title: title,
    tags: tags,
    priority: priority,
  };
}

const saleAlert = () => {
  return setupAlert("New Sale", `${payload}`);
}

const registrationAlert = () => {
  return setupAlert("New Registration", `${payload}`);
}

const pendingAlert = () => {
  return setupAlert("Pending Registration", `${payload}`);
}


const failedAlert = () => {
  return setupAlert("Failed Registration", `${payload}`);
}

const customerAlert = () => {
  return setupAlert("New Customer", `${payload}`);
}

const callbackAlert = () => {
  return setupAlert("Payment Callback", `${payload}`);
}

const statusCheckAlert = () => {
  return setupAlert("Payment Status Check", `${payload}`);
}

const syncAlert = () => {
  return setupAlert("Data Sync", `${payload}`);
}

export const ntfy = async (payload, route) => {
  if (!ntfyUri || !ntfyTopic || !ntfyAuthorization) {
    console.error("Ntfy configuration is missing.");
    return;
  }

  if (!payload) {
    console.error("Payload is required for ntfy notification.");
    return;
  }

  if (!route) {
    console.error("Route is required for ntfy notification.");
    return;
  }

  const getPayload = (route) => {
    switch (route) {
      case 'Sale':
        return saleAlert();
      case 'Registration':
        return registrationAlert();
      case 'Pending Registration':
        return pendingAlert();
      case 'Failed Registration':
        return failedAlert();
      case 'Customer':
        return customerAlert();
      case 'Payment Callback':
        return callbackAlert();
      case 'Payment Status':
        return statusCheckAlert();
      case 'Data Sync':
        return syncAlert();
      default:
        console.error("Invalid alert type provided.");
        return null;
    }
  };

  fetch(ntfyUri, {
    method: "POST",
    mode: "no-cors",
    headers: {
      'Authorization': `Bearer ${ntfyAuthorization}`
    },
    body: JSON.stringify(getPayload(payload)),
  }).then(() => {
    // console.log("Data sent to Google Scripts successfully");
  });
};
