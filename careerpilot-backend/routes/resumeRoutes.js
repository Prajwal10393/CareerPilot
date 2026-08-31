const express = require("express");

const {
  uploadResume,
  getMyResumeAnalysis
} = require("../controllers/resumeController");

const {
  protect,
  authorizeRoles
} = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post(
  "/upload",
  protect,
  authorizeRoles("student"),
  upload.single("resume"),
  uploadResume
);

router.get(
  "/analysis",
  protect,
  authorizeRoles("student"),
  getMyResumeAnalysis
);

module.exports = router;
