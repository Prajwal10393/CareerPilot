const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application"
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

    interviewType: {
      type: String,
      enum: [
        "Aptitude",
        "HR",
        "Technical",
        "Coding",
        "Managerial",
        "Group Discussion",
        "Other"
      ],
      default: "Technical"
    },

    round: {
      type: String,
      trim: true
    },

    interviewDate: {
      type: Date,
      required: true
    },

    mode: {
      type: String,
      enum: [
        "Online",
        "Offline",
        "Hybrid"
      ],
      default: "Online"
    },

    location: {
      type: String,
      trim: true
    },

    meetingLink: {
      type: String,
      trim: true
    },

    status: {
      type: String,
      enum: [
        "Scheduled",
        "Completed",
        "Cancelled",
        "Selected",
        "Rejected"
      ],
      default: "Scheduled"
    },

    result: {
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

const Interview = mongoose.model(
  "Interview",
  interviewSchema
);

module.exports = Interview;
