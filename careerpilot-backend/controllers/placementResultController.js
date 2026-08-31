const PlacementResult = require("../models/PlacementResult");

// Create placement result - Admin only
const createPlacementResult = async (req, res) => {
  try {
    const {
      student,
      application,
      drive,
      company,
      role,
      package: packageValue,
      resultStatus,
      joiningDate,
      location,
      remarks
    } = req.body;

    if (!student || !company || !role || !resultStatus) {
      return res.status(400).json({
        success: false,
        message:
          "Student, company, role and result status are required"
      });
    }

    const result = await PlacementResult.create({
      student,
      application,
      drive,
      company,
      role,
      package: packageValue,
      resultStatus,
      joiningDate,
      location,
      remarks,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: "Placement result created successfully",
      result
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Get all placement results - Admin
const getAllPlacementResults = async (req, res) => {
  try {
    const results = await PlacementResult.find()
      .populate("student", "name email role")
      .populate("application", "company role status")
      .populate("drive", "company role status")
      .populate("createdBy", "name email role")
      .sort({
        createdAt: -1
      });

    res.status(200).json({
      success: true,
      count: results.length,
      results
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Get logged-in student's results
const getMyPlacementResults = async (req, res) => {
  try {
    const results = await PlacementResult.find({
      student: req.user._id
    })
      .populate("application", "company role status")
      .populate("drive", "company role status")
      .sort({
        createdAt: -1
      });

    res.status(200).json({
      success: true,
      count: results.length,
      results
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Get one placement result
const getPlacementResultById = async (req, res) => {
  try {
    const result = await PlacementResult.findById(
      req.params.id
    )
      .populate("student", "name email role")
      .populate("application", "company role status")
      .populate("drive", "company role status")
      .populate("createdBy", "name email role");

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Placement result not found"
      });
    }

    if (
      req.user.role === "student" &&
      result.student._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied."
      });
    }

    res.status(200).json({
      success: true,
      result
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Update placement result - Admin only
const updatePlacementResult = async (req, res) => {
  try {
    const result = await PlacementResult.findById(
      req.params.id
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Placement result not found"
      });
    }

    const allowedFields = [
      "student",
      "application",
      "drive",
      "company",
      "role",
      "package",
      "resultStatus",
      "joiningDate",
      "location",
      "remarks"
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        result[field] = req.body[field];
      }
    });

    await result.save();

    res.status(200).json({
      success: true,
      message: "Placement result updated successfully",
      result
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Delete placement result - Admin only
const deletePlacementResult = async (req, res) => {
  try {
    const result = await PlacementResult.findById(
      req.params.id
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Placement result not found"
      });
    }

    await result.deleteOne();

    res.status(200).json({
      success: true,
      message: "Placement result deleted successfully"
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
  createPlacementResult,
  getAllPlacementResults,
  getMyPlacementResults,
  getPlacementResultById,
  updatePlacementResult,
  deletePlacementResult
};
