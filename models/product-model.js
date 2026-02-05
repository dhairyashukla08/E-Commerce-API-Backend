import mongoose from "mongoose";

const productSchema=new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    ratings: { type: Number, default: 0 },
numOfReviews: { type: Number, default: 0 }


},{timestamps:true})

export default mongoose.model("Product",productSchema);