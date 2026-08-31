const Interview = require("../models/Interview");

// Create interview
const createInterview = async (req, res) => {
  try {
    const {
      application,
      company,
      role,
      interviewType,
      round,
      interviewDate,
      mode,
      location,
      meetingLink,
      status,
      result,
      notes
    } = req.body;

    if (!company || !role || !interviewDate) {
      return res.status(400).json({
        success: false,
        message:
          "Company, role and interview date are required"
      });
    }

    const interview = await Interview.create({
      user: req.user._id,
      application,
      company,
      role,
      interviewType,
      round,
      interviewDate,
      mode,
      location,
      meetingLink,
      status,
      result,
      notes
    });

    res.status(201).json({
      success: true,
      message: "Interview created successfully",
      interview
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Get all interviews for logged-in student
const getMyInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({
      user: req.user._id
    })
      .populate(
        "application",
        "company role status"
      )
      .sort({
        interviewDate: 1
      });

    res.status(200).json({
      success: true,
      count: interviews.length,
      interviews
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Get one interview
const getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate(
      "application",
      "company role status"
    );

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found"
      });
    }

    res.status(200).json({
      success: true,
      interview
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Update interview
const updateInterview = async (req, res) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found"
      });
    }

    const allowedFields = [
      "application",
      "company",
      "role",
      "interviewType",
      "round",
      "interviewDate",
      "mode",
      "location",
      "meetingLink",
      "status",
      "result",
      "notes"
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        interview[field] = req.body[field];
      }
    });

    await interview.save();

    res.status(200).json({
      success: true,
      message: "Interview updated successfully",
      interview
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Update interview status
const updateInterviewStatus = async (req, res) => {
  try {
    const { status, result } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required"
      });
    }

    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found"
      });
    }

    interview.status = status;

    if (result !== undefined) {
      interview.result = result;
    }

    await interview.save();

    res.status(200).json({
      success: true,
      message: "Interview status updated successfully",
      interview
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Delete interview
const deleteInterview = async (req, res) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found"
      });
    }

    await interview.deleteOne();

    res.status(200).json({
      success: true,
      message: "Interview deleted successfully"
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
  createInterview,
  getMyInterviews,
  getInterviewById,
  updateInterview,
  updateInterviewStatus,
  deleteInterview
};
