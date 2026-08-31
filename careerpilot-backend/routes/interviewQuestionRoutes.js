const express = require("express");

const {
  generateInterviewQuestions,
  getInterviewQuestionOptions
} = require("../controllers/interviewQuestionController");

const {
  protect,
  authorizeRoles
} = require("../middleware/authMiddleware");


const router = express.Router();


// All routes are only for logged-in students
router.use(
  protect,
  authorizeRoles("student")
);


// Get available companies, roles, types and difficulties
router.get(
  "/options",
  getInterviewQuestionOptions
);


// Generate interview questions
router.post(
  "/generate",
  generateInterviewQuestions
);


module.exports = router;
