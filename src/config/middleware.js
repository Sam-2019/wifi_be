import { forbidden, unauthorized } from "./constants.js";

export const authMiddleware = (req, res, next) => {
  const authorization = req.headers.authorization;
  const AUTHORIZATION = process.env.AUTHORIZATION;

  if (
    !req.headers ||
    !authorization ||
    authorization.length === 0 ||
    authorization === "null" ||
    authorization === "undefined"
  ) {
    return res.status(401).json({ message: unauthorized });
  }

  if (authorization?.startsWith("Bearer ")) {
    const token = authorization.split(" ")[1];
    const decodeToken = Buffer.from(token, "base64");
    const strinfigy = decodeToken.toString();

    if (strinfigy !== AUTHORIZATION) {
      return res.status(403).json({ message: forbidden });
    }
  }

  next();
};
