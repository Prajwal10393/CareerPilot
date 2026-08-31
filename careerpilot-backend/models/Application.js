const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

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

    package: {
      type: String,
      trim: true
    },

    location: {
      type: String,
      trim: true
    },

    jobType: {
      type: String,
      enum: [
        "Full Time",
        "Internship",
        "Contract",
        "Part Time"
      ],
      default: "Full Time"
    },

    appliedDate: {
      type: Date,
      default: Date.now
    },

    deadline: {
      type: Date
    },

    status: {
      type: String,
      enum: [
        "Applied",
        "Shortlisted",
        "Online Test",
        "Interview",
        "Offer",
        "Rejected",
        "Withdrawn"
      ],
      default: "Applied"
    },

    source: {
      type: String,
      enum: [
        "LinkedIn",
        "Company Website",
        "Campus",
        "Referral",
        "Job Portal",
        "Other"
      ],
      default: "Other"
    },

    jobLink: {
      type: String,
      trim: true
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 1000
    }
  },
  {
    timestamps: true
  }
);

const Application = mongoose.model(
  "Application",
  applicationSchema
);

module.exports = Application;
