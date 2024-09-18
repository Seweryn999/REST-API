const express = require("express");
const router = express.Router();
const authController = require("../../controller/auth");
const auth = require("../../middlewares/auth");
const { upload } = require("../../middlewares/upload");

router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.post("/logout", auth, authController.logout);
router.get("/current", auth, authController.currentUser);
router.patch(
  "/avatars",
  auth,
  upload.single("avatar"),
  authController.uploadAvatar
);

module.exports = router;
