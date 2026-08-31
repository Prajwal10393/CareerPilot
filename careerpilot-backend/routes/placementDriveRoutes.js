const express = require("express");

const {
  createPlacementDrive,
  getAllPlacementDrives,
  getPlacementDriveById,
  updatePlacementDrive,
  closePlacementDrive,
  deletePlacementDrive
} = require("../controllers/placementDriveController");

const {
  protect,
  authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

// Student + Admin can view drives
router.get(
  "/",
  protect,
  getAllPlacementDrives
);

router.get(
  "/:id",
  protect,
  getPlacementDriveById
);

// Admin-only routes
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createPlacementDrive
);

router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  updatePlacementDrive
);

router.patch(
  "/:id/close",
  protect,
  authorizeRoles("admin"),
  closePlacementDrive
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deletePlacementDrive
);

module.exports = router;
