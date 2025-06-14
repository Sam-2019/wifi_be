import AdminJS from "adminjs";
import Sms from "../db/modelsXschema/sms.js";
import Sale from "../db/modelsXschema/sale.js";
import * as AdminJSMongoose from "@adminjs/mongoose";
import PendingRegistration from "../db/modelsXschema/pending_registration.js";
import Registration from "../db/modelsXschema/registration.js";
import FailedRegistration from "../db/modelsXschema/failed_registration.js";
import { adminCredentials } from "./constants.js";

AdminJS.registerAdapter({
  Resource: AdminJSMongoose.Resource,
  Database: AdminJSMongoose.Database,
});

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
    id: "pending_registrations",
    listProperties: ["id", "name", "createdAt"],
    filterProperties: ["id", "name", "createdAt"],
    editProperties: ["id", "name", "bio", "createdAt"],
    showProperties: ["id", "name", "bio", "createdAt"],
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
    listProperties: ["id", "name", "createdAt"],
    filterProperties: ["id", "name", "createdAt"],
    editProperties: ["id", "name", "bio", "createdAt"],
    showProperties: ["id", "name", "bio", "createdAt"],
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
    listProperties: ["id", "name", "createdAt"],
    filterProperties: ["id", "name", "createdAt"],
    editProperties: ["id", "name", "bio", "createdAt"],
    showProperties: ["id", "name", "bio", "createdAt"],
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
    id: "pending_registrations",
    listProperties: ["id", "name", "createdAt"],
    filterProperties: ["id", "name", "createdAt"],
    editProperties: ["id", "name", "bio", "createdAt"],
    showProperties: ["id", "name", "bio", "createdAt"],
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
    listProperties: ["id", "name", "createdAt"],
    filterProperties: ["id", "name", "createdAt"],
    editProperties: ["id", "name", "bio", "createdAt"],
    showProperties: ["id", "name", "bio", "createdAt"],
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
  resources: [Registration, PendingRegistration, Sale, FailedRegistration, Sms],
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

export { admin, authenticate };
