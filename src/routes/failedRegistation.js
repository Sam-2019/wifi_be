import express from "express";
import {
  addFailedRegistration,
  getFailedRegistration,
  getFailedRegistrations,
} from "../services/db/repository/failed_registration.js";
import { ntfy } from "../services/alerts.js";
import { authMiddleware } from "../config/middleware.js";
import { emptyRequest, internalServerError, httpStatus } from "../config/constants.js";

const router = express.Router();
router.get("/failed-registrations", authMiddleware, async (req, res) => {
  try {
    const failed_registrations = await getFailedRegistrations();
    if (!failed_registrations || failed_registrations.length === 0) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "No failed registrations found", data: [] });
    }
    res.status(httpStatus.OK).json({
      message: "Failed registrations found",
      data: failed_registrations,
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(internalServerError);
  }
});

router
  .route("/failed-registration")
  .get(authMiddleware, async (req, res) => {
    const results = req.query;
    if (
      results === undefined ||
      results === null ||
      results.email === undefined ||
      results.email === null ||
      results.phoneNumber === undefined ||
      results.phoneNumber === null
    ) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: emptyRequest });
    }

    try {
      const failedRegistration = await getFailedRegistration(results);
      if (!failedRegistration) {
        return res
          .status(httpStatus.NOT_FOUND)
          .json({ message: "No failedRegistration found", data: null });
      }
      res.status(httpStatus.OK).json({
        message: "failedRegistration found",
        data: failedRegistration,
      });
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
      await addFailedRegistration(results);
      await ntfy({ route: "/failed-registration", payload: results });
      res.status(httpStatus.CREATED).json({ message: "Failed registration added" });
    } catch (error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(internalServerError);
    }
  });

export { router as failedRegistrationRouter };
