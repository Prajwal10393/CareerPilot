const StudentProfile = require("../models/StudentProfile");

// Calculate profile completion percentage
const calculateProfileCompletion = (profile) => {
  const fields = [
    profile.phone,
    profile.course,
    profile.college,
    profile.graduationYear,
    profile.cgpa,
    profile.city,
    profile.targetRole,
    profile.github,
    profile.linkedin,
    profile.portfolio
  ];

  const completedFields = fields.filter((field) => {
    return (
      field !== undefined &&
      field !== null &&
      field !== ""
    );
  }).length;

  return completedFields * 10;
};


// Create or update student profile
const createOrUpdateProfile = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can create or update a profile"
      });
    }

    const {
      phone,
      course,
      college,
      graduationYear,
      cgpa,
      backlogs,
      city,
      targetRole,
      bio,
      github,
      linkedin,
      portfolio
    } = req.body;

    let profile = await StudentProfile.findOne({
      user: req.user._id
    });

    if (profile) {
      profile.phone = phone ?? profile.phone;
      profile.course = course ?? profile.course;
      profile.college = college ?? profile.college;
      profile.graduationYear =
        graduationYear ?? profile.graduationYear;
      profile.cgpa = cgpa ?? profile.cgpa;
      profile.backlogs =
        backlogs ?? profile.backlogs;
      profile.city = city ?? profile.city;
      profile.targetRole =
        targetRole ?? profile.targetRole;
      profile.bio = bio ?? profile.bio;
      profile.github = github ?? profile.github;
      profile.linkedin =
        linkedin ?? profile.linkedin;
      profile.portfolio =
        portfolio ?? profile.portfolio;

      // Calculate completion before saving
      profile.profileCompletion =
        calculateProfileCompletion(profile);

      await profile.save();

      return res.status(200).json({
        success: true,
        message: "Student profile updated successfully",
        profile
      });
    }

    profile = new StudentProfile({
      user: req.user._id,
      phone,
      course,
      college,
      graduationYear,
      cgpa,
      backlogs,
      city,
      targetRole,
      bio,
      github,
      linkedin,
      portfolio
    });

    // Calculate completion for new profile
    profile.profileCompletion =
      calculateProfileCompletion(profile);

    await profile.save();

    return res.status(201).json({
      success: true,
      message: "Student profile created successfully",
      profile
    });

  } catch (error) {
    console.error("Profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


// Get logged-in student's profile
const getMyProfile = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({
      user: req.user._id
    }).populate(
      "user",
      "name email role"
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found"
      });
    }

    return res.status(200).json({
      success: true,
      profile
    });

  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


module.exports = {
  createOrUpdateProfile,
  getMyProfile
};
