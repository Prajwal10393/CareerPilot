const PlacementDrive = require("../models/PlacementDrive");

// Create placement drive - Admin only
const createPlacementDrive = async (req, res) => {
  try {
    const {
      company,
      role,
      description,
      package: packageValue,
      location,
      jobType,
      applicationDeadline,
      driveDate,
      status,
      eligibility,
      applicationLink
    } = req.body;

    if (!company || !role || !applicationDeadline) {
      return res.status(400).json({
        success: false,
        message:
          "Company, role and application deadline are required"
      });
    }

    const drive = await PlacementDrive.create({
      company,
      role,
      description,
      package: packageValue,
      location,
      jobType,
      applicationDeadline,
      driveDate,
      status,
      eligibility,
      applicationLink,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: "Placement drive created successfully",
      drive
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Get all placement drives
const getAllPlacementDrives = async (req, res) => {
  try {
    const drives = await PlacementDrive.find()
      .populate("createdBy", "name email role")
      .sort({
        createdAt: -1
      });

    res.status(200).json({
      success: true,
      count: drives.length,
      drives
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Get one placement drive
const getPlacementDriveById = async (req, res) => {
  try {
    const drive = await PlacementDrive.findById(
      req.params.id
    ).populate(
      "createdBy",
      "name email role"
    );

    if (!drive) {
      return res.status(404).json({
        success: false,
        message: "Placement drive not found"
      });
    }

    res.status(200).json({
      success: true,
      drive
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Update placement drive - Admin only
const updatePlacementDrive = async (req, res) => {
  try {
    const drive = await PlacementDrive.findById(
      req.params.id
    );

    if (!drive) {
      return res.status(404).json({
        success: false,
        message: "Placement drive not found"
      });
    }

    const allowedFields = [
      "company",
      "role",
      "description",
      "package",
      "location",
      "jobType",
      "applicationDeadline",
      "driveDate",
      "status",
      "eligibility",
      "applicationLink"
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        drive[field] = req.body[field];
      }
    });

    await drive.save();

    res.status(200).json({
      success: true,
      message: "Placement drive updated successfully",
      drive
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Close placement drive - Admin only
const closePlacementDrive = async (req, res) => {
  try {
    const drive = await PlacementDrive.findById(
      req.params.id
    );

    if (!drive) {
      return res.status(404).json({
        success: false,
        message: "Placement drive not found"
      });
    }

    drive.status = "Closed";

    await drive.save();

    res.status(200).json({
      success: true,
      message: "Placement drive closed successfully",
      drive
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Delete placement drive - Admin only
const deletePlacementDrive = async (req, res) => {
  try {
    const drive = await PlacementDrive.findById(
      req.params.id
    );

    if (!drive) {
      return res.status(404).json({
        success: false,
        message: "Placement drive not found"
      });
    }

    await drive.deleteOne();

    res.status(200).json({
      success: true,
      message: "Placement drive deleted successfully"
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
  createPlacementDrive,
  getAllPlacementDrives,
  getPlacementDriveById,
  updatePlacementDrive,
  closePlacementDrive,
  deletePlacementDrive
};
