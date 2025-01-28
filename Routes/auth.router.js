const express = require("express");
const router = express.Router();

const {
  Signup,
  verifyEmail,
  Login,
  Logout,
  forgetPassword,
  resetPassword,
  checkAuth,
} = require("../Controller/Auth.Controller");
const verifyToken = require("../middleware/verifyToken");



router.get("/check-auth",verifyToken, checkAuth)


router.post("/signup", Signup);
router.post("/login", Login);
router.post("/logout", Logout);
router.post("/verify-email", verifyEmail);
router.post("/forget-password", forgetPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
