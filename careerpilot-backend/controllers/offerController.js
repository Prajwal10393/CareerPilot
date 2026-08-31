const Offer = require("../models/Offer");

// ======================================================
// CREATE OFFER
// ======================================================
const createOffer = async (req, res) => {
  try {
    console.log("CREATE OFFER BODY:", req.body);

    const body = req.body || {};

    const {
      application,
      company,
      role,
      ctc,
      baseSalary,
      location,
      workMode,
      offerDate,
      joiningDate,
      decisionDeadline,
      status,
      bond,
      notes
    } = body;

    if (!company || !role || !ctc) {
      return res.status(400).json({
        success: false,
        message: "Company, role and CTC are required"
      });
    }

    const offerData = {
      user: req.user._id,
      company: company.trim(),
      role: role.trim(),
      ctc: String(ctc).trim(),
      baseSalary: baseSalary ? String(baseSalary).trim() : "",
      location: location ? location.trim() : "",
      workMode: workMode || "Onsite",
      status: status || "Received",
      bond: bond ? bond.trim() : "",
      notes: notes ? notes.trim() : ""
    };

    // Add optional fields only when provided
    if (application) {
      offerData.application = application;
    }

    if (offerDate) {
      offerData.offerDate = offerDate;
    }

    if (joiningDate) {
      offerData.joiningDate = joiningDate;
    }

    if (decisionDeadline) {
      offerData.decisionDeadline = decisionDeadline;
    }

    const offer = await Offer.create(offerData);

    return res.status(201).json({
      success: true,
      message: "Offer created successfully",
      offer
    });
  } catch (error) {
    console.error("CREATE OFFER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Server error"
    });
  }
};

// ======================================================
// GET ALL OFFERS FOR LOGGED-IN STUDENT
// ======================================================
const getMyOffers = async (req, res) => {
  try {
    const offers = await Offer.find({
      user: req.user._id
    })
      .populate("application")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: offers.length,
      offers
    });
  } catch (error) {
    console.error("GET OFFERS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Server error"
    });
  }
};

// ======================================================
// GET SINGLE OFFER
// ======================================================
const getOfferById = async (req, res) => {
  try {
    const offer = await Offer.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate("application");

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found"
      });
    }

    return res.status(200).json({
      success: true,
      offer
    });
  } catch (error) {
    console.error("GET OFFER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Server error"
    });
  }
};

// ======================================================
// UPDATE OFFER
// ======================================================
const updateOffer = async (req, res) => {
  try {
    const offer = await Offer.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found"
      });
    }

    const body = req.body || {};

    const allowedFields = [
      "application",
      "company",
      "role",
      "ctc",
      "baseSalary",
      "location",
      "workMode",
      "offerDate",
      "joiningDate",
      "decisionDeadline",
      "status",
      "bond",
      "notes"
    ];

    allowedFields.forEach((field) => {
      if (body[field] !== undefined) {
        // Do not store empty application id
        if (field === "application" && body[field] === "") {
          return;
        }

        // Convert empty dates to undefined
        if (
          ["offerDate", "joiningDate", "decisionDeadline"].includes(field) &&
          body[field] === ""
        ) {
          offer[field] = undefined;
          return;
        }

        offer[field] = body[field];
      }
    });

    const updatedOffer = await offer.save();

    return res.status(200).json({
      success: true,
      message: "Offer updated successfully",
      offer: updatedOffer
    });
  } catch (error) {
    console.error("UPDATE OFFER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Server error"
    });
  }
};

// ======================================================
// ACCEPT / REJECT OFFER
// ======================================================
const updateOfferDecision = async (req, res) => {
  try {
    const decision =
      req.body?.decision ||
      req.body?.status;

    if (!decision) {
      return res.status(400).json({
        success: false,
        message: "Offer decision is required"
      });
    }

    if (!["Accepted", "Rejected"].includes(decision)) {
      return res.status(400).json({
        success: false,
        message: "Decision must be Accepted or Rejected"
      });
    }

    const offer = await Offer.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found"
      });
    }

    offer.status = decision;

    await offer.save();

    return res.status(200).json({
      success: true,
      message: `Offer ${decision.toLowerCase()} successfully`,
      offer
    });
  } catch (error) {
    console.error("OFFER DECISION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Server error"
    });
  }
};

// ======================================================
// DELETE OFFER
// ======================================================
const deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found"
      });
    }

    await offer.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Offer deleted successfully"
    });
  } catch (error) {
    console.error("DELETE OFFER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Server error"
    });
  }
};

// ======================================================
// EXPORT CONTROLLER FUNCTIONS
// ======================================================
module.exports = {
  createOffer,
  getMyOffers,
  getOfferById,
  updateOffer,
  updateOfferDecision,
  deleteOffer
};
