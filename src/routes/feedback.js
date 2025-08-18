import "dotenv/config";
import express from "express";
import { authMiddleware } from "../config/middleware.js";
import { internalServerError, emptyRequest } from "../config/constants.js";
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
        return res.status(404).json({ message: "No feedback found", data: [] });
      }
      res.status(200).json({ message: feedback });
    } catch (error) {
      res.status(500).send(internalServerError);
    }
  })
  .post(authMiddleware, async (req, res) => {
    const results = req.body;
    const { name, phoneNumber, category, comment } = results;
    const param = [name, phoneNumber, category, comment];

    if (param.includes(undefined) || param.includes(null)) {
      return res.status(400).json({ message: emptyRequest });
    }

    try {
      await addFeedback(results);
      res.status(200).json({ message: "Feedback added" });
    } catch (error) {
      res.status(500).send(internalServerError);
    }
  });

export { router as feedbackRouter };
