const mongoose = require("mongoose");

const placementDriveSchema = new mongoose.Schema(
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

    description: {
      type: String,
      trim: true,
      maxlength: 2000
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
        "Contract"
      ],
      default: "Full Time"
    },

    applicationDeadline: {
      type: Date,
      required: true
    },

    driveDate: {
      type: Date
    },

    status: {
      type: String,
      enum: [
        "Upcoming",
        "Open",
        "Closed"
      ],
      default: "Upcoming"
    },

    eligibility: {
      minimumCgpa: {
        type: Number,
        default: 0,
        min: 0,
        max: 10
      },

      maximumBacklogs: {
        type: Number,
        default: 0,
        min: 0
      },

      graduationYears: [
        {
          type: Number
        }
      ],

      courses: [
        {
          type: String
        }
      ],

      requiredSkills: [
        {
          type: String
        }
      ]
    },

    applicationLink: {
      type: String,
      trim: true
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

const PlacementDrive = mongoose.model(
  "PlacementDrive",
  placementDriveSchema
);

module.exports = PlacementDrive;
