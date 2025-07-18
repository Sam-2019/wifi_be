import "dotenv/config";
import express from "express";
import {
	userExists,
	emailExists,
	internalServerError,
} from "../config/constants.js";
import {
	addCustomer,
	getCustomer,
	getCustomers,
	checkUsernameAvailability,
} from "../services/db/repository/customer.js";
import { ntfy } from "../services/alerts.js";
import { authMiddleware } from "../config/middleware.js";

const router = express.Router();
router.get("/customers", authMiddleware, async (req, res) => {
	try {
		const customers = await getCustomers();
		if (!customers || customers.length === 0) {
			return res.status(404).json({ message: "No customers found", data: [] });
		}
		res.status(200).json({ message: customers });
	} catch (error) {
		console.error("Error in /customers:", error);
		res.status(500).send(internalServerError);
	}
});

router
	.route("/customer")
	.get(authMiddleware, async (req, res) => {
		const results = req.query;

		if (
			results === undefined ||
			results === null ||
			results.phoneNumber === undefined ||
			results.phoneNumber === null ||
			results.email === undefined ||
			results.email === null ||
			results.userName === undefined ||
			results.userName === null
		) {
			console.error("Received with no data");
			return res.status(400).send("Received with no data");
		}

		try {
			const customer = await getCustomer(results);
			if (!customer || customer.length === 0) {
				return res
					.status(404)
					.json({ message: "No customer found", data: null });
			}
			res.status(200).json({ message: "Customer found", data: customer });
		} catch (error) {
			console.error("Error in /customer:", error);
			res.status(500).send(internalServerError);
		}
	})
	.post(authMiddleware, async (req, res) => {
		const results = req.body;

		if (results === undefined || results === null) {
			console.error("Received with no data");
			return res.status(400).send("Received with no data");
		}

		try {
			await addCustomer(results);
			await ntfy({ route: "/customer", payload: results });
			res.status(200).json({ message: "Customer added" });
		} catch (error) {
			console.error("Error in /customer:", error.message);
			if (error.code === 11000) {
				const emailMessage = error?.errmsg?.includes("email")
					? emailExists
					: null;
				const userNameMessage = error?.errmsg?.includes("credentials.userName")
					? userExists
					: null;

				const message = {
					email: emailMessage,
					userName: userNameMessage,
				};

				res.status(422).json({ message: "Duplicate error", data: message });
			} else {
				console.error("Error in /customer:", error);
				res.status(500).send(internalServerError);
			}
		}
	});

router.get("/customer/availabilty", authMiddleware, async (req, res) => {
	const results = req.query;
	if (
		results === undefined ||
		results === null ||
		results.userName === undefined ||
		results.userName === null
	) {
		console.error("Received with no data");
		return res.status(400).send("Received with no data");
	}

	try {
		const customer = await checkUsernameAvailability(results);
		if (!customer || customer.length === 0) {
			return res.status(200).json({ message: "", data: null });
		}
		res.status(200).json({ message: "Duplicate error", data: userExists });
	} catch (error) {
		console.error("Error in /customer:", error);
		res.status(500).send(internalServerError);
	}
});

export { router as customerRouter };
