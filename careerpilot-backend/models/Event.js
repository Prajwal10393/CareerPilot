const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    eventType: {
      type: String,
      enum: [
        "Interview",
        "Test",
        "Deadline",
        "Drive",
        "Offer",
        "Joining",
        "Reminder",
        "Other"
      ],
      default: "Other"
    },

    company: {
      type: String,
      trim: true
    },

    relatedApplication: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application"
    },

    relatedDrive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlacementDrive"
    },

    relatedInterview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview"
    },

    startDate: {
      type: Date,
      required: true
    },

    endDate: {
      type: Date
    },

    mode: {
      type: String,
      enum: [
        "Online",
        "Offline",
        "Hybrid"
      ]
    },

    location: {
      type: String,
      trim: true
    },

    meetingLink: {
      type: String,
      trim: true
    },

    reminder: {
      type: String,
      enum: [
        "None",
        "10 Minutes",
        "30 Minutes",
        "1 Hour",
        "1 Day",
        "2 Days",
        "1 Week"
      ],
      default: "1 Day"
    },

    priority: {
      type: String,
      enum: [
        "Low",
        "Medium",
        "High"
      ],
      default: "Medium"
    },

    status: {
      type: String,
      enum: [
        "Upcoming",
        "Completed",
        "Cancelled"
      ],
      default: "Upcoming"
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

const Event = mongoose.model(
  "Event",
  eventSchema
);

module.exports = Event;