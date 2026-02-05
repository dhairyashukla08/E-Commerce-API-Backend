import express from "express";
const router=express.Router();

import { newOrder,getSingleOrder,myOrders,getAllOrders,updateOrder,deleteOrder } from "../controllers/order-controller.js";
import { authenticateUser, authorizeRoles } from "../middlewares/auth-middleware.js";

router.use(authenticateUser);

router.post("/new",newOrder);

router.get("/:id",getSingleOrder);

router.get("/me/my-orders",myOrders);

router.get("/admin/all", authorizeRoles("admin"),getAllOrders);

router.patch("/admin/order/:id", authorizeRoles("admin"),updateOrder);

router.delete("/admin/order/:id", authorizeRoles("admin"),deleteOrder);

export default router;