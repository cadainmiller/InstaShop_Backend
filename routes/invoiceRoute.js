const express = require("express");
const router = express.Router();
const invoiceController = require("../controller/invoiceController");
const auth = require("../middleware/auth");

router.post("/create", invoiceController.createInvoice);
router.get("/:invoiceId", auth, invoiceController.getInvoiceById);
router.get("/email/:invoiceId", auth, invoiceController.emailInvoiceById);
router.get("/", auth, invoiceController.getInvoice);

module.exports = router;
