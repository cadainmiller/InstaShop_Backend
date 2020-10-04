const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const auth = require("../middleware/auth");

router.post("/register", userController.registerNewUser);
router.post("/login", userController.loginUser);
router.get("/data", auth, userController.defineDummyData);
router.get("/", auth, userController.getUsers);
router.get("/:userId", auth, userController.getUserById);
router.put("/:userId", auth, userController.updateUserById);
router.delete("/:userId", auth, userController.deleteUser);

module.exports = router;
