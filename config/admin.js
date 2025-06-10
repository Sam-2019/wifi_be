import AdminJS from "adminjs";

const DEFAULT_ADMIN = {
  email: process.env.USER_EMAIL,
  password: process.env.USER_PASSWORD
};

const authenticate = async (email, password) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN);
  }
  return null;
};

const admin = new AdminJS({});

const COOKIE = process.env.COOKIE_NAME;
const COOKIE_PASS = process.env.COOKIE_PASSWORD;

export { admin, authenticate, COOKIE, COOKIE_PASS };