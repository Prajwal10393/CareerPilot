const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
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

    message: {
      type: String,
      required: true,
      trim: true
    },

    type: {
      type: String,
      enum: [
        "Application",
        "Interview",
        "Drive",
        "Offer",
        "Result",
        "Deadline",
        "Resume",
        "System",
        "Other"
      ],
      default: "System"
    },

    relatedId: {
      type: mongoose.Schema.Types.ObjectId
    },

    relatedModel: {
      type: String,
      enum: [
        "Application",
        "Interview",
        "PlacementDrive",
        "Offer",
        "PlacementResult",
        "Event",
        "Other"
      ]
    },

    isRead: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Notification = mongoose.model(
  "Notification",
  notificationSchema
);

module.exports = Notification;
