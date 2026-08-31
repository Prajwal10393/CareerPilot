const express = require("express");

const {
  createNotification,
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification
} = require("../controllers/notificationController");

const {
  protect,
  authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

// Admin creates notifications
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createNotification
);

// Logged-in user views notifications
router.get(
  "/",
  protect,
  getMyNotifications
);

// Get unread count
router.get(
  "/unread-count",
  protect,
  getUnreadCount
);

// Mark all as read
router.patch(
  "/read-all",
  protect,
  markAllAsRead
);

// Mark one as read
router.patch(
  "/:id/read",
  protect,
  markAsRead
);

// Delete notification
router.delete(
  "/:id",
  protect,
  deleteNotification
);

module.exports = router;
