import Listing from "../models/listing.schema.js";
import ExpressError from "../utils/ExpressError.js";

async function index(req, res) {
    try {
        const listings = await Listing.find({}).populate('reviews');
        
        const listingsWithRatings = listings.map(listing => {
            const listingObj = listing.toObject();
            
            // Safe rating calculation
            if (listing.reviews && Array.isArray(listing.reviews) && listing.reviews.length > 0) {
                const validReviews = listing.reviews.filter(review => 
                    review && typeof review.rating === 'number' && !isNaN(review.rating)
                );

                if (validReviews.length > 0) {
                    const totalRating = validReviews.reduce((sum, review) => sum + review.rating, 0);
                    listingObj.averageRating = totalRating / validReviews.length;
                    listingObj.reviewCount = validReviews.length;
                } else {
                    listingObj.averageRating = 0;
                    listingObj.reviewCount = 0;
                }
            } else {
                listingObj.averageRating = 0;
                listingObj.reviewCount = 0;
            }
            return listingObj;
        });
        
        res.render("listings/index.ejs", { allListings: listingsWithRatings });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
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

async function searchListing(req, res){
    const { q } = req.query;
    
    if (!q || q.trim() === '') {
        return res.redirect('/listings');
    }

    const searchRegex = new RegExp(q, 'i');
    
    const allListings = await Listing.find({
        $or: [
            { title: searchRegex },
            { description: searchRegex },
            { location: searchRegex },
            { country: searchRegex }
        ]
    }).populate('reviews');

    res.render("listings/index.ejs", { 
        allListings, 
        searchQuery: q,
        searchResults: true 
    });
}

export { index, newListing, createListing, showListing, editListing, updateListing, deleteListing, searchListing };