import "dotenv/config";
import express from "express";
import { authMiddleware } from "../config/middleware.js";
import { internalServerError } from "../config/constants.js";
import { handleEmptyRequest, registerSale } from "../config/utils.js";
import { findSale, getSales } from "../services/db/repository/sale.js";

const router = express.Router();
router.get("/sales", authMiddleware, async (req, res) => {
  try {
    const sales = await getSales();
    if (!sales || sales.length === 0) {
      return res.status(404).json({ message: "No sales found", data: [] });
    }
    res.status(200).json({ message: sales });
  } catch (error) {
    res.status(500).send(internalServerError);
  }
});

router
  .route("/sale")
  .get(authMiddleware, async (req, res) => {
    handleEmptyRequest({ req, res });
    const results = req.query;

    const clientReference = results.clientReference;

    try {
      const sale = await findSale(clientReference);
      if (!sale || sale.length === 0) {
        return res.status(404).json({ message: "No sale found", data: null });
      }
      res.status(200).json({ message: "Sale found", data: sale });
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
      const sale = findSale(results.clientReference);
      if (sale) { return res.status(200).json({ message: "Duplicate", data: sale }) }

      await registerSale({ route: "/sale", payload: results });
      res.status(200).json({ message: "Sale added" });
    } catch (error) {
      res.status(500).send(internalServerError);
    }
  });

export { router as saleRouter };
