const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth");

const upload = require("../middleware/upload");

router.get("/profile", authMiddleware, userController.getProfile);
router.put("/profile", authMiddleware, userController.updateProfile);
router.put("/profile/password", authMiddleware, userController.updatePassword);
router.put("/profile/theme", authMiddleware, userController.updateTheme);
router.delete("/profile", authMiddleware, userController.deleteAccount);
router.post("/profile/picture", authMiddleware, upload.single("image"), userController.uploadProfilePicture);
router.delete("/profile/picture", authMiddleware, userController.deleteProfilePicture);

router.get("/wishlist", authMiddleware, userController.getWishlist);
router.post("/wishlist/:productId", authMiddleware, userController.addToWishlist);
router.delete("/wishlist/:productId", authMiddleware, userController.removeFromWishlist);

module.exports = router;
