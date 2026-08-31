const Application = require("../models/Application");
const Interview = require("../models/Interview");
const Offer = require("../models/Offer");
const Skill = require("../models/Skill");
const PlacementResult = require("../models/PlacementResult");

const getStudentAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalApplications = await Application.countDocuments({
      user: userId
    });

    const totalInterviews = await Interview.countDocuments({
      user: userId
    });

    const totalOffers = await Offer.countDocuments({
      user: userId
    });

    const totalSkills = await Skill.countDocuments({
      user: userId
    });

    const selectedResults = await PlacementResult.countDocuments({
      student: userId,
      resultStatus: "Selected"
    });

    const rejectedResults = await PlacementResult.countDocuments({
      student: userId,
      resultStatus: "Rejected"
    });

    const shortlistedResults = await PlacementResult.countDocuments({
      student: userId,
      resultStatus: "Shortlisted"
    });

    const applications = await Application.find({
      user: userId
    });

    const applicationStatus = {
      applied: 0,
      shortlisted: 0,
      interview: 0,
      selected: 0,
      rejected: 0
    };

    applications.forEach((application) => {
      const status = application.status?.toLowerCase();

      if (status === "applied") {
        applicationStatus.applied++;
      } else if (status === "shortlisted") {
        applicationStatus.shortlisted++;
      } else if (status === "interview") {
        applicationStatus.interview++;
      } else if (status === "selected") {
        applicationStatus.selected++;
      } else if (status === "rejected") {
        applicationStatus.rejected++;
      }
    });

    const interviewRate =
      totalApplications > 0
        ? Math.round(
            (totalInterviews / totalApplications) * 100
          )
        : 0;

    const offerRate =
      totalApplications > 0
        ? Math.round(
            (totalOffers / totalApplications) * 100
          )
        : 0;

    res.status(200).json({
      success: true,

      summary: {
        totalApplications,
        totalInterviews,
        totalOffers,
        totalSkills
      },

      applicationStatus,

      placementResults: {
        selected: selectedResults,
        rejected: rejectedResults,
        shortlisted: shortlistedResults
      },

      performance: {
        interviewRate,
        offerRate
      }
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
  getStudentAnalytics
};
