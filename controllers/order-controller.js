import Product from "../models/product-model.js";
import Order from "../models/order-model.js";

export const newOrder=async(req,res)=>{
    try {
        const {shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice}=req.body;
        const order=await Order.create({
            shippingInfo,
            orderItems,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paidAt: Date.now(),
            user: req.user.id,
        });
        res.status(201).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ message: "Order creation failed", error: error.message });
    }
}

export const getSingleOrder=async(req,res)=>{
    try {
        const order = await Order.findById(req.params.id).populate("user", "username email");
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ message: "Error fetching order", error: error.message });
    }
};

export const myOrders=async(req,res)=>{
    try {
        const orders = await Order.find({ user: req.user.id });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ message: "Error fetching your orders", error: error.message });
    }
};


export const getAllOrders =async (req,res)=>{
    try {
        const orders = await Order.find();
        let totalAmount = 0;
        orders.forEach((order) => { totalAmount += order.totalPrice; });
        res.status(200).json({ success: true, totalAmount, orders });
    } catch (error) {
        res.status(500).json({ message: "Error fetching all orders", error: error.message });
    }
}

export const updateOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) return res.status(404).json({ message: "Order not found" });

        if (order.orderStatus === "Delivered") {
            return res.status(400).json({ message: "Order already delivered" });
        }

        order.orderItems.forEach(async (item) => {
            await updateStock(item.product, item.quantity);
        });

        order.orderStatus = req.body.status;
        if (req.body.status === "Delivered") {
            order.deliveredAt = Date.now();
        }

        await order.save({ validateBeforeSave: false });
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ message: "Update failed", error: error.message });
    }
};

async function updateStock(id, quantity) {
    const product = await Product.findById(id);
    product.stock -= quantity;
    await product.save({ validateBeforeSave: false });
}

export const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found with this Id",
            });
        }

        res.status(200).json({
            success: true,
            message: "Order deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Order deletion failed",
            error: error.message,
        });
    }
};