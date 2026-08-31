const mongoose = require("mongoose");

const placementResultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application"
    },

    drive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlacementDrive"
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

    resultStatus: {
      type: String,
      enum: [
        "Selected",
        "Rejected",
        "Waiting",
        "Shortlisted"
      ],
      required: true
    },

    joiningDate: {
      type: Date
    },

    location: {
      type: String,
      trim: true
    },

    remarks: {
      type: String,
      trim: true,
      maxlength: 1000
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

const PlacementResult = mongoose.model(
  "PlacementResult",
  placementResultSchema
);

module.exports = PlacementResult;
