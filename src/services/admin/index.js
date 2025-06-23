import bcrypt from "bcrypt";
import { dbSession } from "../db/index.js";
import loggerFeature from '@adminjs/logger';
import AdminJSExpress from "@adminjs/express";
import AdminJS, { ComponentLoader } from "adminjs";
import { findUser } from "../db/repository/user.js";
import * as AdminJSMongoose from "@adminjs/mongoose";
import { dashboard } from "../../config/filePath.js";
import { cookie, cookiePass } from "../../config/constants.js";
import { adminCredentials, admin, companyName, salt } from "../../config/constants.js";

import Sms from "../db/modelsXschema/sms.js";
import Sale from "../db/modelsXschema/sale.js";
import User from "../db/modelsXschema/user.js";
import Registration from "../db/modelsXschema/registration.js";
import FailedRegistration from "../db/modelsXschema/failed_registration.js";
import PendingRegistration from "../db/modelsXschema/pending_registration.js";
import Logger from "../db/modelsXschema/log.js";

// const authenticate = async (email, password) => {
//   if (
//     email === adminCredentials.email &&
//     password === adminCredentials.password
//   ) {
//     return Promise.resolve(adminCredentials);
//   }
//   return null;
// };

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

const isAdminRole = ({ currentAdmin }) => {
  return currentAdmin && currentAdmin.role === admin;
};

AdminJS.registerAdapter({
  Resource: AdminJSMongoose.Resource,
  Database: AdminJSMongoose.Database,
});

const componentLoader = new ComponentLoader();
const Components = {
  // Dashboard: componentLoader.add("Dashboard", dashboard),
};

const logger = loggerFeature({
  componentLoader,
  propertiesMapping: {
    user: 'userId',
  },
  userIdAttribute: '_id',
});

const RegistrationResource = {
  resource: Registration,
  features: [
    logger
  ],
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
      delete: {
        isAccessible: ({ currentAdmin }) => currentAdmin.role === admin,
      },
      bulkDelete: {
        isAccessible: ({ currentAdmin }) => currentAdmin.role === admin,
      },
    },
  },
};

const PendingRegistrationResource = {
  resource: PendingRegistration,
  features: [
    logger
  ],
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
      delete: {
        isAccessible: ({ currentAdmin }) => currentAdmin.role === admin,
      },
      bulkDelete: {
        isAccessible: ({ currentAdmin }) => currentAdmin.role === admin,
      },
    },
  },
};

const SaleResource = {
  resource: Sale,
  features: [
    logger
  ],
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
      delete: {
        isAccessible: ({ currentAdmin }) => currentAdmin.role === admin,
      },
      bulkDelete: {
        isAccessible: ({ currentAdmin }) => currentAdmin.role === admin,
      },
    },
  },
};

const FailedRegistrationResource = {
  resource: FailedRegistration,
  features: [
    logger
  ],
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
      delete: {
        isAccessible: ({ currentAdmin }) => currentAdmin.role === admin,
      },
      bulkDelete: {
        isAccessible: ({ currentAdmin }) => currentAdmin.role === admin,
      },
    },
  },
};

const SmsResource = {
  resource: Sms,
  features: [
    logger
  ],
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
      delete: {
        isAccessible: ({ currentAdmin }) => currentAdmin.role === admin,
      },
      bulkDelete: {
        isAccessible: ({ currentAdmin }) => currentAdmin.role === admin,
      },
    },
  },
};

const UserResource = {
  resource: User,
  features: [
    logger
  ],
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
        isAccessible: ({ currentAdmin }) => currentAdmin.role === admin,
        before: async (request) => {
          if (request.payload?.password) {
            request.payload = {
              ...request.payload,
              encryptedPassword: await bcrypt.hash(
                request.payload.password,
                salt
              ),
              password: undefined,
            };
          }
          return request;
        },
      },
      show: {
        isAccessible: ({ currentAdmin }) => currentAdmin.role === admin,
        after: async (response) => {
          response.record.params.password = "";
          return response;
        },
      },
      edit: {
        isAccessible: ({ currentAdmin }) => currentAdmin.role === admin,
        before: async (request) => {
          if (request.method === "post") {
            if (request.payload?.password) {
              request.payload = {
                ...request.payload,
                encryptedPassword: await bcrypt.hash(
                  request.payload.password,
                  salt
                ),
                password: undefined,
              };
            } else {
              // biome-ignore lint/performance/noDelete: <explanation>
              delete request.payload?.password;
            }
          }
          return request;
        },
        after: async (response) => {
          response.record.params.password = "";
          return response;
        },
      },
      list: {
        after: async (response) => {
          for (const record of response.records) {
            record.params.password = "";
          }
          return response;
        },
      },
      delete: {
        isAccessible: ({ currentAdmin }) => currentAdmin.role === admin,
      },
      bulkDelete: {
        isAccessible: ({ currentAdmin }) => isAdminRole({ currentAdmin }),
      },
    },
  },
};

const LogResource = {
  resource: Logger,
  featureOptions: {
    propertiesMapping: {
      recordTitle: 'title',
      userIdAttribute: '_id',
    }
  },
  options: {
    actions: {
      new: {
        isAccessible: ({ currentAdmin }) => currentAdmin.role === admin,
      },
      show: {
        isAccessible: ({ currentAdmin }) => currentAdmin.role === admin,
      },
      edit: {
        isAccessible: ({ currentAdmin }) => currentAdmin.role === admin,
      },
      list: {
        isAccessible: ({ currentAdmin }) => currentAdmin.role === admin,
      },
      delete: {
        isAccessible: ({ currentAdmin }) => currentAdmin.role === admin,
      },
      bulkDelete: {
        isAccessible: ({ currentAdmin }) => currentAdmin.role === admin,
      },
    },
  },

}

const adminOptions = {
  branding: {
    logo: "/assets/logo.png",
    softwareBrothers: false,
    companyName: companyName,
  },
  dashboard: {
    component: Components.Dashboard,
  },
  componentLoader,
  resources: [
    LogResource,
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
        User: {
          messages: {
            noRecordsInResource: "There are no users to display",
          },
        },
        Sms: {
          messages: {
            noRecordsInResource: "There are no sms receipts to display",
          },
        },
        Registration: {
          messages: {
            noRecordsInResource: "There are no registrations to display",
          },
        },
        FailedRegistration: {
          messages: {
            noRecordsInResource: "There are no failed registrations to display",
          },
        },
      },
    },
  },
};

const adminjs = new AdminJS(adminOptions);
adminjs.watch();

const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
  adminjs,
  {
    authenticate,
    cookieName: cookie,
    cookiePassword: cookiePass,
  },
  null,
  dbSession
);

export { adminjs, adminRouter };
