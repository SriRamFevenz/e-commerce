const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    profilePicture: {
        type: String,
        default: "",
    },
    mobile: {
        type: String,
        default: "",
    },
    bio: {
        type: String,
        default: "",
    },
    address: {
        type: String,
        default: "",
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "user",
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
