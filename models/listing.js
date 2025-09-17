import mongoose from "mongoose"
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    image: {
        filename: { type: String, default: "listingimage" },
        url: {
            type: String,
        }
    },
    price: {
        type: Number,
        require: true,
    },
    location: {
        type: String,
        require: true
    },
    country: {
        type: String,
        require: true
    }
})




const Listing = mongoose.model("Listing", listingSchema);
export default Listing;



