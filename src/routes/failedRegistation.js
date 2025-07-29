import express from "express";
import {
  addFailedRegistration,
  getFailedRegistration,
  getFailedRegistrations,
} from "../services/db/repository/failed_registration.js";
import { ntfy } from "../services/alerts.js";
import { handleEmptyRequest } from "../config/utils.js";
import { authMiddleware } from "../config/middleware.js";
import { emptyRequest, internalServerError } from "../config/constants.js";

const router = express.Router();
router.get("/failed-registrations", authMiddleware, async (req, res) => {
  try {
    const failed_registrations = await getFailedRegistrations();
    if (!failed_registrations || failed_registrations.length === 0) {
      return res
        .status(404)
        .json({ message: "No failed registrations found", data: [] });
    }
    res.status(200).json({
      message: "Failed registrations found",
      data: failed_registrations,
    });
  } catch (error) {
    res.status(500).send(internalServerError);
  }
});

router
  .route("/failed-registration")
  .get(authMiddleware, async (req, res) => {
    handleEmptyRequest({ req, res });
    const results = req.query;

    try {
      const failedRegistration = await getFailedRegistration(results);
      if (!failedRegistration) {
        return res
          .status(404)
          .json({ message: "No failedRegistration found", data: null });
      }
      res.status(200).json({
        message: "failedRegistration found",
        data: failedRegistration,
      });
    } catch (error) {
      res.status(500).send(internalServerError);
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
   return res.status(400).json({ message: emptyRequest });
    }

    try {
      await addFailedRegistration(results);
      await ntfy({ route: "/failed-registration", payload: results });
      res.status(200).json({ message: "Failed registration added" });
    } catch (error) {
      res.status(500).send(internalServerError);
    }
  });

export { router as failedRegistrationRouter };
