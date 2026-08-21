const mongoose = require("mongoose");
const User = require("../models/User");
const Order = require("../models/Order");
const bcrypt = require("bcrypt");
const cloudinary = require("../config/cloudinary");
const { generateToken } = require("../utils/jwt");
const { z } = require("zod");

const updateProfileSchema = z.object({
    name: z.string().min(3).max(100).trim().optional(),
    mobile: z.string().max(20).trim().optional(),
    bio: z.string().max(500).trim().optional(),
    address: z.string().max(300).trim().optional(),
});

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password -tokenVersion");
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
        const updates = updateProfileSchema.parse(req.body);
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (updates.name) user.name = updates.name;
        if (updates.mobile) user.mobile = updates.mobile;
        if (updates.bio) user.bio = updates.bio;
        if (updates.address) user.address = updates.address;

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
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.issues });
        }
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

        if (typeof newPassword !== "string" || newPassword.length < 6 || newPassword.length > 72) {
            return res.status(400).json({ message: "New password must be between 6 and 72 characters" });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect old password" });
        }

        // Invalidate every existing session, then re-issue a fresh token for
        // the current device so other devices are logged out.
        user.tokenVersion += 1;
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        const token = generateToken({
            id: user._id,
            role: user.role,
            tokenVersion: user.tokenVersion
        });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

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

        // Orders are kept for record-keeping; deleting the user invalidates
        // all their tokens since authMiddleware verifies the user exists.

        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        res.json({ message: "Account deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Extracts the Cloudinary public_id from a stored URL
const getPublicIdFromUrl = (url) => {
    const regex = /\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/;
    const match = url.match(regex);
    return match ? match[1] : null;
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
                const publicId = getPublicIdFromUrl(user.profilePicture);
                if (publicId) {
                    await cloudinary.uploader.destroy(publicId);
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
        res.status(500).json({ message: "Internal server error" });
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
                const publicId = getPublicIdFromUrl(user.profilePicture);
                if (publicId) {
                    await cloudinary.uploader.destroy(publicId);
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
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.addToWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({ message: "Invalid product id" });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare as ObjectIds to avoid duplicates
        const exists = user.wishlist.some((id) => id.equals(productId));
        if (!exists) {
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
        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({ message: "Invalid product id" });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.wishlist = user.wishlist.filter((id) => !id.equals(productId));
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
