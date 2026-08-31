const express = require("express");

const {
  getPracticeQuestions,
  submitPractice,
  getMyPracticeResults,
  getPracticeDashboard
} = require("../controllers/practiceController");

const {
  protect,
  authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();


// =========================================================
// ALL PRACTICE ROUTES ARE STUDENT-ONLY
// =========================================================

router.use(
  protect,
  authorizeRoles("student")
);


// GET PRACTICE QUESTIONS
// GET /api/student/practice/questions?category=Java
router.get(
  "/questions",
  getPracticeQuestions
);


// SUBMIT PRACTICE TEST
// POST /api/student/practice/submit
router.post(
  "/submit",
  submitPractice
);


// GET STUDENT PRACTICE RESULTS
// GET /api/student/practice/results
router.get(
  "/results",
  getMyPracticeResults
);


// GET PRACTICE DASHBOARD
// GET /api/student/practice/dashboard
router.get(
  "/dashboard",
  getPracticeDashboard
);


module.exports = router;
