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

        if (!user || !product) {
            console.error("User or Product not found");
            return;
        }

        const token = generateToken({ id: user._id, role: user.role });

        // Create Order
        console.log(`Creating Order at ${API_URL}...`);
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
                paymentMethod: "cod"
            })
        });

        if (!createRes.ok) {
            console.error("ERROR: Failed to create order", await createRes.json());
            return;
        }
        console.log("SUCCESS: Order created");

        // Fetch Orders
        console.log("Fetching Orders...");
        const getRes = await fetch(`${API_URL}/orders/myorders`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (getRes.ok) {
            const orders = await getRes.json();
            console.log("SUCCESS: Fetched orders. Count:", orders.length);
        } else {
            console.error("ERROR: Failed to fetch orders", await getRes.json());
        }

    } catch (err) {
        console.error("Script Error:", err);
    } finally {
        await mongoose.disconnect();
    }
};

run();
