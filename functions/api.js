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

const router=express.Router();
router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);
router.use("/reviews", reviewRoutes);

app.use("/.netlify/functions/api", router);

const connectDB = async () => {
    if (mongoose.connection.readyState === 1) return;
    await mongoose.connect(process.env.MONGO_URL);
};

export const handler = async (event, context) => {
    await connectDB();
    const serverlessHandler = serverless(app);
    return await serverlessHandler(event, context);
};