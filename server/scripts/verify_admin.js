const mongoose = require("mongoose");
const User = require("../models/User");
const { generateToken } = require("../utils/jwt");
require("dotenv").config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to DB");

        // 1. Login/Create User
        let user = await User.findOne({ email: "test@example.com" });
        if (!user) {
            const bcrypt = require("bcrypt");
            const hashedPassword = await bcrypt.hash("password123", 10);
            user = await User.create({ name: "Test User", email: "test@example.com", password: hashedPassword });
        }

        // Ensure user is NOT admin initially
        user.role = "user";
        await user.save();

        const token = generateToken({ id: user._id, role: user.role });
        console.log("User Token generated");

        // 2. Try to create product (Should Fail)
        const failRes = await fetch("http://localhost:3000/api/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                title: "Fail Product",
                description: "Should fail",
                price: 10,
                category: "Test",
                image: "http://test.com/img.jpg",
                stock: 1
            })
        });

        if (failRes.status === 403) {
            console.log("SUCCESS: Non-admin blocked (403)");
        } else {
            console.error("ERROR: Unexpected status for non-admin:", failRes.status);
        }

        // 3. Make User Admin
        user.role = "admin";
        await user.save();
        console.log("User promoted to admin");

        // Re-generate token with new role
        const adminToken = generateToken({ id: user._id, role: "admin" });

        // 4. Try to create product (Should Succeed)
        const successRes = await fetch("http://localhost:3000/api/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${adminToken}`
            },
            body: JSON.stringify({
                title: "Admin Product",
                description: "Created by admin",
                price: 100,
                category: "Test",
                image: "http://test.com/img.jpg",
                stock: 10
            })
        });

        if (successRes.ok) {
            const data = await successRes.json();
            console.log("SUCCESS: Admin created product:", data.title);
        } else {
            console.error("ERROR: Admin failed to create product:", successRes.status);
        }

    } catch (err) {
        console.error("Script Error:", err);
    } finally {
        await mongoose.disconnect();
    }
};

run();
