import "dotenv/config";
import express from "express";
import {
  addRegistration,
  getRegistration,
  getRegistrations,
} from "../services/db/repository/registration.js";
import { ntfy } from "../services/alerts.js";
import { handleEmptyRequest } from "../config/utils.js";
import { authMiddleware } from "../config/middleware.js";
import { internalServerError } from "../config/constants.js";

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
      if (!registration || registration.length === 0) {
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
    const results = req.body;

    if (
      results === undefined ||
      results === null ||
      results.clientReference === undefined ||
      results.clientReference === null
    ) {
      return res.status(400).send("Registration received with no data");
    }

    try {
      await addRegistration(results);
      await ntfy({ route: "/registration", payload: results });
      res.status(200).json({ message: "Registration added" });
    } catch (error) {
      res.status(500).send(internalServerError);
    }
  });

export { router as registrationRouter };
