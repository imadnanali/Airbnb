import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressError.js";
import Listing from "../models/listing.js";
import { reviewSchema } from "../schema.js";
import Review from "../models/review.js";


const router = express.Router({mergeParams: true});


const validationReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404, errMsg);
    }
    else {
        next()
    }
}


router.post("/", validationReview, wrapAsync(async (req, res) => {
    console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    console.log("new review saved");
    res.redirect(`/listings/${ listing._id }`);
}));


//Delete Review Route
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    console.log(req.params.id );
    let { id, reviewId } = req.params;
    

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`)
}));

export default router;