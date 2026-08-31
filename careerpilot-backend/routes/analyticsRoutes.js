const express = require("express");

const {
  getStudentAnalytics
} = require("../controllers/analyticsController");

const {
  protect,
  authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/student",
  protect,
  authorizeRoles("student"),
  getStudentAnalytics
);

module.exports = router;
