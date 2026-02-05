import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import express from "express"
import authRoutes from "./routes/auth-routes.js";
import productRoutes from "./routes/product-routes.js"
import orderRoutes from "./routes/order-routes.js";
import reviewRoutes from "./routes/review-routes.js";
import cookieParser from "cookie-parser";
const app=express();
import cors from "cors";

app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        const method = req.method.padEnd(7);
        const url = req.originalUrl;
        const status = res.statusCode;
        
        console.log(`[LOG] ${method} | Status: ${status} | Path: ${url} | Time: ${duration}ms`);
    });
    
    next();
});

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "*",
    credentials:true,
}))

app.get("/",(req,res)=>{
    res.send("hello World")
})

app.use("/api/auth",authRoutes);

app.use("/api/products",productRoutes);

app.use("/api/orders",orderRoutes);

app.use("/api/reviews", reviewRoutes);

const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.log(error)
    }
}
connectDB();

app.listen(3000,()=>{
   try{ console.log("Server Started At PORT:3000")}
   catch(err){
    console.log(err);
   }
})