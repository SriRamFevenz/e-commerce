const mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config();

const email = "test@example.com"; // Change this to the email you want to promote

const promote = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to DB");

        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found");
            return;
        }

        user.role = "admin";
        await user.save();
        console.log(`User ${email} promoted to admin successfully`);

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await mongoose.disconnect();
    }
};

promote();
