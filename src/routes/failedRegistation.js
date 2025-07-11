import express from "express";
import {
	addFailedRegistration,
	getFailedRegistration,
	getFailedRegistrations,
} from "../services/db/repository/failed_registration.js";
import { ntfy } from "../services/alerts.js";
import { authMiddleware } from "../config/middleware.js";
import { internalServerError } from "../config/constants.js";

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
		console.error("Error in /failed-registrations:", error);
		res.status(500).send(internalServerError);
	}
});

router
	.route("/failed-registration")
	.get(authMiddleware, async (req, res) => {
		const results = req.query;

		if (results === undefined || results === null) {
			console.error("Received with no data");
			return res.status(400).send("Received with no data");
		}

		try {
			const failedRegistration = await getFailedRegistration(results);
			if (!failedRegistration || failedRegistration.length === 0) {
				return res
					.status(404)
					.json({ message: "No failedRegistration found", data: null });
			}
			res.status(200).json({
				message: "failedRegistration found",
				data: failedRegistration,
			});
		} catch (error) {
			console.error("Error in /failed-registration:", error);
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
			console.error("Received with no data");
			return res.status(400).send("Received with no data");
		}

		try {
			await addFailedRegistration(results);
			await ntfy({ route: "/failed-registration", payload: results });
			res.status(200).json({ message: "Failed registration added" });
		} catch (error) {
			console.error("Error in /failed-registration:", error);
			res.status(500).send(internalServerError);
		}
	});

export { router as failedRegistrationRouter };
