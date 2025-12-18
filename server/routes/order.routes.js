const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const authMiddleware = require("../middleware/auth");

router.post("/", authMiddleware, orderController.createOrder);
router.get("/myorders", authMiddleware, orderController.getMyOrders);
router.get("/:id/qr", authMiddleware, orderController.generateQRCode);
router.get("/:id/scan", orderController.scanOrder); // Public for scanner
router.post("/:id/pay", authMiddleware, orderController.verifyPayment);

// Secure QR Payment Routes (Public)
router.get("/validate-token/:token", orderController.validatePaymentToken);
router.post("/pay-token/:token", orderController.processTokenPayment);

module.exports = router;
