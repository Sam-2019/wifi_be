import "dotenv/config";
import express from "express";
import {
    addPendingRegistration,
	getPendingRegistration,
	getPendingRegistrations,
} from "../services/db/repository/pending_registration.js";
import { ntfy } from "../services/alerts.js";
import { authMiddleware } from "../config/middleware.js";
import { internalServerError } from "../config/constants.js";

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
		console.error("Error in /pending-registrations", error);
		res.status(500).send(internalServerError);
	}
});

router
	.route("/pending-registration")
	.get(authMiddleware, async (req, res) => {
		const results = req.query;

		if (results === undefined || results === null) {
			console.error("Received with no data");
			return res.status(400).send("Received with no data");
		}
		try {
			const pending_registration = await getPendingRegistration(results);
			if (!pending_registration || pending_registration.length === 0) {
				return res
					.status(404)
					.json({ message: "No pending registrations found", data: null });
			}
			res.status(200).json({
				message: "Pending registration found",
				data: pending_registration,
			});
		} catch (error) {
			console.error("Error in /pending-registration", error);
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
			console.error("Registration received with no data");
			return res.status(400).send("Registration received with no data");
		}

		try {
			await addPendingRegistration(results);
			await ntfy({ route: "/pending-registration", payload: results });
			res.status(200).json({ message: "Pending Registration added" });
		} catch (error) {
			console.error("Error in /pending-registration:", error);
			res.status(500).send(internalServerError);
		}
	});

export { router as pendingRegistrationRouter };
