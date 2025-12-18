const Order = require("../models/Order");
const Product = require("../models/Product");
const { z } = require("zod");

const orderItemSchema = z.object({
    product: z.string(),
    quantity: z.number().int().positive(),
});

const createOrderSchema = z.object({
    items: z.array(orderItemSchema).nonempty(),
});

exports.createOrder = async (req, res) => {
    try {
        const { items } = createOrderSchema.parse(req.body);

        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.product}` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for product: ${product.title}` });
            }

            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price,
            });

            totalAmount += product.price * item.quantity;

            // Optional: Decrease stock
            // product.stock -= item.quantity;
            // await product.save();
        }

        const order = await Order.create({
            user: req.user.id,
            items: orderItems,
            totalAmount,
        });

        res.status(201).json(order);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).populate("items.product", "title image");
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

const QRCode = require("qrcode");

exports.generateQRCode = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        // Encode a URL that the scanner can visit
        const scanUrl = `http://localhost:3000/api/orders/${order._id}/scan`;

        const qrCodeUrl = await QRCode.toDataURL(scanUrl);
        res.json({ qrCodeUrl, scanUrl });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.scanOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).select("totalAmount status");
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json({
            orderId: order._id,
            amount: order.totalAmount,
            status: order.status
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { amount } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.totalAmount !== amount) {
            return res.status(400).json({ message: "Invalid payment amount" });
        }

        order.status = "paid";
        await order.save();

        res.json({ message: "Payment successful", order });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
