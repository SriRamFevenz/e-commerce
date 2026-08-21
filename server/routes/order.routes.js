const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const authMiddleware = require("../middleware/auth");

router.post("/", authMiddleware, orderController.createOrder);
router.get("/myorders", authMiddleware, orderController.getMyOrders);
router.get("/:id/qr", authMiddleware, orderController.generateQRCode);
router.get("/:id/scan", authMiddleware, orderController.scanOrder); // Owner-only status lookup
router.post("/:id/pay", authMiddleware, orderController.verifyPayment); // Owner-only demo payment

// Secure QR Payment Routes (Public - the random 32-byte token is the credential)
router.get("/validate-token/:token", orderController.validatePaymentToken);
router.post("/pay-token/:token", orderController.processTokenPayment);

module.exports = router;
