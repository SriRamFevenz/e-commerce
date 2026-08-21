const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/auth");
const adminMiddleware = require("../middleware/admin");

// Admin-only: used for product images
router.post("/", authMiddleware, adminMiddleware, upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    res.json({
        url: req.file.path,
        public_id: req.file.filename,
    });
});

module.exports = router;
