import express from "express";
import mongoose from "mongoose"
import Listing from "./models/listing.js";
import { fileURLToPath } from "url";
import path from "path";
import ejsMate from "ejs-mate";
import methodOverride from "method-override";
import wrapAsync from "./utils/wrapAsync.js";
import ExpressError from "./utils/ExpressError.js";
import { listingSchema, reviewSchema } from "./schema.js";
import dotenv from "dotenv";
dotenv.config();

import listings from "./routes/listing.js";
import reviews from "./routes/review.js";


const port = process.env.PORT || 3000;



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
    console.log("Connect to DB");
}).catch(err => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
};

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

//Review 

app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("listings/error.ejs", {
        statusCode,
        message
    });
});

app.get("/", (req, res) => {
    res.send(`I'm root`);
});

app.listen(port, () => {
    console.log(`App is running at port ${port}`);
});