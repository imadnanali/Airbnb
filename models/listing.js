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
            default: "https://images.unsplash.com/photo-1586810724476-c294fb7ac01b?q=80&w=436&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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



