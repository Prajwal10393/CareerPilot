const express = require("express");

const {
  createInterview,
  getMyInterviews,
  getInterviewById,
  updateInterview,
  updateInterviewStatus,
  deleteInterview
} = require("../controllers/interviewController");

const {
  protect,
  authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

// All interview routes are student-only
router.use(protect);
router.use(authorizeRoles("student"));

// Create interview + Get all interviews
router
  .route("/")
  .post(createInterview)
  .get(getMyInterviews);

// Get one + Update + Delete interview
router
  .route("/:id")
  .get(getInterviewById)
  .put(updateInterview)
  .delete(deleteInterview);

// Update only interview status/result
router.patch(
  "/:id/status",
  updateInterviewStatus
);

module.exports = router;
