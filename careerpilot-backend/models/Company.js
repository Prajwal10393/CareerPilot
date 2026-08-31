const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    industry: {
      type: String,
      trim: true
    },

    location: {
      type: String,
      trim: true
    },

    website: {
      type: String,
      trim: true
    },

    contactEmail: {
      type: String,
      trim: true,
      lowercase: true
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1500
    },

    status: {
      type: String,
      enum: [
        "Active",
        "Inactive"
      ],
      default: "Active"
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

const Company = mongoose.model(
  "Company",
  companySchema
);

module.exports = Company;
