import express from "express"
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressError.js";
import Listing from "../models/listing.js";
import { isLoggedin, isOwner, validationListing } from "../middleware.js";




const router = express.Router();




//Index Route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));


// New Route
router.get("/new", isLoggedin, (req, res) => {
    res.render("listings/new.ejs");
});

// Create Route
router.post("/", isLoggedin, validationListing, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    console.log(req.user);
    
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
}));

// Show Route
router.get(
    "/:id",
     wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews",
         populate: {path: "author",
         },
        })
        .populate("owner");
    
    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}));

// Edit Route
router.get("/:id/edit", isLoggedin, isOwner,  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}));

//  Update Route
router.put("/:id", isLoggedin, validationListing, isOwner, wrapAsync(async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Send valid data for listing");
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
}));

// Delete Route
router.delete("/:id", isLoggedin, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndDelete(id);
    // console.log(listing);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
}));



export default router;