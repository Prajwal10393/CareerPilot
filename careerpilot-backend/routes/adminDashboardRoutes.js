const express = require("express");

const {
  getAdminDashboardStats
} = require("../controllers/adminDashboardController");

const {
  protect,
  authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getAdminDashboardStats
);

module.exports = router;
