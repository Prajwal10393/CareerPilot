const mongoose = require("mongoose");

const practiceQuestionSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true
    },

    question: {
      type: String,
      required: true,
      trim: true
    },

    options: {
      type: [String],
      required: true,
      validate: {
        validator: function (value) {
          return value.length === 4;
        },
        message: "A question must have exactly 4 options"
      }
    },

    correctAnswer: {
      type: Number,
      required: true,
      min: 0,
      max: 3
    },

    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Intermediate"
    },

    explanation: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const PracticeQuestion = mongoose.model(
  "PracticeQuestion",
  practiceQuestionSchema
);

module.exports = PracticeQuestion;
