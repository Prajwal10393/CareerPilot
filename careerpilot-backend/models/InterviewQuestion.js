const mongoose = require("mongoose");

const interviewQuestionSchema =
  new mongoose.Schema(
    {
      company: {
        type: String,
        required: true,
        trim: true
      },

      role: {
        type: String,
        required: true,
        trim: true
      },

      interviewType: {
        type: String,
        enum: [
          "Technical",
          "Coding",
          "HR",
          "Managerial"
        ],
        required: true
      },

      difficulty: {
        type: String,
        enum: [
          "Easy",
          "Medium",
          "Hard"
        ],
        default: "Medium"
      },

      question: {
        type: String,
        required: true,
        trim: true
      },

      suggestedAnswer: {
        type: String,
        required: true,
        trim: true
      },

      skills: {
        type: [String],
        default: []
      },

      active: {
        type: Boolean,
        default: true
      }
    },
    {
      timestamps: true
    }
  );


const InterviewQuestion =
  mongoose.model(
    "InterviewQuestion",
    interviewQuestionSchema
  );


module.exports =
  InterviewQuestion;
  