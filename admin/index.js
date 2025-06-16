import bcrypt from "bcrypt";
import {
  SmsResource,
  UserResource,
  SaleResource,
  RegistrationResource,
  PendingRegistrationResource,
  FailedRegistrationResource,
} from "../admin/resources.js";
import { dashboard } from "../config/filePath.js";
import AdminJS, { ComponentLoader } from "adminjs";
import { findUser } from "../db/repository/user.js";
import * as AdminJSMongoose from "@adminjs/mongoose";

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
