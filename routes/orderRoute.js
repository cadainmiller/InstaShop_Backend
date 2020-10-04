const express = require("express");
const router = express.Router();
const orderController = require("../controller/orderController");
const auth = require("../middleware/auth");

router.post("/create", orderController.createOrder);
router.get("/",  orderController.getOrders);
router.get("/:orderId", orderController.getOrderByID);

module.exports = router;
