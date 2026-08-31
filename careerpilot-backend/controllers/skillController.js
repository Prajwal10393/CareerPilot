const Skill = require("../models/Skill");

// Add skill
const addSkill = async (req, res) => {
  try {
    const {
      name,
      category,
      level,
      score,
      description
    } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: "Skill name and category are required"
      });
    }

    const existingSkill = await Skill.findOne({
      user: req.user._id,
      name
    });

    if (existingSkill) {
      return res.status(400).json({
        success: false,
        message: "Skill already exists"
      });
    }

    const skill = await Skill.create({
      user: req.user._id,
      name,
      category,
      level,
      score,
      description
    });

    res.status(201).json({
      success: true,
      message: "Skill added successfully",
      skill
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Get logged-in student's skills
const getMySkills = async (req, res) => {
  try {
    const skills = await Skill.find({
      user: req.user._id
    }).sort({
      createdAt: -1
    });

    res.status(200).json({
      success: true,
      count: skills.length,
      skills
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Update skill
const updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found"
      });
    }

    const {
      name,
      category,
      level,
      score,
      description
    } = req.body;

    skill.name = name ?? skill.name;
    skill.category = category ?? skill.category;
    skill.level = level ?? skill.level;
    skill.score = score ?? skill.score;
    skill.description =
      description ?? skill.description;

    await skill.save();

    res.status(200).json({
      success: true,
      message: "Skill updated successfully",
      skill
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Delete skill
const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found"
      });
    }

    await skill.deleteOne();

    res.status(200).json({
      success: true,
      message: "Skill deleted successfully"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

module.exports = {
  addSkill,
  getMySkills,
  updateSkill,
  deleteSkill
};
