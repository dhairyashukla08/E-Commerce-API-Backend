import serverless from "serverless-http";
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";


import authRoutes from "../routes/auth-routes.js";
import productRoutes from "../routes/product-routes.js";
import orderRoutes from "../routes/order-routes.js";
import reviewRoutes from "../routes/review-routes.js";

dotenv.config();
const app=express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "*", credentials: true }));

const connectDB = async () => {
 if (mongoose.connections[0].readyState) {
        return;
    }
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
};

const router=express.Router();
router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);
router.use("/reviews", reviewRoutes);

app.use("/.netlify/functions/api", router);



export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
    
    await connectDB();
    return serverless(app)(event, context);
};

export { main as handler };