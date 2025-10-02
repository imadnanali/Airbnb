import express from "express"
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressError.js";
import Listing from "../models/listing.schema.js";
import { isLoggedin, isOwner, validationListing } from "../middleware.js";
import { createListing, deleteListing, editListing, index, newListing, searchListing, showListing, updateListing } from "../controllers/listings.controller.js";
import { storage } from "../config/cloudinary.js";
import multer from 'multer';
const upload = multer({ storage })



const router = express.Router();




//Index And Create Route
router
    .route("/")
    .get(wrapAsync(index))
    .post(isLoggedin, upload.single('listing[image]'), validationListing, wrapAsync(createListing));


// New Route
router.get("/new", isLoggedin, newListing);


//Search Route
router.get("/search", wrapAsync(searchListing));


// Show Edit Amd Delete Route
router
    .route("/:id")
    .get(wrapAsync(showListing))
    .put(isLoggedin, upload.single('listing[image]'), validationListing, isOwner, wrapAsync(updateListing))
    .delete(isLoggedin, isOwner, wrapAsync(deleteListing));

// Edit Route
router.get("/:id/edit", isLoggedin, isOwner, wrapAsync(editListing));



export default router;