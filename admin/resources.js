import bcrypt from "bcrypt";
import Sms from "../db/modelsXschema/sms.js";
import Sale from "../db/modelsXschema/sale.js";
import User from "../db/modelsXschema/user.js";
import { salt, admin } from "../config/constants.js";
import Registration from "../db/modelsXschema/registration.js";
import FailedRegistration from "../db/modelsXschema/failed_registration.js";
import PendingRegistration from "../db/modelsXschema/pending_registration.js";

export const RegistrationResource = {
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

export const PendingRegistrationResource = {
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

export const SaleResource = {
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

export const FailedRegistrationResource = {
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

export const SmsResource = {
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

export const UserResource = {
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
        isAccessible: ({ currentAdmin }) => currentAdmin.role === admin,
        before: async (request) => {
          if (request.payload?.password) {
            request.payload = {
              ...request.payload,
              encryptedPassword: await bcrypt.hash(
                request.payload.password,
                salt,
              ),
              password: undefined,
            };
          }
          return request;
        },
      },
      show: {
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
                  salt,
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
    },
  },
};
