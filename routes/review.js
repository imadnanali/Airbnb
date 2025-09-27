import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressError.js";
import Listing from "../models/listing.js";
import Review from "../models/review.js";
import { validationReview, isLoggedin } from "../middleware.js"


const router = express.Router({ mergeParams: true });



router.post("/", isLoggedin, validationReview, wrapAsync(async (req, res) => {
    console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);

    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    listing.reviews.auther = new Review(req.body.review);
    newReview.author = req.user._id;
    
    await newReview.save();
    console.log(newReview.author);
    await listing.save();
    // console.log("new review saved");
    req.flash("success", "New Review Created");
    res.redirect(`/listings/${listing._id}`);
}));


//Delete Review Route
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`)
}));

export default router;