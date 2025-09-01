import bcrypt from "bcrypt";
import { dbSession } from "../db/index.js";
import loggerFeature from "@adminjs/logger";
import AdminJSExpress from "@adminjs/express";
import AdminJS, { ComponentLoader } from "adminjs";
import { findUser } from "../db/repository/user.js";
import * as AdminJSMongoose from "@adminjs/mongoose";
import { dashboard } from "../../config/filePath.js";
import { cookie, cookiePass } from "../../config/constants.js";
import {
  salt,
  admin,
  companyName,
  adminCredentials,
} from "../../config/constants.js";

import Sms from "../db/modelsXschema/sms.js";
import Sale from "../db/modelsXschema/sale.js";
import User from "../db/modelsXschema/user.js";
import Logger from "../db/modelsXschema/log.js";
import Topup from "../db/modelsXschema/topup.js";
import Router from "../db/modelsXschema/router.js";
import Customer from "../db/modelsXschema/customer.js";
import Feedback from "../db/modelsXschema/feedback.js";
import Registration from "../db/modelsXschema/registration.js";
import FailedRegistration from "../db/modelsXschema/failed_registration.js";
import PendingRegistration from "../db/modelsXschema/pending_registration.js";

const defaultProperties = [
  "fullName",
  "phoneNumber",
  "subscriptionPlan",
  "blockCourt",
  "clientReference",
  "registrationType",
];

const feedbackProperties = ["fullName", "phoneNumber", "category", "comment"];

const saleProperties = [
  "fullName",
  "phoneNumber",
  "subscriptionPlan",
  "clientReference",
  "registrationType",
  "transactionId",
  "externalTransactionId",
];

const topupProperties = [
  "fullName",
  "phoneNumber",
  "subscriptionPlan",
  "clientReference",
  "transactionId",
  "externalTransactionId",
];

const customerProperties = [
  "regID",
  "fullName",
  "phoneNumber",
  "email",
  "blockCourt",
  "roomType",
  "roomNumber",
  "isCustodian",
  "cardPrinted",
  "profileCreated",
];

const registrationProperties = [
  "fullName",
  "phoneNumber",
  "subscriptionPlan",
  "blockCourt",
  "clientReference",
  "registrationType",
  "isCustodian",
];

const routerProperties = [
  "serialNo",
  // "isConfigured",
  // "isAllocated",
  // "station",
  // "customerId",
];

const smsProperties = ["mobileNumber", "message", "provider", "payload"];
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
  Dashboard: componentLoader.add("Dashboard", dashboard),
};

const logger = loggerFeature({
  componentLoader,
  propertiesMapping: {
    user: "userId",
  },
  userIdAttribute: "_id",
});

const RegistrationResource = {
  resource: Registration,
  features: [logger],
  options: {
    id: "registrations",
    listProperties: registrationProperties,
    filterProperties: registrationProperties,
    editProperties: registrationProperties,
    showProperties: registrationProperties,
    sort: {
      sortBy: "updatedAt",
      direction: "desc",
    },
    actions: {
      new: {
        isAccessible: ({ currentAdmin }) => isAdminRole({ currentAdmin }),
      },
      edit: {
        isAccessible: false,
        isVisible: true,
      },
      delete: {
        isAccessible: ({ currentAdmin }) => isAdminRole({ currentAdmin }),
      },
      bulkDelete: {
        isAccessible: ({ currentAdmin }) => isAdminRole({ currentAdmin }),
      },
    },
  },
};

const PendingRegistrationResource = {
  resource: PendingRegistration,
  features: [logger],
  options: {
    id: "pending_registrations",
    listProperties: defaultProperties,
    filterProperties: defaultProperties,
    editProperties: defaultProperties,
    showProperties: defaultProperties,
    sort: {
      sortBy: "updatedAt",
      direction: "desc",
    },
    actions: {
      new: {
        isAccessible: ({ currentAdmin }) => isAdminRole({ currentAdmin }),
      },
      edit: {
        isAccessible: false,
        isVisible: true,
      },
      delete: {
        isAccessible: ({ currentAdmin }) => isAdminRole({ currentAdmin }),
      },
      bulkDelete: {
        isAccessible: ({ currentAdmin }) => isAdminRole({ currentAdmin }),
      },
    },
  },
};

const SaleResource = {
  resource: Sale,
  features: [logger],
  options: {
    id: "sales",
    listProperties: saleProperties,
    filterProperties: saleProperties,
    editProperties: saleProperties,
    showProperties: saleProperties,
    sort: {
      sortBy: "updatedAt",
      direction: "desc",
    },
    actions: {
      new: {
        isAccessible: ({ currentAdmin }) => isAdminRole({ currentAdmin }),
      },
      edit: {
        isAccessible: false,
        isVisible: true,
      },
      delete: {
        isAccessible: ({ currentAdmin }) => isAdminRole({ currentAdmin }),
      },
      bulkDelete: {
        isAccessible: ({ currentAdmin }) => isAdminRole({ currentAdmin }),
      },
    },
  },
};

