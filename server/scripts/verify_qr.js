const mongoose = require("mongoose");
const User = require("../models/User");
const Product = require("../models/Product");
const { generateToken } = require("../utils/jwt");
require("dotenv").config();

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';
const API_URL = `http://${HOST}:${PORT}/api`;

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);

        const user = await User.findOne({ email: process.env.ADMIN_EMAIL });
        const product = await Product.findOne();

        if (!user || !product) return;

        const token = generateToken({ id: user._id, role: user.role });

        // Create Order
        console.log(`Creating QR Order at ${API_URL}...`);
        const createRes = await fetch(`${API_URL}/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                items: [{ product: product._id, quantity: 1 }],
                totalAmount: product.price,
                shippingAddress: { address: "Test St", city: "Test City", postalCode: "12345", country: "Test Country" },
                paymentMethod: "qr_code"
            })
        });

        const orderData = await createRes.json();
        if (!createRes.ok) {
            console.error("Failed to create order");
            return;
        }

        // Verify Payment
        console.log("Verifying Payment...");
        const payRes = await fetch(`${API_URL}/orders/${orderData.order._id}/verify-payment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ amount: product.price })
        });

        if (payRes.ok) {
            console.log("SUCCESS: Payment verified");
        } else {
            console.error("ERROR: Payment verification failed", await payRes.json());
        }

    } catch (err) {
        console.error("Script Error:", err);
    } finally {
        await mongoose.disconnect();
    }
};

run();
