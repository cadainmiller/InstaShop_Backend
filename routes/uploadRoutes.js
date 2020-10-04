const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const uploadController = require("../controller/uploadController");
const auth = require("../middleware/auth");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/images");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

router.post(
  "/productimage",
  upload.single("productimage"),
  uploadController.uploadProductImage
);

module.exports = router;
