import bcrypt from "bcrypt";
import { dashboard } from "./filePath.js";
import AdminJS, { ComponentLoader } from "adminjs";
import * as AdminJSMongoose from "@adminjs/mongoose";

import Sms from "../db/modelsXschema/sms.js";
import User from "../db/modelsXschema/user.js";
import Sale from "../db/modelsXschema/sale.js";
import { findUser } from "../db/repository/user.js";
import Registration from "../db/modelsXschema/registration.js";
import FailedRegistration from "../db/modelsXschema/failed_registration.js";
import PendingRegistration from "../db/modelsXschema/pending_registration.js";

AdminJS.registerAdapter({
  Resource: AdminJSMongoose.Resource,
  Database: AdminJSMongoose.Database,
});

const componentLoader = new ComponentLoader();

const Components = {
  Dashboard: componentLoader.add("Dashboard", dashboard),
};

const isAdminRole = ({ currentAdmin }) => {
  return currentAdmin && currentAdmin.role === "Admin";
};

const authenticate = async (email, password) => {
  const user = await findUser(email);
  if (user) {
    const matched = await bcrypt.compare(password, user.encryptedPassword);
    if (matched) {
      return user;
    }
  }
  return false;
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

const UserResource = {
  resource: User,
  options: {
    id: "users",
    properties: {
      encryptedPassword: {
        isVisible: false,
      },
      password: {
        type: "string",
        isVisible: {
          list: false,
          edit: true,
          filter: false,
          show: false,
        },
      },
    },
    actions: {
      new: {
        // Hash the password.
        before: async (request) => {
          if (request?.payload?.password) {
            request.payload = {
              ...request.payload,
              encryptedPassword: await bcrypt.hash(
                request.payload.password,
                10
              ),
              password: undefined,
            };
          }
          return request;
        },
      },
    },
  },
};

const adminOptions = {
  branding: {
    softwareBrothers: false,
    companyName: "PenatgonWifi",
  },
  dashboard: {
    component: Components.Dashboard,
  },
  componentLoader,
  resources: [
    SmsResource,
    UserResource,
    SaleResource,
    RegistrationResource,
    FailedRegistrationResource,
    PendingRegistrationResource,
  ],
  locale: {
    language: "en",
    translations: {
      labels: {
        User: "Users",
        Sale: "Revenue",
        Sms: "Sms Receipts",
        Registration: "Registration",
        PendingRegistration: "Pending Revenue",
        FailedRegistration: "Failed Registration",
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
        User: {
          messages: {
            noRecordsInResource: "There are no users to display",
          },
        },
      },
    },
  },
};

const admin = new AdminJS(adminOptions);
admin.watch();

export { admin, authenticate };
