import { forbidden, unauthorized, authorization } from "./constants.js";

export const authMiddleware = (req, res, next) => {
  const authorization = req.headers[authorization];
  const AUTH_KEY = process.env.AUTH_KEY || "default_auth_key";

  if (
    !req.headers ||
    !authorization ||
    authorization.length === 0 ||
    authorization === "null" ||
    authorization === "undefined"
  ) {
    return res.status(401).json({ message: unauthorized });
  }

  if (authorization !== AUTH_KEY) {
    return res.status(403).json({ message: forbidden });
  }

  next();
};
