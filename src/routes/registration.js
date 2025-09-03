import "dotenv/config";
import express from "express";
import {
  addRegistration,
  getRegistration,
  getRegistrations,
} from "../services/db/repository/registration.js";
import { ntfy } from "../services/alerts.js";
import { authMiddleware } from "../config/middleware.js";
import { emptyRequest, internalServerError, httpStatus } from "../config/constants.js";

const router = express.Router();
router.get("/registrations", authMiddleware, async (req, res) => {
  try {
    const registrations = await getRegistrations();
    if (!registrations || registrations.length === 0) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "No registrations found", data: [] });
    }
    res
      .status(httpStatus.OK)
      .json({ message: "Registrations found", data: registrations });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(internalServerError);
  }
});

router
  .route("/registration")
  .get(authMiddleware, async (req, res) => {
    const results = req.query;
    if (
      results === undefined ||
      results === null ||
      results.email === undefined ||
      results.email === null ||
      results.userName === undefined ||
      results.userName === null ||
      results.phoneNumber === undefined ||
      results.phoneNumber === null
    ) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: emptyRequest });
    }

    try {
      const registration = await getRegistration(results);
      if (!registration) {
        return res
          .status(httpStatus.NOT_FOUND)
          .json({ message: "No registration found", data: null });
      }
      res
        .status(httpStatus.OK)
        .json({ message: "registration found", data: registration });
    } catch (error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(internalServerError);
    }
  })
  .post(authMiddleware, async (req, res) => {
    const results = req.body;
    if (
      results === undefined ||
      results === null ||
      results.clientReference === undefined ||
      results.clientReference === null
    ) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: emptyRequest });
    }

    try {
      await addRegistration(results);
      await ntfy({ route: "/registration", payload: results });
      res.status(httpStatus.CREATED).json({ message: "Registration added" });
    } catch (error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(internalServerError);
    }
  });

export { router as registrationRouter };
