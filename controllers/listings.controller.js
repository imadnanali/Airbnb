import Listing from "../models/listing.schema.js";
import ExpressError from "../utils/ExpressError.js";


async function index(req, res) {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

function newListing(req, res) {
    res.render("listings/new.ejs");
}


async function createListing(req, res) {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    // console.log(req.user);
    newListing.image = { url, filename }
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
}

async function showListing(req, res) {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}

async function editListing(req, res) {
    let { id } = req.params;
    let listing = await Listing.findById(id); if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}

async function updateListing(req, res) {
    if (!req.body.listing) {
        throw new ExpressError(400, "Send valid data for listing");
    }
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
}

async function deleteListing(req, res) {
    let { id } = req.params;
    let listing = await Listing.findByIdAndDelete(id);
    // console.log(listing);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
}

export { index, newListing, createListing, showListing, editListing, updateListing, deleteListing };