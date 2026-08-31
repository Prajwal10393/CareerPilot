const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    fileName: {
      type: String,
      required: true
    },

    filePath: {
      type: String,
      required: true
    },

    extractedText: {
      type: String,
      default: ""
    },

    // General CareerPilot ATS score
    atsScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 10
    },

    // General skill analysis
    matchedSkills: [
      {
        type: String
      }
    ],

    missingSkills: [
      {
        type: String
      }
    ],

    suggestions: [
      {
        type: String
      }
    ],

    // =====================================================
    // COMPANY-SPECIFIC ANALYSIS
    // =====================================================

    targetCompany: {
      type: String,
      trim: true,
      default: ""
    },

    targetRole: {
      type: String,
      trim: true,
      default: ""
    },

    companyMatchScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 10
    },

    companyMatchedSkills: [
      {
        type: String
      }
    ],

    companyMissingSkills: [
      {
        type: String
      }
    ],

    companySuggestions: [
      {
        type: String
      }
    ]
  },
  {
    timestamps: true
  }
);

const Resume = mongoose.model(
  "Resume",
  resumeSchema
);

module.exports = Resume;
