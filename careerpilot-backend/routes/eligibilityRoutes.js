const express = require("express");

const {
  checkEligibility
} = require("../controllers/eligibilityController");

const {
  protect,
  authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/:driveId",
  protect,
  authorizeRoles("student"),
  checkEligibility
);

module.exports = router;