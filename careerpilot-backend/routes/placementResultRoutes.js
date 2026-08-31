const express = require("express");

const {
  createPlacementResult,
  getAllPlacementResults,
  getMyPlacementResults,
  getPlacementResultById,
  updatePlacementResult,
  deletePlacementResult,
} = require("../controllers/placementResultController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

/* ---------- STUDENT ROUTES ---------- */

// Logged-in student can view only their own results.
router.get(
  "/my-results",
  protect,
  authorizeRoles("student"),
  getMyPlacementResults
);

// Student/Admin can view one result.
router.get(
  "/:id",
  protect,
  getPlacementResultById
);

/* ---------- ADMIN ROUTES ---------- */

// Admin CRUD
router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getAllPlacementResults
);

router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createPlacementResult
);

router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  updatePlacementResult
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deletePlacementResult
);

module.exports = router;
