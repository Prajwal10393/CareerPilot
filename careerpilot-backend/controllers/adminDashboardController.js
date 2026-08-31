const User = require("../models/User");
const Application = require("../models/Application");
const PlacementDrive = require("../models/PlacementDrive");
const Offer = require("../models/Offer");
const PlacementResult = require("../models/PlacementResult");

const getAdminDashboardStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({
      role: "student"
    });

    const totalAdmins = await User.countDocuments({
      role: "admin"
    });

    const totalApplications =
      await Application.countDocuments();

    const totalDrives =
      await PlacementDrive.countDocuments();

    const openDrives =
      await PlacementDrive.countDocuments({
        status: "Open"
      });

    const totalOffers =
      await Offer.countDocuments();

    const selectedStudents =
      await PlacementResult.countDocuments({
        resultStatus: "Selected"
      });

    const rejectedStudents =
      await PlacementResult.countDocuments({
        resultStatus: "Rejected"
      });

    const shortlistedStudents =
      await PlacementResult.countDocuments({
        resultStatus: "Shortlisted"
      });

    res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalAdmins,
        totalApplications,
        totalDrives,
        openDrives,
        totalOffers,
        selectedStudents,
        rejectedStudents,
        shortlistedStudents
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
  getAdminDashboardStats
};
