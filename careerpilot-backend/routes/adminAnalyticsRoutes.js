const express = require("express");

const {
  getAdminAnalytics
} = require("../controllers/adminAnalyticsController");

const {
  protect,
  authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getAdminAnalytics
);

module.exports = router;
