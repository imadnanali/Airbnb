import mongoose from "mongoose";
import Listing from "../models/listing.js";
import { data } from "./data.js";

const MONGO_URL = "mongodb://127.0.0.1:27017/airbnb";

main().then(res => {
    console.log("Connect to DB")
}).catch(err => {
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL)
}


const initDB = async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(data);
    console.log(`Data saved`);
}

initDB();