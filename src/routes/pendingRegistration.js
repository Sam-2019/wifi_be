import "dotenv/config";
import express from "express";
import {
  addPendingRegistration,
  getPendingRegistration,
  getPendingRegistrations,
} from "../services/db/repository/pending_registration.js";
import { ntfy } from "../services/alerts.js";
import { authMiddleware } from "../config/middleware.js";
import { emptyRequest, internalServerError } from "../config/constants.js";
import { handleEmptyReferenceRequest, handleEmptyRequest } from "../config/utils.js";

const router = express.Router();
router.get("/pending-registrations", authMiddleware, async (req, res) => {
  try {
    const pending_registrations = await getPendingRegistrations();
    if (!pending_registrations || pending_registrations.length === 0) {
      return res
        .status(404)
        .json({ message: "No pending registrations found", data: [] });
    }
    res.status(200).json({
      message: "Pending registrations found",
      data: pending_registrations,
    });
  } catch (error) {
    res.status(500).send(internalServerError);
  }
});

router
  .route("/pending-registration")
  .get(authMiddleware, async (req, res) => {
    handleEmptyRequest({ req, res });
    const results = req.query;

    try {
      const pendingRegistration = await getPendingRegistration(results);
      if (!pendingRegistration) {
        return res
          .status(404)
          .json({ message: "No pending registrations found", data: null });
      }
      res.status(200).json({
        message: "Pending registration found",
        data: pendingRegistration,
      });
    } catch (error) {
      res.status(500).send(internalServerError);
    }
  })
  .post(authMiddleware, async (req, res) => {
    handleEmptyReferenceRequest({req, res});
    
    const results = req.body;
    try {
      await addPendingRegistration(results);
      await ntfy({ route: "/pending-registration", payload: results });
      res.status(200).json({ message: "Pending Registration added" });
    } catch (error) {
      res.status(500).send(internalServerError);
    }
  });

export { router as pendingRegistrationRouter };
