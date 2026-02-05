import express from "express";
const router = express.Router();
import { getAllProducts,getProductById,createProduct,updateProduct,deleteProduct } from "../controllers/product-controller.js";
import { authenticateUser } from "../middlewares/auth-middleware.js";

router.get("/", getAllProducts);

router.post("/", authenticateUser ,createProduct);

router.get("/:id",getProductById );

router.patch("/:id",authenticateUser, updateProduct);

router.delete("/:id",authenticateUser, deleteProduct);

export default router;
