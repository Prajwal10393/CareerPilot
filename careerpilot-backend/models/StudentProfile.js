const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    phone: {
      type: String,
      trim: true
    },

    course: {
      type: String,
      default: "MCA",
      trim: true
    },

    college: {
      type: String,
      trim: true
    },

    graduationYear: {
      type: Number
    },

    cgpa: {
      type: Number,
      min: 0,
      max: 10
    },

    backlogs: {
      type: Number,
      default: 0,
      min: 0
    },

    city: {
      type: String,
      trim: true
    },

    targetRole: {
      type: String,
      trim: true
    },

    bio: {
      type: String,
      trim: true,
      maxlength: 500
    },

    github: {
      type: String,
      trim: true
    },

    linkedin: {
      type: String,
      trim: true
    },

    portfolio: {
      type: String,
      trim: true
    },

    profileCompletion: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },
  {
    timestamps: true
  }
);

const StudentProfile = mongoose.model(
  "StudentProfile",
  studentProfileSchema
);

module.exports = StudentProfile;
