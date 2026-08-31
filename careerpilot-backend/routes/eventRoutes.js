const express = require("express");

const {
  createEvent,
  getMyEvents,
  getEventById,
  updateEvent,
  updateEventStatus,
  deleteEvent
} = require("../controllers/eventController");

const {
  protect,
  authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

// All event routes are student-only
router.use(protect);
router.use(authorizeRoles("student"));

// Create event + Get all events
router
  .route("/")
  .post(createEvent)
  .get(getMyEvents);

// Get one + Update + Delete event
router
  .route("/:id")
  .get(getEventById)
  .put(updateEvent)
  .delete(deleteEvent);

// Update only event status
router.patch(
  "/:id/status",
  updateEventStatus
);

module.exports = router;