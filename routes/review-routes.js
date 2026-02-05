import express from "express";
import { authenticateUser } from "../middlewares/auth-middleware.js";
import { getProductReviews,postReview } from "../controllers/review-controller.js";
const router =express.Router();

router.get("/:productId",getProductReviews);

router.post("/",authenticateUser,postReview);

export default router;