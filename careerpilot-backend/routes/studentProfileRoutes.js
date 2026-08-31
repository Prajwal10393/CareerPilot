const express = require("express");

const {
  createOrUpdateProfile,
  getMyProfile
} = require("../controllers/studentProfileController");

const {
  protect,
  authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/me",
  protect,
  authorizeRoles("student"),
  getMyProfile
);

router.put(
  "/me",
  protect,
  authorizeRoles("student"),
  createOrUpdateProfile
);

module.exports = router;
