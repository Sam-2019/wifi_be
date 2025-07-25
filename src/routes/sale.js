import "dotenv/config";
import express from "express";
import { ntfy } from "../services/alerts.js";
import { writeToSheet } from "../services/gSheet.js";
import { authMiddleware } from "../config/middleware.js";
import { addTopup } from "../services/db/repository/topup.js";
import { internalServerError, registration } from "../config/constants.js";
import { addSale, findSale, getSales } from "../services/db/repository/sale.js";

const router = express.Router();
router.get("/sales", authMiddleware, async (req, res) => {
  try {
    const sales = await getSales();
    if (!sales || sales.length === 0) {
      return res.status(404).json({ message: "No sales found", data: [] });
    }
    res.status(200).json({ message: sales });
  } catch (error) {
    console.error("Error in /sales:", error);
    res.status(500).send(internalServerError);
  }
});

router
  .route("/sale")
  .get(authMiddleware, async (req, res) => {
    const results = req.query;

    if (results === undefined || results === null) {
      console.error("Received with no data");
      return res.status(400).send("Received with no data");
    }

    const clientReference = results.clientReference;

    try {
      const sale = await findSale(clientReference);
      if (!sale || sale.length === 0) {
        return res.status(404).json({ message: "No sale found", data: null });
      }
      res.status(200).json({ message: "Sale found", data: sale });
    } catch (error) {
      console.error("Error in /Sale:", error);
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
      const sale = findSale(results.clientReference);
      if (sale) { return res.status(200).json({ message: "Duplicate", data: sale }) }

      await addSale(results);
      if (results.registrationType === registration) { addCustomer(results) }
      else { await addTopup(results) }
      await writeToSheet(results, "Sales");
      await ntfy({ route: "/sale", payload: results });
      res.status(200).json({ message: "Sale added" });
    } catch (error) {
      console.error("Error in /sale:", error);
      res.status(500).send(internalServerError);
    }
  });

export { router as saleRouter };
