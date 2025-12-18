const mongoose = require("mongoose");
const User = require("../models/User");
const Product = require("../models/Product");
const { generateToken } = require("../utils/jwt");
require("dotenv").config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to DB");

        // 1. Setup User & Product
        let user = await User.findOne({ email: "test@example.com" });
        if (!user) {
            const bcrypt = require("bcrypt");
            const hashedPassword = await bcrypt.hash("password123", 10);
            user = await User.create({ name: "Test User", email: "test@example.com", password: hashedPassword });
        }
        const token = generateToken({ id: user._id, role: user.role });

        let product = await Product.findOne({ title: "QR Test Product" });
        if (!product) {
            product = await Product.create({
                title: "QR Test Product",
                description: "For testing QR",
                price: 50,
                category: "Test",
                image: "http://test.com/img.jpg",
                stock: 100
            });
        }

        // 2. Create Order
        console.log("Creating Order...");
        const createRes = await fetch("http://localhost:3000/api/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                items: [{ product: product._id, quantity: 1 }]
            })
        });

        if (!createRes.ok) throw new Error("Failed to create order");
        const order = await createRes.json();
        console.log("Order Created:", order._id);

        // 3. Generate QR
        console.log("Generating QR...");
        const qrRes = await fetch(`http://localhost:3000/api/orders/${order._id}/qr`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!qrRes.ok) throw new Error("Failed to generate QR");
        const qrData = await qrRes.json();

        if (qrData.scanUrl && qrData.scanUrl.includes("/scan")) {
            console.log("SUCCESS: Scan URL received:", qrData.scanUrl);
        } else {
            console.error("ERROR: Invalid QR response", qrData);
        }

        // 4. Simulate Scan (Hit the Scan URL)
        console.log("Simulating Scan...");
        const scanRes = await fetch(qrData.scanUrl);
        if (scanRes.ok) {
            const scanData = await scanRes.json();
            console.log("SUCCESS: Scanned Order. Amount:", scanData.amount);
            if (scanData.amount !== 50) {
                console.error("ERROR: Amount mismatch on scan");
            }
        } else {
            console.error("ERROR: Failed to scan order");
        }

        // 5. Verify Payment
        console.log("Verifying Payment...");
        const payRes = await fetch(`http://localhost:3000/api/orders/${order._id}/pay`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ amount: order.totalAmount })
        });

        if (payRes.ok) {
            const payData = await payRes.json();
            console.log("SUCCESS: Payment verified. Order Status:", payData.order.status);
            if (payData.order.status === "paid") {
                console.log("Verified: Order is marked as PAID");
            } else {
                console.error("ERROR: Order status is not PAID");
            }
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
