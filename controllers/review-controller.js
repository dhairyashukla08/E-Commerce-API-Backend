import Review from "../models/review-model.js";
import Product from "../models/product-model.js";

export const postReview=async(req,res)=>{
    try {
        const { rating, comment, productId } = req.body;
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });
        let review = await Review.findOne({ user: req.user.id, product: productId });
        if (review) {
            review.rating = rating;
            review.comment = comment;
            await review.save();
        }
        else {
            review = await Review.create({
                user: req.user.id,
                product: productId,
                name: req.user.name,
                rating,
                comment
            });
        }
        const reviews = await Review.find({ product: productId });
        const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
        product.ratings = avgRating;
        product.numOfReviews = reviews.length;
        await product.save();

        res.status(201).json({ success: true, review });
    } catch (error) {
        res.status(500).json({ message: "Error posting review", error: error.message });
    }
};

export const getProductReviews=async(req,res)=>{
    try {
        const reviews = await Review.find({ product: req.params.productId })
        .populate("user", "username")
            .sort("-createdAt");

            res.status(200).json({ success: true, count: reviews.length, reviews });
    } catch (error) {
        res.status(500).json({ message: "Error fetching reviews", error: error.message });
    }
}