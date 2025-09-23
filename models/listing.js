import mongoose from "mongoose";
const Schema = mongoose.Schema;
import Review from "./review.js";

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: "https://images.unsplash.com/photo-1586810724476-c294fb7ac01b?q=80&w=436&auto=format&fit=crop&ixlib=rb-4.1.0",
        validate: {
            validator: function (v) {
                if (v === "") return true;
                try {
                    new URL(v);
                    return true;
                } catch (e) {
                    return false;
                }
            },
            message: "Please provide a valid image URL"
        }
    },
    price: {
        type: Number,
        required: true,
        min: [0, "Price cannot be negative"]
    },
    location: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
}, {
    timestamps: true
});

listingSchema.post("findOneAndDelete", async (listing) =>{
    if(listing){
        await Review.deleteMany({_id : {$in: listing.reviews}});
    }
})

const Listing = mongoose.model("Listing", listingSchema);
export default Listing;





// listingSchema.pre('save', function(next) {
//     if (!this.image || this.image.trim() === "") {
//         this.image = "https://images.unsplash.com/photo-1586810724476-c294fb7ac01b?q=80&w=436&auto=format&fit=crop&ixlib=rb-4.1.0";
//     }
//     next();
// });