const User = require("../models/User");
const Order = require("../models/Order");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

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
            const oldFilename = user.profilePicture.split("/").pop();
            const oldFilePath = path.join(__dirname, "../uploads", oldFilename);
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
        }

        // Construct the filename
        const filename = `${Date.now()}-${req.file.originalname.split('.')[0]}.jpeg`;
        const filePath = path.join(__dirname, "../uploads", filename);

        // Compress and save the image
        await sharp(req.file.buffer)
            .resize(500, 500, { fit: 'cover' }) // Resize to 500x500
            .toFormat('jpeg')
            .jpeg({ quality: 80 }) // Compress to 80% quality
            .toFile(filePath);

        // Construct the file URL
        const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${filename}`;

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

        // Delete profile picture file if it exists
        if (user.profilePicture) {
            const filename = user.profilePicture.split("/").pop();
            const filePath = path.join(__dirname, "../uploads", filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
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
