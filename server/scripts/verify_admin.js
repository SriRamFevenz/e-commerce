const mongoose = require("mongoose");
const User = require("../models/User");
const { generateToken } = require("../utils/jwt");
require("dotenv").config();

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';
const API_URL = `http://${HOST}:${PORT}/api`;

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);

        const user = await User.findOne({ email: process.env.ADMIN_EMAIL });
        if (!user) {
            console.error("Admin user not found (check .env ADMIN_EMAIL)");
            return;
        }

        const token = generateToken({ id: user._id, role: user.role });

        console.log(`Testing Admin Product Creation at ${API_URL}...`);
        const res = await fetch(`${API_URL}/products`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                title: "Admin Test Product",
                description: "Created by verify_admin.js",
                price: 100,
                category: "Test",
                image: "http://test.com/img.jpg",
                stock: 10
            })
        });

        if (res.ok) {
            console.log("SUCCESS: Product created");
        } else {
            console.error("ERROR: Failed to create product", await res.json());
        }

    } catch (err) {
        console.error("Script Error:", err);
    } finally {
        await mongoose.disconnect();
    }
};

run();
