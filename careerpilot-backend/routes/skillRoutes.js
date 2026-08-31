const express = require("express");

const {
  addSkill,
  getMySkills,
  updateSkill,
  deleteSkill
} = require("../controllers/skillController");

const {
  protect,
  authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.use(authorizeRoles("student"));

router
  .route("/")
  .post(addSkill)
  .get(getMySkills);

router
  .route("/:id")
  .put(updateSkill)
  .delete(deleteSkill);

module.exports = router;
