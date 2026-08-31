const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");
const Skill = require("../models/Skill");
const Application = require("../models/Application");
const Interview = require("../models/Interview");
const Offer = require("../models/Offer");
const PlacementResult = require("../models/PlacementResult");

// Get all students
const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({
      role: "student"
    })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: students.length,
      students
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Get one student with complete details
const getStudentById = async (req, res) => {
  try {
    const student = await User.findOne({
      _id: req.params.id,
      role: "student"
    }).select("-password");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    const profile = await StudentProfile.findOne({
      user: student._id
    });

    const skills = await Skill.find({
      user: student._id
    });

    const applications = await Application.find({
      user: student._id
    });

    const interviews = await Interview.find({
      user: student._id
    });

    const offers = await Offer.find({
      user: student._id
    });

    const results = await PlacementResult.find({
      student: student._id
    });

    res.status(200).json({
      success: true,
      student,
      profile,
      skills,
      applications,
      interviews,
      offers,
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

// Delete student and related data
const deleteStudent = async (req, res) => {
  try {
    const student = await User.findOne({
      _id: req.params.id,
      role: "student"
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    await Promise.all([
      StudentProfile.deleteMany({
        user: student._id
      }),

      Skill.deleteMany({
        user: student._id
      }),

      Application.deleteMany({
        user: student._id
      }),

      Interview.deleteMany({
        user: student._id
      }),

      Offer.deleteMany({
        user: student._id
      }),

      PlacementResult.deleteMany({
        student: student._id
      })
    ]);

    await student.deleteOne();

    res.status(200).json({
      success: true,
      message: "Student deleted successfully"
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
  getAllStudents,
  getStudentById,
  deleteStudent
};
