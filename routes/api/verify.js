const express = require("express");
const router = express.Router();
const verifyController = require("../../controller/verify");
const auth = require("../../middlewares/auth");

router.get("/verify/:verificationToken", verifyController.verifyEmail);
router.post("/verify", auth, verifyController.resendVerifyEmai);

module.exports = router;
