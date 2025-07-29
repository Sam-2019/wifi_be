import "dotenv/config";
import express from "express";
import {
  addRegistration,
  getRegistration,
  getRegistrations,
} from "../services/db/repository/registration.js";
import { ntfy } from "../services/alerts.js";
import { authMiddleware } from "../config/middleware.js";
import { emptyRequest, internalServerError } from "../config/constants.js";
import { handleEmptyReferenceRequest, handleEmptyRequest } from "../config/utils.js";

const router = express.Router();
router.get("/registrations", authMiddleware, async (req, res) => {
  try {
    const registrations = await getRegistrations();
    if (!registrations || registrations.length === 0) {
      return res
        .status(404)
        .json({ message: "No registrations found", data: [] });
    }
    res
      .status(200)
      .json({ message: "Registrations found", data: registrations });
  } catch (error) {
    res.status(500).send(internalServerError);
  }
});

router
  .route("/registration")
  .get(authMiddleware, async (req, res) => {
    handleEmptyRequest({ req, res });
    const results = req.query;

    try {
      const registration = await getRegistration(results);
      if (!registration) {
        return res
          .status(404)
          .json({ message: "No registration found", data: null });
      }
      res
        .status(200)
        .json({ message: "registration found", data: registration });
    } catch (error) {
      res.status(500).send(internalServerError);
    }
  })
  .post(authMiddleware, async (req, res) => {
    handleEmptyReferenceRequest({req, res});

    const results = req.body;
    try {
      await addRegistration(results);
      await ntfy({ route: "/registration", payload: results });
      res.status(200).json({ message: "Registration added" });
    } catch (error) {
      res.status(500).send(internalServerError);
    }
  });

export { router as registrationRouter };
