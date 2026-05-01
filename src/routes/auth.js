const express = require("express");
const router = express.Router();
const {
  signup,
  verifyEmail,
  login,
  refreshToken,
  logout,
  getMe,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");

// Public routes
router.post("/signup", signup);
router.get("/verify-email", verifyEmail);
router.post("/login", login);
router.post("/refresh-token", refreshToken);

// Protected routes (require valid access token)
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);

module.exports = router;
