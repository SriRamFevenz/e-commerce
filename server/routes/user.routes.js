const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth");

router.get("/profile", authMiddleware, userController.getProfile);
router.put("/profile", authMiddleware, userController.updateProfile);
router.put("/profile/password", authMiddleware, userController.updatePassword);
router.delete("/profile", authMiddleware, userController.deleteAccount);

module.exports = router;
