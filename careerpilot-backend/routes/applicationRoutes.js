const express = require("express");

const {
  addApplication,
  getMyApplications,
  getApplicationById,
  updateApplication,
  updateApplicationStatus,
  deleteApplication
} = require("../controllers/applicationController");

const {
  protect,
  authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.use(authorizeRoles("student"));

router
  .route("/")
  .post(addApplication)
  .get(getMyApplications);

router
  .route("/:id")
  .get(getApplicationById)
  .put(updateApplication)
  .delete(deleteApplication);

router.patch("/:id/status", updateApplicationStatus);

module.exports = router;