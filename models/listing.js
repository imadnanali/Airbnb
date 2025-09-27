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
        type: Schema.Types.Mixed, // Change to Mixed to accept both string and object
        default: "https://images.unsplash.com/photo-1586810724476-c294fb7ac01b?q=80&w=436&auto=format&fit=crop&ixlib=rb-4.1.0",
        validate: {
            validator: function (v) {
                if (!v || v === "") return true;

                // Handle both string and object formats
                if (typeof v === 'string') {
                    try {
                        new URL(v);
                        return true;
                    } catch (e) {
                        return false;
                    }
                }

                if (typeof v === 'object' && v.url) {
                    try {
                        new URL(v.url);
                        return true;
                    } catch (e) {
                        return false;
                    }
                }

                return false;
            },
            message: "Please provide a valid image URL or object with url property"
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
    ],
    owner:
    {
        type: Schema.Types.ObjectId,
        ref: "User"
    }

}, {
    timestamps: true
});

// Virtual for getting image URL (handles both formats)
// listingSchema.virtual('imageUrl').get(function() {
//     const defaultImage = "https://images.unsplash.com/photo-1586810724476-c294fb7ac01b?q=80&w=436&auto=format&fit=crop&ixlib=rb-4.1.0";

//     if (!this.image) return defaultImage;

//     if (typeof this.image === 'string') {
//         return this.image;
//     }

//     if (typeof this.image === 'object' && this.image.url) {
//         return this.image.url;
//     }

//     return defaultImage;
// });

// listingSchema.post("findOneAndDelete", async (listing) => {
//     if (listing) {
//         await Review.deleteMany({ _id: { $in: listing.reviews } });
//     }
// });

const Listing = mongoose.model("Listing", listingSchema);
export default Listing;