import "dotenv/config";
import express from "express";
import {
  addPendingRegistration,
  getPendingRegistration,
  getPendingRegistrations,
} from "../services/db/repository/pending_registration.js";
import { ntfy } from "../services/alerts.js";
import { authMiddleware } from "../config/middleware.js";
import { emptyRequest, internalServerError, httpStatus } from "../config/constants.js";

const router = express.Router();
router.get("/pending-registrations", authMiddleware, async (req, res) => {
  try {
    const pendingRegistrations = await getPendingRegistrations();
    if (!pendingRegistrations || pendingRegistrations.length === 0) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "No pending registrations found", data: [] });
    }
    res.status(httpStatus.OK).json({
      message: "Pending registrations found",
      data: pendingRegistrations,
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(internalServerError);
  }
});

router
  .route("/pending-registration")
  .get(authMiddleware, async (req, res) => {
    const results = req.query;
    if (
      results === undefined ||
      results === null ||
      results.clientReference === undefined ||
      results.clientReference === null
    ) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: emptyRequest });
    }
    const clientReference = results.clientReference;
    try {
      const pendingRegistration = await getPendingRegistration(clientReference);
      if (!pendingRegistration) {
        return res
          .status(httpStatus.NOT_FOUND)
          .json({ message: "No pending registrations found", data: null });
      }
      res.status(httpStatus.OK).json({
        message: "Pending registration found",
        data: pendingRegistration,
      });
    } catch (error) {
      console.error(error);
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
      await addPendingRegistration(results);
      await ntfy({ route: "/pending-registration", payload: results });
      res.status(httpStatus.CREATED).json({ message: "Pending Registration added" });
    } catch (error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(internalServerError);
    }
  });

export { router as pendingRegistrationRouter };
