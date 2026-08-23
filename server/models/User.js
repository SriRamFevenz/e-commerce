const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Invalid email address"],
    },
    profilePicture: {
        type: String,
        default: "",
    },
    mobile: {
        type: String,
        default: "",
        maxlength: 20,
    },
    bio: {
        type: String,
        default: "",
        maxlength: 500,
    },
    address: {
        type: String,
        default: "",
        maxlength: 300,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"],
    },
    // Incremented to invalidate all issued tokens (password change, etc.)
    tokenVersion: {
        type: Number,
        default: 0,
    },
    themePreference: {
        type: String,
        enum: ['light', 'dark', 'system'],
        default: 'system'
    },
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
