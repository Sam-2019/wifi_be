import "dotenv/config";
import express from "express";
import { writeToSheet } from "../services/gSheet.js";
import { authMiddleware } from "../config/middleware.js";
import { internalServerError, emptyRequest, httpStatus } from "../config/constants.js";
import {
  addFeedback,
  getFeedback,
} from "../services/db/repository/feedback.js";

const router = express.Router();

router
  .route("/feedback")
  .get(authMiddleware, async (req, res) => {
    try {
      const feedback = await getFeedback();
      if (!feedback || feedback.length === 0) {
        return res.status(httpStatus.NOT_FOUND).json({ message: "No feedback found", data: [] });
      }
      res.status(httpStatus.OK).json({ message: feedback });
    } catch (error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(internalServerError);
    }
  })
  .post(authMiddleware, async (req, res) => {
    const results = req.body;
    const { fullName, phoneNumber, category, comment } = results;
    const param = [fullName, phoneNumber, category, comment];

    if (param.includes(undefined) || param.includes(null)) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: emptyRequest });
    }

    try {
      await addFeedback(results);
      await writeToSheet(results);
      res.status(httpStatus.CREATED).json({ message: "Feedback added" });
    } catch (error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(internalServerError);
    }
  });

export { router as feedbackRouter };
