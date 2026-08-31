const express = require("express");

const {
  createOffer,
  getMyOffers,
  getOfferById,
  updateOffer,
  updateOfferDecision,
  deleteOffer
} = require("../controllers/offerController");

const {
  protect,
  authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

// All offer routes are student-only
router.use(protect);
router.use(authorizeRoles("student"));

// Create offer + Get all offers
router
  .route("/")
  .post(createOffer)
  .get(getMyOffers);

// Get one + Update + Delete offer
router
  .route("/:id")
  .get(getOfferById)
  .put(updateOffer)
  .delete(deleteOffer);

// Accept / Reject offer
router.patch(
  "/:id/decision",
  updateOfferDecision
);

module.exports = router;
