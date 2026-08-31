const express = require("express");

const {
  registerUser,
  loginUser
} = require("../controllers/authController");

const {
  protect,
  authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/me", protect, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
});

router.get(
  "/student-only",
  protect,
  authorizeRoles("student"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Student access granted"
    });
  }
);

router.get(
  "/admin-only",
  protect,
  authorizeRoles("admin"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Admin access granted"
    });
  }
);

module.exports = router;