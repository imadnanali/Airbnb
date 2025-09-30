import express from "express"
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressError.js";
import Listing from "../models/listing.schema.js";
import { isLoggedin, isOwner, validationListing } from "../middleware.js";
import { createListing, deleteListing, editListing, index, newListing, showListing, updateListing } from "../controllers/listings.controller.js";
import { storage } from "../config/cloudinary.js";
import multer from 'multer';    
const upload = multer({ storage })



const router = express.Router();




//Index Route
router.get("/", wrapAsync(index))


// New Route
router.get("/new", isLoggedin, newListing);

// Create Route
router.post("/", isLoggedin, upload.single('listing[image]'), validationListing, wrapAsync(createListing));

// Show Route
router.get(
    "/:id",
     wrapAsync(showListing));

// Edit Route
router.get("/:id/edit", isLoggedin, isOwner,  wrapAsync(editListing));

//  Update Route
router.put("/:id", isLoggedin,  upload.single('listing[image]'), validationListing, isOwner, wrapAsync(updateListing));

// Delete Route
router.delete("/:id", isLoggedin, isOwner, wrapAsync(deleteListing));



export default router;