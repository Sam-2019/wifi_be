import { dashboard } from "./filePath.js";
import { adminCredentials } from "./constants.js";
import AdminJS, { ComponentLoader } from "adminjs";
import * as AdminJSMongoose from "@adminjs/mongoose";

import Sms from "../db/modelsXschema/sms.js";
import Sale from "../db/modelsXschema/sale.js";
import Registration from "../db/modelsXschema/registration.js";
import PendingRegistration from "../db/modelsXschema/pending_registration.js";
import FailedRegistration from "../db/modelsXschema/failed_registration.js";

AdminJS.registerAdapter({
  Resource: AdminJSMongoose.Resource,
  Database: AdminJSMongoose.Database,
});

const componentLoader = new ComponentLoader();

const Components = {
  Dashboard: componentLoader.add("Dashboard", dashboard),
};

const onlyForAdmin = ({ currentAdmin }) => currentAdmin.role === "Admin";

const authenticate = async (email, password) => {
  if (
    email === adminCredentials.email &&
    password === adminCredentials.password
  ) {
    return Promise.resolve(adminCredentials);
  }
  return null;
};

const RegistrationResource = {
  resource: Registration,
  options: {
    id: "registrations",
    listProperties: ["regID", "fullName", "dateTime"],
    filterProperties: ["regID", "fullName", "dateTime"],
    editProperties: ["regID", "fullName", "dateTime"],
    showProperties: ["regID", "fullName", "dateTime"],
    sort: {
      sortBy: "updatedAt",
      direction: "desc",
    },
    actions: {
      edit: {
        isAccessible: false,
        isVisible: true,
      },
    },
  },
};

const PendingRegistrationResource = {
  resource: PendingRegistration,
  options: {
    id: "pending_registrations",
    listProperties: ["regID", "fullName", "dateTime"],
    filterProperties: ["regID", "fullName", "dateTime"],
    editProperties: ["regID", "fullName", "dateTime"],
    showProperties: ["regID", "fullName", "dateTime"],
    sort: {
      sortBy: "updatedAt",
      direction: "desc",
    },
    actions: {
      edit: {
        isAccessible: false,
        isVisible: true,
      },
    },
  },
};

const SaleResource = {
  resource: Sale,
  options: {
    id: "sales",
    listProperties: ["regID", "fullName", "dateTime"],
    filterProperties: ["regID", "fullName", "dateTime"],
    editProperties: ["regID", "fullName", "dateTime"],
    showProperties: ["regID", "fullName", "dateTime"],
    sort: {
      sortBy: "updatedAt",
      direction: "desc",
    },
    actions: {
      edit: {
        isAccessible: false,
        isVisible: true,
      },
    },
  },
};

const FailedRegistrationResource = {
  resource: FailedRegistration,
  options: {
    id: "failed_registrations",
    listProperties: ["regID", "fullName", "dateTime"],
    filterProperties: ["regID", "fullName", "dateTime"],
    editProperties: ["regID", "fullName", "dateTime"],
    showProperties: ["regID", "fullName", "dateTime"],
    sort: {
      sortBy: "updatedAt",
      direction: "desc",
    },
    actions: {
      edit: {
        isAccessible: false,
        isVisible: true,
      },
    },
  },
};

const SmsResource = {
  resource: Sms,
  options: {
    id: "sms_receipts",
    listProperties: ["mobileNumber", "message", "provider", "payload"],
    filterProperties: ["mobileNumber", "message", "provider", "payload"],
    editProperties: ["mobileNumber", "message", "provider", "payload"],
    showProperties: ["mobileNumber", "message", "provider", "payload"],
    sort: {
      sortBy: "updatedAt",
      direction: "desc",
    },
    actions: {
      edit: {
        isAccessible: false,
        isVisible: true,
      },
    },
  },
};

const adminOptions = {
  branding: {
    companyName: "PenatgonWifi",
    softwareBrothers: false,
  },
  dashboard: {
    component: Components.Dashboard,
  },
  componentLoader,
  resources: [
    RegistrationResource,
    PendingRegistrationResource,
    SaleResource,
    FailedRegistrationResource,
    SmsResource,
  ],
  locale: {
    language: "en",
    translations: {
      labels: {
        Registration: "Registration",
        PendingRegistration: "Pending Revenue",
        Sale: "Revenue",
        FailedRegistration: "Failed Registration",
        Sms: "Sms Receipts",
      },
      resources: {
        Registration: {
          messages: {
            noRecordsInResource: "There are no registrations to display",
          },
        },
        PendingRegistration: {
          messages: {
            noRecordsInResource:
              "There are no pending registrations to display",
          },
        },
        Sale: {
          messages: {
            noRecordsInResource: "There are no sales to display",
          },
        },
        FailedRegistration: {
          messages: {
            noRecordsInResource: "There are no failed registrations to display",
          },
        },
        Sms: {
          messages: {
            noRecordsInResource: "There are no sms receipts to display",
          },
        },
      },
    },
  },
};

const admin = new AdminJS(adminOptions);
admin.watch();

export { admin, authenticate };
