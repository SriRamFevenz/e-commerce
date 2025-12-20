const User = require("../models/User");
const Order = require("../models/Order");
const bcrypt = require("bcrypt");
const cloudinary = require("../config/cloudinary");

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Aggregate order statistics
        const orders = await Order.find({ user: req.user.id, status: "paid" });
        const ordersCount = orders.length;
        const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);

        res.json({
            ...user.toObject(),
            ordersCount,
            totalSpent,
            profilePicture: user.profilePicture,
            themePreference: user.themePreference
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, mobile, bio, address } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (name) user.name = name;
        if (mobile) user.mobile = mobile;
        if (bio) user.bio = bio;
        if (address) user.address = address;

        await user.save();
        res.json({
            message: "Profile updated successfully",
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                mobile: user.mobile,
                bio: user.bio,
                address: user.address,
                profilePicture: user.profilePicture,
                themePreference: user.themePreference
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.updateTheme = async (req, res) => {
    try {
        const { theme } = req.body;
        if (!['light', 'dark', 'system'].includes(theme)) {
            return res.status(400).json({ message: "Invalid theme preference" });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.themePreference = theme;
        await user.save();

        res.json({ message: "Theme updated successfully", themePreference: user.themePreference });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "Please provide both old and new passwords" });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect old password" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({ message: "Password updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await User.findByIdAndDelete(req.user.id);
        // await Order.deleteMany({ user: req.user.id });

        res.json({ message: "Account deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.uploadProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Delete old profile picture if it exists
        if (user.profilePicture) {
            try {
                const regex = /\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/;
                const match = user.profilePicture.match(regex);
                if (match) {
                    await cloudinary.uploader.destroy(match[1]);
                }
            } catch (err) {
                console.error("Failed to delete old image from Cloudinary:", err);
            }
        }

        // Cloudinary returns the URL in req.file.path
        const fileUrl = req.file.path;

        user.profilePicture = fileUrl;
        await user.save();

        res.json({ message: "Profile picture updated", profilePicture: fileUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

exports.deleteProfilePicture = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Delete from Cloudinary
        if (user.profilePicture) {
            try {
                const regex = /\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/;
                const match = user.profilePicture.match(regex);
                if (match) {
                    await cloudinary.uploader.destroy(match[1]);
                }
            } catch (err) {
                console.error("Failed to delete image from Cloudinary:", err);
            }
        }

        user.profilePicture = "";
        await user.save();

        res.json({ message: "Profile picture deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

exports.addToWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Add to set to avoid duplicates
        if (!user.wishlist.includes(productId)) {
            user.wishlist.push(productId);
            await user.save();
        }

        res.json({ message: "Added to wishlist", wishlist: user.wishlist });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
        await user.save();

        res.json({ message: "Removed from wishlist", wishlist: user.wishlist });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('wishlist');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user.wishlist);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