const TopupResource = {
  resource: Topup,
  features: [logger],
  options: {
    id: "topups",
    listProperties: topupProperties,
    filterProperties: topupProperties,
    editProperties: topupProperties,
    showProperties: topupProperties,
    sort: {
      sortBy: "updatedAt",
      direction: "desc",
    },
    actions: {
      new: {
        isAccessible: ({ currentAdmin }) => isAdminRole({ currentAdmin }),
      },
      edit: {
        isAccessible: false,
        isVisible: true,
      },
      delete: {
        isAccessible: ({ currentAdmin }) => isAdminRole({ currentAdmin }),
      },
      bulkDelete: {
        isAccessible: ({ currentAdmin }) => isAdminRole({ currentAdmin }),
      },
    },
  },
};

const FailedRegistrationResource = {
  resource: FailedRegistration,
  features: [logger],
  options: {
    id: "failed_registrations",
    listProperties: defaultProperties,
    filterProperties: defaultProperties,
    editProperties: defaultProperties,
    showProperties: defaultProperties,
    sort: {
      sortBy: "createdAt",
      direction: "desc",
    },
    actions: {
      new: {
        isAccessible: ({ currentAdmin }) => isAdminRole({ currentAdmin }),
      },
      edit: {
        isAccessible: false,
        isVisible: true,
      },
      delete: {
        isAccessible: ({ currentAdmin }) => isAdminRole({ currentAdmin }),
      },
      bulkDelete: {
        isAccessible: ({ currentAdmin }) => isAdminRole({ currentAdmin }),
      },
    },
  },
};

const SmsResource = {
  resource: Sms,
  features: [logger],
  options: {
    id: "sms_receipts",
    listProperties: smsProperties,
    filterProperties: smsProperties,
    editProperties: smsProperties,
    showProperties: smsProperties,
    sort: {
      sortBy: "updatedAt",
      direction: "desc",
    },
    actions: {
      new: {
        isAccessible: false,
      },
      show: {
        isAccessible: true,
      },
      edit: {
        isAccessible: false,
      },
      delete: {
        isAccessible: false,
      },
      bulkDelete: {
        isAccessible: false,
      },
    },
  },
};

const UserResource = {
  resource: User,
  features: [logger],
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
        isAccessible: ({ currentAdmin }) => isAdminRole({ currentAdmin }),
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
        isAccessible: ({ currentAdmin }) => isAdminRole({ currentAdmin }),
        after: async (response) => {
          response.record.params.password = "";
          return response;
        },
      },
      edit: {
        isAccessible: ({ currentAdmin }) => isAdminRole({ currentAdmin }),
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
        isAccessible: ({ currentAdmin }) => isAdminRole({ currentAdmin }),
      },
      bulkDelete: {
        isAccessible: ({ currentAdmin }) => isAdminRole({ currentAdmin }),
      },
    },
  },
};

const CustomerResource = {
  resource: Customer,
  features: [logger],
  options: {
    id: "customers",
    listProperties: customerProperties,
    filterProperties: customerProperties,
    editProperties: customerProperties,
    showProperties: customerProperties,
    sort: {
      sortBy: "createdAt",
      direction: "desc",
    },
    actions: {
      new: {
        isAccessible: false,
      },
      show: {
        isAccessible: true,
      },
      edit: {
        isAccessible: true,
      },
      delete: {
        isAccessible: false,
      },
      bulkDelete: {
        isAccessible: false,
      },
    },
  },
};

const FeedbackResource = {
  resource: Feedback,
  features: [logger],
  options: {
    id: "feedback",
    listProperties: feedbackProperties,
    filterProperties: feedbackProperties,
    editProperties: feedbackProperties,
    showProperties: feedbackProperties,
    sort: {
      sortBy: "updatedAt",
      direction: "desc",
    },
    actions: {
      new: {
        isAccessible: ({ currentAdmin }) => isAdminRole({ currentAdmin }),
      },
      edit: {
        isAccessible: false,
        isVisible: true,
      },
      delete: {
        isAccessible: ({ currentAdmin }) => isAdminRole({ currentAdmin }),
      },
      bulkDelete: {
        isAccessible: ({ currentAdmin }) => isAdminRole({ currentAdmin }),
      },
    },
  },
};

const RouterResource = {
  resource: Router,
  features: [logger],
  options: {
    id: "routers",
    listProperties: routerProperties,
    filterProperties: routerProperties,
    editProperties: routerProperties,
    showProperties: routerProperties,
    sort: {
      sortBy: "updatedAt",
      direction: "desc",
    },
    actions: {
      new: {
        isAccessible: false,
      },
      show: {
        isAccessible: false,
      },
      edit: {
        isAccessible: false,
      },
      list: {
        isAccessible: false,
      },
      delete: {
        isAccessible: false,
      },
      bulkDelete: {
        isAccessible: false,
      },
    },
  },
};

const LogResource = {
  resource: Logger,
  featureOptions: {
    propertiesMapping: {
      recordTitle: "title",
      userIdAttribute: "_id",
    },
  },
  options: {
    actions: {
      new: {
        isAccessible: false,
      },
      show: {
        isAccessible: ({ currentAdmin }) => isAdminRole({ currentAdmin }),
      },
      edit: {
        isAccessible: false,
      },
      list: {
        isAccessible: ({ currentAdmin }) => isAdminRole({ currentAdmin }),
      },
      delete: {
        isAccessible: false,
      },
      bulkDelete: {
        isAccessible: false,
      },
    },
  },
};

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
    TopupResource,
    CustomerResource,
    FeedbackResource,
    RegistrationResource,
    FailedRegistrationResource,
  ],
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
