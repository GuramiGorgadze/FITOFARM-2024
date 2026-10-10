import express from "express";
import rateLimit from "express-rate-limit";
import {
  getRatings,
  getRatingSummary,
  getProductSummaries,
  createRating,
  deleteRating,
} from "../controllers/ratings.js";
import { protect } from "../middleware/authMiddleware.js";

const RatingsRouter = express.Router();

// Ratings are public (no accounts), so cap submissions per IP to limit spam.
const createLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  skipFailedRequests: true, // only successful submissions count towards the limit
  standardHeaders: true,
  legacyHeaders: false,
  message: { err: "Too many ratings submitted, please try again later" },
});

// NOTE: static paths must be declared before "/:id"
RatingsRouter.get("/", getRatings);
RatingsRouter.get("/summary", getRatingSummary);
RatingsRouter.get("/summaries", getProductSummaries);
RatingsRouter.post("/", createLimiter, createRating);
RatingsRouter.delete("/:id", protect, deleteRating);

export default RatingsRouter;
