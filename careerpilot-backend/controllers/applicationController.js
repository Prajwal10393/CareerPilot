const Application = require("../models/Application");

// Add new application
const addApplication = async (req, res) => {
  try {
    const {
      company,
      role,
      package: packageValue,
      location,
      jobType,
      appliedDate,
      deadline,
      status,
      source,
      jobLink,
      notes
    } = req.body;

    if (!company || !role) {
      return res.status(400).json({
        success: false,
        message: "Company and role are required"
      });
    }

    const application = await Application.create({
      user: req.user._id,
      company,
      role,
      package: packageValue,
      location,
      jobType,
      appliedDate,
      deadline,
      status,
      source,
      jobLink,
      notes
    });

    res.status(201).json({
      success: true,
      message: "Application added successfully",
      application
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Get all applications of logged-in student
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      user: req.user._id
    }).sort({
      createdAt: -1
    });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Get one application
const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    res.status(200).json({
      success: true,
      application
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Update application
const updateApplication = async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    const allowedFields = [
      "company",
      "role",
      "package",
      "location",
      "jobType",
      "appliedDate",
      "deadline",
      "status",
      "source",
      "jobLink",
      "notes"
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        application[field] = req.body[field];
      }
    });

    await application.save();

    res.status(200).json({
      success: true,
      message: "Application updated successfully",
      application
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Update only application status
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required"
      });
    }

    const application = await Application.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    application.status = status;

    await application.save();

    res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      application
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Delete application
const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    await application.deleteOne();

    res.status(200).json({
      success: true,
      message: "Application deleted successfully"
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
  addApplication,
  getMyApplications,
  getApplicationById,
  updateApplication,
  updateApplicationStatus,
  deleteApplication
};