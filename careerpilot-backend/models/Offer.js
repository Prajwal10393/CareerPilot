const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      default: null
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

    ctc: {
      type: String,
      required: true,
      trim: true
    },

    baseSalary: {
      type: String,
      trim: true,
      default: ""
    },

    location: {
      type: String,
      trim: true,
      default: ""
    },

    workMode: {
      type: String,
      enum: [
        "Onsite",
        "On-site",
        "Hybrid",
        "Remote"
      ],
      default: "Onsite"
    },

    offerDate: {
      type: Date,
      default: Date.now
    },

    joiningDate: {
      type: Date,
      default: null
    },

    decisionDeadline: {
      type: Date,
      default: null
    },

    status: {
      type: String,
      enum: [
        "Received",
        "Pending",
        "Accepted",
        "Rejected"
      ],
      default: "Received"
    },

    bond: {
      type: String,
      trim: true,
      default: ""
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

const Offer = mongoose.model(
  "Offer",
  offerSchema
);

module.exports = Offer;
