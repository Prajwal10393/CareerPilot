const PlacementDrive = require("../models/PlacementDrive");
const StudentProfile = require("../models/StudentProfile");
const Skill = require("../models/Skill");

const checkEligibility = async (req, res) => {
  try {
    const driveId = req.params.driveId;

    const drive = await PlacementDrive.findById(driveId);

    if (!drive) {
      return res.status(404).json({
        success: false,
        message: "Placement drive not found"
      });
    }

    const profile = await StudentProfile.findOne({
      user: req.user._id
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found"
      });
    }

    const skills = await Skill.find({
      user: req.user._id
    });

    const studentSkills = skills.map((skill) =>
      skill.name.toLowerCase()
    );

    const reasons = [];

    const eligibility = drive.eligibility || {};

    const minimumCgpa =
      eligibility.minimumCgpa ?? 0;

    const maximumBacklogs =
      eligibility.maximumBacklogs ?? 0;

    const graduationYears =
      eligibility.graduationYears || [];

    const courses =
      eligibility.courses || [];

    const requiredSkills =
      eligibility.requiredSkills || [];

    const cgpaEligible =
      profile.cgpa !== undefined &&
      profile.cgpa >= minimumCgpa;

    if (!cgpaEligible) {
      reasons.push(
        `Minimum CGPA required is ${minimumCgpa}`
      );
    }

    const backlogEligible =
      profile.backlogs !== undefined &&
      profile.backlogs <= maximumBacklogs;

    if (!backlogEligible) {
      reasons.push(
        `Maximum allowed backlogs is ${maximumBacklogs}`
      );
    }

    const courseEligible =
      courses.length === 0 ||
      courses.some(
        (course) =>
          course.toLowerCase() ===
          profile.course?.toLowerCase()
      );

    if (!courseEligible) {
      reasons.push(
        `Eligible courses: ${courses.join(", ")}`
      );
    }

    const graduationYearEligible =
      graduationYears.length === 0 ||
      graduationYears.includes(
        profile.graduationYear
      );

    if (!graduationYearEligible) {
      reasons.push(
        `Eligible graduation years: ${graduationYears.join(", ")}`
      );
    }

    const missingSkills = requiredSkills.filter(
      (requiredSkill) =>
        !studentSkills.includes(
          requiredSkill.toLowerCase()
        )
    );

    const skillsEligible =
      missingSkills.length === 0;

    if (!skillsEligible) {
      reasons.push(
        `Missing required skills: ${missingSkills.join(", ")}`
      );
    }

    const isEligible =
      cgpaEligible &&
      backlogEligible &&
      courseEligible &&
      graduationYearEligible &&
      skillsEligible;

    res.status(200).json({
      success: true,

      eligible: isEligible,

      drive: {
        id: drive._id,
        company: drive.company,
        role: drive.role
      },

      checks: {
        cgpa: {
          student: profile.cgpa,
          required: minimumCgpa,
          eligible: cgpaEligible
        },

        backlogs: {
          student: profile.backlogs,
          maximumAllowed: maximumBacklogs,
          eligible: backlogEligible
        },

        course: {
          student: profile.course,
          allowed: courses,
          eligible: courseEligible
        },

        graduationYear: {
          student: profile.graduationYear,
          allowed: graduationYears,
          eligible: graduationYearEligible
        },

        skills: {
          studentSkills,
          requiredSkills,
          missingSkills,
          eligible: skillsEligible
        }
      },

      reasons
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
  checkEligibility
};