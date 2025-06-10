import AdminJS from "adminjs";
import Sms from "../db/modelsXschema/sms.js";
import Sale from "../db/modelsXschema/sale.js";
import * as AdminJSMongoose from "@adminjs/mongoose";
import PendingRegistration from "../db/modelsXschema/pending_registration.js";

AdminJS.registerAdapter({
  Resource: AdminJSMongoose.Resource,
  Database: AdminJSMongoose.Database,
});

const onlyForAdmin = ({ currentAdmin }) => currentAdmin.role === "Admin";

const DEFAULT_ADMIN = {
  email: process.env.USER_EMAIL,
  password: process.env.USER_PASSWORD,
};

const authenticate = async (email, password) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN);
  }
  return null;
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
  resources: [PendingRegistration, Sale, Sms],
  locale: {
    language: "en",
    translations: {
      labels: {
        PendingRegistration: "Pending Revenue",
        Sale: "Revenue",
        Sms: "Sms Receipts",
      },
      resources: {
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

const COOKIE = process.env.COOKIE_NAME;
const COOKIE_PASS = process.env.COOKIE_PASSWORD;

export { admin, authenticate, COOKIE, COOKIE_PASS };
