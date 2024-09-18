const express = require("express");
const router = express.Router();
const authController = require("../../controller/auth");
const auth = require("../../middlewares/auth");

router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.post("/logout", auth, authController.logout);
router.get("/current", auth, authController.currentUser);

module.exports = router;
