const User = require("../models/User");
const Application = require("../models/Application");
const PlacementDrive = require("../models/PlacementDrive");
const Company = require("../models/Company");
const Offer = require("../models/Offer");
const PlacementResult = require("../models/PlacementResult");

const getAdminAnalytics = async (req, res) => {
  try {
    // BASIC COUNTS
    const totalStudents = await User.countDocuments({
      role: "student"
    });

    const totalApplications =
      await Application.countDocuments();

    const totalCompanies =
      await Company.countDocuments();

    const totalDrives =
      await PlacementDrive.countDocuments();

    const totalOffers =
      await Offer.countDocuments();

    // RESULT COUNTS
    const selected =
      await PlacementResult.countDocuments({
        resultStatus: "Selected"
      });

    const shortlisted =
      await PlacementResult.countDocuments({
        resultStatus: "Shortlisted"
      });

    const waiting =
      await PlacementResult.countDocuments({
        resultStatus: "Waiting"
      });

    const rejected =
      await PlacementResult.countDocuments({
        resultStatus: "Rejected"
      });

    // DRIVE STATUS
    const openDrives =
      await PlacementDrive.countDocuments({
        status: "Open"
      });

    const upcomingDrives =
      await PlacementDrive.countDocuments({
        status: "Upcoming"
      });

    const closedDrives =
      await PlacementDrive.countDocuments({
        status: "Closed"
      });

    // COMPANY STATUS
    const activeCompanies =
      await Company.countDocuments({
        status: "Active"
      });

    const inactiveCompanies =
      await Company.countDocuments({
        status: "Inactive"
      });

    // PLACEMENT RATE
    const placementRate =
      totalStudents > 0
        ? Math.round(
            (selected / totalStudents) * 100
          )
        : 0;

    // APPLICATION STATUS
    const applications =
      await Application.find();

    const applicationStatus = {
      applied: 0,
      shortlisted: 0,
      interview: 0,
      selected: 0,
      rejected: 0
    };

    applications.forEach((application) => {
      const status =
        application.status?.toLowerCase();

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

    res.status(200).json({
      success: true,

      summary: {
        totalStudents,
        totalApplications,
        totalCompanies,
        totalDrives,
        totalOffers
      },

      placementResults: {
        selected,
        shortlisted,
        waiting,
        rejected
      },

      driveStatus: {
        open: openDrives,
        upcoming: upcomingDrives,
        closed: closedDrives
      },

      companyStatus: {
        active: activeCompanies,
        inactive: inactiveCompanies
      },

      applicationStatus,

      performance: {
        placementRate
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
  getAdminAnalytics
};
