import express from "express";
import mongoose from "mongoose"
import Listing from "./models/listing.js";
import { fileURLToPath } from "url";
import path from "path";
import ejsMate from "ejs-mate";
import methodOverride from "method-override";
import wrapAsync from "./utils/wrapAsync.js";
import ExpressError from "./utils/ExpressError.js";
import dotenv from "dotenv"
dotenv.config()

const port = process.env.port;



const app = express();
const MONGO_URL = "mongodb://127.0.0.1:27017/airbnb";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejsMate);
app.use(methodOverride("_method"));


main().then(res => {
    console.log("Connect to DB")
}).catch(err => {
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL)
}

app.get("/listings", wrapAsync(async(req, res) => {
    let allListings = await Listing.find({})
    res.render("listings/index.ejs", { allListings })
}))

// New Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs")
})

// Create Route
app.post("/listings", wrapAsync(async (req, res) => {
    if(!req.body.listen){
        throw new ExpressError(400, "Send valid data for listing")
    }
    const newListing = new Listing(req.body.listing)
    await newListing.save();
    res.redirect("/listings")
}))

// Show Route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id)
    res.render("listings/show.ejs", { listing });
}))

// Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing })
}))

//  Update Route
app.put("/listings/:id", wrapAsync(async (req, res) => {
    if(!req.body.listen){
        throw new ExpressError(400, "Send valid data for listing")
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing })
    res.redirect(`/listings/${id}`);
}))

// Delete Route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndDelete(id);
    // console.log(listing);
    res.redirect("/listings")
}))

    app.use((req, res, next) => {
        next(new ExpressError(404, "Page Not Found"))
    })

app.use((err, req, res, next) => {
    let { statusCode=500, message= "Something went wrong!"} = err;
    res.status(statusCode).send(message);
})

app.get("/", (req, res) => {
    res.send(`I'm root`)
})

app.listen(port, () => {
    console.log(`App is running at port ${port}`);
})