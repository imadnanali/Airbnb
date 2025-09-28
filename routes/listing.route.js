import express from "express"
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressError.js";
import Listing from "../models/listing.schema.js";
import { isLoggedin, isOwner, validationListing } from "../middleware.js";
import { createListing, deleteListing, editListing, index, newListing, showListing, updateListing } from "../controllers/listings.controller.js";




const router = express.Router();




//Index Route
router.get("/", wrapAsync(index));


// New Route
router.get("/new", isLoggedin, newListing);

// Create Route
router.post("/", isLoggedin, validationListing, wrapAsync(createListing));

// Show Route
router.get(
    "/:id",
     wrapAsync(showListing));

// Edit Route
router.get("/:id/edit", isLoggedin, isOwner,  wrapAsync(editListing));

//  Update Route
router.put("/:id", isLoggedin, validationListing, isOwner, wrapAsync(updateListing));

// Delete Route
router.delete("/:id", isLoggedin, isOwner, wrapAsync(deleteListing));



export default router;