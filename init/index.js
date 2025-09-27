import { data } from "./data.js";
import Listing from "../models/listing.js";
import mongoose from "mongoose";

const MONGO_URL = "mongodb://127.0.0.1:27017/airbnb";

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await main();
    await Listing.deleteMany({});
    
    // Add owner ID to each listing
    const listingsWithOwner = data.map(listing => ({
        ...listing,
        owner: "68d7bdc48290fa24c45d427d"
    }));
    
    await Listing.insertMany(listingsWithOwner);
    console.log("Data was initialized");
};

initDB();