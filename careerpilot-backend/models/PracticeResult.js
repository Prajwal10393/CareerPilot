const mongoose = require("mongoose");

const practiceResultSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    category: {
      type: String,
      required: true,
      trim: true
    },

    totalQuestions: {
      type: Number,
      required: true,
      min: 0
    },

    attemptedQuestions: {
      type: Number,
      required: true,
      min: 0
    },

    correctAnswers: {
      type: Number,
      required: true,
      min: 0
    },

    wrongAnswers: {
      type: Number,
      required: true,
      min: 0
    },

    score: {
      type: Number,
      required: true,
      min: 0
    },

    accuracy: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },

    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Intermediate"
    },

    answers: [
      {
        question: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "PracticeQuestion"
        },

        selectedAnswer: {
          type: Number,
          min: 0,
          max: 3
        },

        isCorrect: {
          type: Boolean,
          default: false
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

const PracticeResult = mongoose.model(
  "PracticeResult",
  practiceResultSchema
);

module.exports = PracticeResult;
