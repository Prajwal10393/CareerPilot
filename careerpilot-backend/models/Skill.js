const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      enum: [
        "Programming",
        "Frontend",
        "Backend",
        "Database",
        "Cloud",
        "DevOps",
        "Tools",
        "Soft Skills",
        "Other"
      ],
      required: true
    },

    level: {
      type: String,
      enum: [
        "Beginner",
        "Intermediate",
        "Advanced"
      ],
      default: "Beginner"
    },

    score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500
    }
  },
  {
    timestamps: true
  }
);

skillSchema.index(
  {
    user: 1,
    name: 1
  },
  {
    unique: true
  }
);

const Skill = mongoose.model("Skill", skillSchema);

module.exports = Skill;