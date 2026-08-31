const express = require("express");

const {
  getAllStudents,
  getStudentById,
  deleteStudent
} = require("../controllers/adminStudentController");

const {
  protect,
  authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.use(authorizeRoles("admin"));

router.get("/", getAllStudents);

router.get("/:id", getStudentById);

router.delete("/:id", deleteStudent);

module.exports = router;
