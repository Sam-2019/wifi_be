import { ntfyUri, ntfyTopic, ntfyAuthorization } from "../config/constants.js";

const priority = 4;
const topic = ntfyTopic;
// const tags = ["warning", "cd"];

const setupAlert = (title, message) => {
  return {
    "topic": topic,
    "title": title,
    // "tags": tags,
    "priority": priority,
    "message": JSON.stringify(message),
  };
}

const saleAlert = (payload) => {
  return setupAlert("New Sale", payload);
}

const registrationAlert = (payload) => {
  return setupAlert("Registration", payload);
}

const pendingAlert = (payload) => {
  return setupAlert("Pending Registration", payload);
}

const failedAlert = (payload) => {
  return setupAlert("Failed Registration", payload);
}

const customerAlert = (payload) => {
  return setupAlert("New Customer", payload);
}

const callbackAlert = (payload) => {
  return setupAlert("Payment Callback", payload);
}

const statusCheckAlert = (payload) => {
  return setupAlert("Payment Status Check", payload);
}

const syncAlert = (payload) => {
  return setupAlert("Data Sync", payload);
}

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
    registrationType: payload?.registrationType
  }


  const getPayload = (route) => {
    switch (route) {
      case '/sale':
        return saleAlert(getInfo);
      case '/payment/sync':
        return syncAlert(getInfo);
      case '/failed-registration':
        return failedAlert(getInfo);
      case '/pending-registration':
        return pendingAlert(getInfo);
      case '/customer':
        return customerAlert(getInfo);
      case '/payment/callback':
        return callbackAlert(getInfo);
      case '/payment/status':
        return statusCheckAlert(getInfo);
      case '/registration':
        return registrationAlert(getInfo);
      default:
        console.error("Invalid alert type provided.");
        return null;
    }
  };

  await fetch(ntfyUri, {
    method: "POST",
    headers: {
      'Authorization': `Bearer ${ntfyAuthorization}`
    },
    body: JSON.stringify(getPayload(route)),
  })

};
