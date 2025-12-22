import { Router } from "express";


import { createReview, deleteReview, getReviews } from "../controllers/reviews.controllers.js";

const router = Router();

router.post("/create_review", createReview);
router.post("/delete_review", deleteReview);
router.post("/get_reviews", getReviews);

export default router;