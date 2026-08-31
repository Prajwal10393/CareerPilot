const PracticeQuestion = require("../models/PracticeQuestion");
const PracticeResult = require("../models/PracticeResult");


// =========================================================
// GET PRACTICE QUESTIONS
// GET /api/student/practice/questions?category=Java
// =========================================================

const getPracticeQuestions = async (req, res) => {
  try {
    const { category, difficulty } = req.query;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Practice category is required"
      });
    }

    const filter = {
      category
    };

    if (difficulty) {
      filter.difficulty = difficulty;
    }

    const questions = await PracticeQuestion.find(filter)
      .select("-correctAnswer")
      .limit(20);

    return res.status(200).json({
      success: true,
      count: questions.length,
      questions
    });

  } catch (error) {
    console.error("Get practice questions error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


// =========================================================
// SUBMIT PRACTICE TEST
// POST /api/student/practice/submit
// =========================================================

const submitPractice = async (req, res) => {
  try {
    const {
      category,
      difficulty,
      answers
    } = req.body;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Practice category is required"
      });
    }

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Answers are required"
      });
    }

    const questionIds = answers
      .map((answer) => answer.questionId)
      .filter(Boolean);

    const questions = await PracticeQuestion.find({
      _id: {
        $in: questionIds
      }
    });

    if (questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid practice questions found"
      });
    }

    const questionMap = new Map();

    questions.forEach((question) => {
      questionMap.set(
        question._id.toString(),
        question
      );
    });

    let attemptedQuestions = 0;
    let correctAnswers = 0;

    const checkedAnswers = [];

    for (const answer of answers) {
      const question = questionMap.get(
        String(answer.questionId)
      );

      if (!question) {
        continue;
      }

      const selectedAnswer = Number(
        answer.selectedAnswer
      );

      if (
        !Number.isInteger(selectedAnswer) ||
        selectedAnswer < 0 ||
        selectedAnswer > 3
      ) {
        continue;
      }

      attemptedQuestions += 1;

      const isCorrect =
        selectedAnswer === question.correctAnswer;

      if (isCorrect) {
        correctAnswers += 1;
      }

      checkedAnswers.push({
        question: question._id,
        selectedAnswer,
        isCorrect
      });
    }

    if (attemptedQuestions === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid answers were submitted"
      });
    }

    const wrongAnswers =
      attemptedQuestions - correctAnswers;

    const totalQuestions = questions.length;

    const accuracy = Number(
      (
        (correctAnswers / attemptedQuestions) *
        100
      ).toFixed(2)
    );

    const score = Number(
      (
        (correctAnswers / totalQuestions) *
        100
      ).toFixed(2)
    );

    const result = await PracticeResult.create({
      user: req.user._id,
      category,
      totalQuestions,
      attemptedQuestions,
      correctAnswers,
      wrongAnswers,
      score,
      accuracy,
      difficulty: difficulty || "Intermediate",
      answers: checkedAnswers
    });

    return res.status(201).json({
      success: true,
      message: "Practice test submitted successfully",

      result: {
        id: result._id,
        category: result.category,
        totalQuestions: result.totalQuestions,
        attemptedQuestions: result.attemptedQuestions,
        correctAnswers: result.correctAnswers,
        wrongAnswers: result.wrongAnswers,
        score: result.score,
        accuracy: result.accuracy,
        difficulty: result.difficulty
      }
    });

  } catch (error) {
    console.error("Submit practice error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


// =========================================================
// GET MY PRACTICE RESULTS
// GET /api/student/practice/results
// =========================================================

const getMyPracticeResults = async (req, res) => {
  try {
    const results = await PracticeResult.find({
      user: req.user._id
    })
      .sort({
        createdAt: -1
      })
      .limit(20);

    return res.status(200).json({
      success: true,
      count: results.length,
      results
    });

  } catch (error) {
    console.error("Get practice results error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


// =========================================================
// GET PRACTICE DASHBOARD
// GET /api/student/practice/dashboard
// =========================================================

const getPracticeDashboard = async (req, res) => {
  try {
    const results = await PracticeResult.find({
      user: req.user._id
    }).sort({
      createdAt: -1
    });

    let questionsAttempted = 0;
    let correctAnswers = 0;

    results.forEach((result) => {
      questionsAttempted +=
        result.attemptedQuestions || 0;

      correctAnswers +=
        result.correctAnswers || 0;
    });

    const accuracy =
      questionsAttempted > 0
        ? Number(
            (
              (correctAnswers /
                questionsAttempted) *
              100
            ).toFixed(2)
          )
        : 0;


    // =====================================================
    // CATEGORY PERFORMANCE
    // =====================================================

    const categoryMap = {};

    results.forEach((result) => {
      if (!categoryMap[result.category]) {
        categoryMap[result.category] = {
          category: result.category,
          attempted: 0,
          correct: 0
        };
      }

      categoryMap[result.category].attempted +=
        result.attemptedQuestions || 0;

      categoryMap[result.category].correct +=
        result.correctAnswers || 0;
    });

    const categoryPerformance =
      Object.values(categoryMap).map(
        (item) => ({
          ...item,

          accuracy:
            item.attempted > 0
              ? Number(
                  (
                    (item.correct /
                      item.attempted) *
                    100
                  ).toFixed(2)
                )
              : 0
        })
      );


    // =====================================================
    // PRACTICE STREAK
    // Consecutive calendar days ending today.
    // =====================================================

    const practiceDays = new Set(
      results.map((result) => {
        const date = new Date(result.createdAt);

        return [
          date.getFullYear(),
          String(date.getMonth() + 1).padStart(
            2,
            "0"
          ),
          String(date.getDate()).padStart(
            2,
            "0"
          )
        ].join("-");
      })
    );

    let streak = 0;

    const currentDate = new Date();

    while (true) {
      const key = [
        currentDate.getFullYear(),
        String(
          currentDate.getMonth() + 1
        ).padStart(2, "0"),
        String(currentDate.getDate()).padStart(
          2,
          "0"
        )
      ].join("-");

      if (!practiceDays.has(key)) {
        break;
      }

      streak += 1;

      currentDate.setDate(
        currentDate.getDate() - 1
      );
    }


    return res.status(200).json({
      success: true,

      summary: {
        questionsAttempted,
        correctAnswers,
        accuracy,
        practiceStreak: streak,
        testsCompleted: results.length
      },

      categoryPerformance,

      recentResults: results.slice(0, 5)
    });

  } catch (error) {
    console.error(
      "Get practice dashboard error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


module.exports = {
  getPracticeQuestions,
  submitPractice,
  getMyPracticeResults,
  getPracticeDashboard
};
