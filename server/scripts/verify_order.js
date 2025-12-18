const mongoose = require("mongoose");
const User = require("../models/User");
const Product = require("../models/Product");
const { generateToken } = require("../utils/jwt");
require("dotenv").config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to DB");

        // 1. Setup User
        let user = await User.findOne({ email: "test@example.com" });
        if (!user) {
            const bcrypt = require("bcrypt");
            const hashedPassword = await bcrypt.hash("password123", 10);
            user = await User.create({ name: "Test User", email: "test@example.com", password: hashedPassword });
        }
        const token = generateToken({ id: user._id, role: user.role });

        // 2. Setup Product
        let product = await Product.findOne({ title: "Order Test Product" });
        if (!product) {
            product = await Product.create({
                title: "Order Test Product",
                description: "For testing orders",
                price: 50,
                category: "Test",
                image: "http://test.com/img.jpg",
                stock: 100
            });
        }

        // 3. Create Order
        console.log("Creating Order...");
        const createRes = await fetch("http://localhost:3000/api/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                items: [
                    { product: product._id, quantity: 2 }
                ]
            })
        });

        if (createRes.ok) {
            const order = await createRes.json();
            console.log("SUCCESS: Order created. Total Amount:", order.totalAmount);
            if (order.totalAmount !== 100) {
                console.error("ERROR: Total amount incorrect. Expected 100, got", order.totalAmount);
            }
        } else {
            const err = await createRes.json();
            console.error("ERROR: Failed to create order:", err);
        }

        // 4. Get My Orders
        console.log("Fetching User Orders...");
        const getRes = await fetch("http://localhost:3000/api/orders/myorders", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (getRes.ok) {
            const orders = await getRes.json();
            console.log("SUCCESS: Fetched orders. Count:", orders.length);
            const lastOrder = orders[orders.length - 1];
            if (lastOrder.items[0].product.title === "Order Test Product") {
                console.log("SUCCESS: Order details verified.");
            } else {
                console.error("ERROR: Order details mismatch.");
            }
        } else {
            console.error("ERROR: Failed to fetch orders");
        }

    } catch (err) {
        console.error("Script Error:", err);
    } finally {
        await mongoose.disconnect();
    }
};

run();
