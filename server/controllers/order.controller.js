const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const { z } = require("zod");
const crypto = require("crypto");
const QRCode = require("qrcode");
const { paymentLogger } = require("../utils/logger");
const { sendOrderConfirmationEmail, sendPaymentSuccessEmail } = require("../utils/emailService");

const orderItemSchema = z.object({
    product: z.string(),
    quantity: z.number().int().positive().max(999),
});

const createOrderSchema = z.object({
    items: z.array(orderItemSchema).nonempty().max(50),
    paymentMethod: z.enum(["online", "cod"]),
});

exports.createOrder = async (req, res) => {
    try {
        const { items, paymentMethod } = createOrderSchema.parse(req.body);

        let totalAmount = 0;
        const orderItems = [];
        const decremented = [];

        // Atomically decrement stock per item (conditional on availability, so
        // concurrent orders can never oversell). If any item fails, restore
        // everything that was already taken.
        for (const item of items) {
            const product = await Product.findOneAndUpdate(
                { _id: item.product, stock: { $gte: item.quantity } },
                { $inc: { stock: -item.quantity } },
                { new: true }
            );

            if (!product) {
                await restoreStock(decremented);
                return res.status(400).json({ message: `Insufficient stock for product: ${item.product}` });
            }

            decremented.push({ id: product._id, quantity: item.quantity });
            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price,
            });
            totalAmount += product.price * item.quantity;
        }

        // Generate payment token immediately
        const token = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours validity for email link

        let order;
        try {
            const created = await Order.create({
                user: req.user.id,
                items: orderItems,
                totalAmount,
                paymentMethod,
                paymentToken: token,
                paymentTokenExpiresAt: expiresAt
            });
            order = created;
        } catch (err) {
            await restoreStock(decremented);
            throw err;
        }

        // Generate Payment URL
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
        const paymentUrl = `${clientUrl}/pay/${order.paymentToken}`;

        // Fetch user to get email
        const user = await User.findById(req.user.id);
        let emailSent = false;
        if (user && user.email) {
            await order.populate("items.product", "title");
            const emailResult = await sendOrderConfirmationEmail(user.email, order, paymentUrl);
            if (emailResult) {
                emailSent = true;
            }
        }

        res.status(201).json({ ...order.toObject(), emailSent });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.issues });
        }
        res.status(500).json({ message: "Internal server error" });
    }
};

const restoreStock = async (decremented) => {
    for (const d of decremented) {
        await Product.updateOne(
            { _id: d.id },
            { $inc: { stock: d.quantity } }
        );
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

exports.generateQRCode = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        // Check if there's already a valid token
        let token = order.paymentToken;
        let expiresAt = order.paymentTokenExpiresAt;

        if (!token || !expiresAt || expiresAt < Date.now()) {
            // Generate a secure random token only if needed
            token = crypto.randomBytes(32).toString("hex");
            expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours (consistent with createOrder)

            order.paymentToken = token;
            order.paymentTokenExpiresAt = expiresAt;
            await order.save();
        }

        // URL points to the CLIENT payment page with the token
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
        const scanUrl = `${clientUrl}/pay/${token}`;

        const qrCodeUrl = await QRCode.toDataURL(scanUrl);
        res.json({ qrCodeUrl, scanUrl });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

// Owner-only status lookup (used by QR polling and scan page)
exports.scanOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).select("user totalAmount status");
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
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

// Owner-only demo payment confirmation. Amount is never trusted from the client.
exports.verifyPayment = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        if (order.status === "paid") {
            return res.status(400).json({ message: "Order already paid" });
        }

        order.status = "paid";
        await order.save();

        paymentLogger.info({
            message: 'Payment Successful',
            orderId: order._id,
            amount: order.totalAmount,
            userId: order.user,
            method: 'manual_verify',
            timestamp: new Date().toISOString()
        });

        const user = await User.findById(order.user);
        if (user && user.email) {
            sendPaymentSuccessEmail(user.email, order);
        }

        res.json({ message: "Payment successful", order });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.validatePaymentToken = async (req, res) => {
    try {
        const { token } = req.params;
        const order = await Order.findOne({
            paymentToken: token,
            paymentTokenExpiresAt: { $gt: Date.now() }
        }).select("totalAmount status");

        if (!order) {
            return res.status(400).json({ message: "Invalid or expired payment link" });
        }

        if (order.status === 'paid') {
            return res.status(400).json({ message: "Order already paid" });
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

exports.processTokenPayment = async (req, res) => {
    try {
        const { token } = req.params;

        // Atomically claim the order by clearing the token, so a link can only be used once
        const order = await Order.findOneAndUpdate(
            {
                paymentToken: token,
                paymentTokenExpiresAt: { $gt: Date.now() },
                status: { $ne: "paid" }
            },
            {
                $set: { status: "paid" },
                $unset: { paymentToken: "", paymentTokenExpiresAt: "" }
            },
            { new: true }
        );

        if (!order) {
            return res.status(400).json({ message: "Invalid or expired payment link" });
        }

        paymentLogger.info({
            message: 'Payment Successful',
            orderId: order._id,
            amount: order.totalAmount,
            userId: order.user,
            method: 'token_payment',
            timestamp: new Date().toISOString()
        });

        const user = await User.findById(order.user);
        if (user && user.email) {
            sendPaymentSuccessEmail(user.email, order);
        }

        res.json({ message: "Payment successful", order });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
