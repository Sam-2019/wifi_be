import express from "express";
import {
  httpStatus,
  emptyRequest,
  internalServerError,
} from "../config/constants.js";
import { authMiddleware } from "../config/middleware.js";
import { fetchRequest, registerSale } from "../config/utils.js";
import { findSale, getSales } from "../services/db/repository/sale.js";

const router = express.Router();
router.get("/sales", authMiddleware, async (req, res) => {
  try {
    const sales = await getSales();
    if (!sales || sales.length === 0) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "No sales found", data: [] });
    }

    res.status(httpStatus.OK).json({ message: sales });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(internalServerError);
  }
});

router
  .route("/sale")
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
      const sale = await findSale(clientReference);
      if (!sale) {
        return res
          .status(httpStatus.NOT_FOUND)
          .json({ message: "No sale found", data: null });
      }

      res.status(httpStatus.OK).json({ message: "Sale found", data: sale });
    } catch (error) {
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
      const response = await fetchRequest(results);
      if (!response.ok) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: `Transaction status: ${response.statusText}` });
      }

      const sale = await findSale(results.clientReference);
      if (sale) {
        return res
          .status(httpStatus.OK)
          .json({ message: "Duplicate", data: sale });
      }

      await registerSale({ route: "/sale", payload: results });
      res.status(httpStatus.CREATED).json({ message: "Sale added" });
    } catch (error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(internalServerError);
    }
  });

export { router as saleRouter };
