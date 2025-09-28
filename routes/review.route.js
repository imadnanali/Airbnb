import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressError.js";
import Listing from "../models/listing.schema.js";
import Review from "../models/review.schema.js";
import { validationReview, isLoggedin } from "../middleware.js"
import { addReview, deleteReview } from "../controllers/review.controller.js";


const router = express.Router({ mergeParams: true });


//Create review
router.post("/", isLoggedin, validationReview, wrapAsync(addReview));


//Delete Review Route
router.delete("/:reviewId", wrapAsync(deleteReview));

export default router;