const Event = require("../models/Event");

// Create event
const createEvent = async (req, res) => {
  try {
    const {
      title,
      eventType,
      company,
      relatedApplication,
      relatedDrive,
      relatedInterview,
      startDate,
      endDate,
      mode,
      location,
      meetingLink,
      reminder,
      priority,
      status,
      notes
    } = req.body;

    if (!title || !startDate) {
      return res.status(400).json({
        success: false,
        message: "Title and start date are required"
      });
    }

    const event = await Event.create({
      user: req.user._id,
      title,
      eventType,
      company,
      relatedApplication,
      relatedDrive,
      relatedInterview,
      startDate,
      endDate,
      mode,
      location,
      meetingLink,
      reminder,
      priority,
      status,
      notes
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Get all events for logged-in student
const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({
      user: req.user._id
    })
      .populate(
        "relatedApplication",
        "company role status"
      )
      .populate(
        "relatedDrive",
        "company role status"
      )
      .populate(
        "relatedInterview",
        "company role status"
      )
      .sort({
        startDate: 1
      });

    res.status(200).json({
      success: true,
      count: events.length,
      events
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Get one event
const getEventById = async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      user: req.user._id
    })
      .populate(
        "relatedApplication",
        "company role status"
      )
      .populate(
        "relatedDrive",
        "company role status"
      )
      .populate(
        "relatedInterview",
        "company role status"
      );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    res.status(200).json({
      success: true,
      event
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Update event
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    const allowedFields = [
      "title",
      "eventType",
      "company",
      "relatedApplication",
      "relatedDrive",
      "relatedInterview",
      "startDate",
      "endDate",
      "mode",
      "location",
      "meetingLink",
      "reminder",
      "priority",
      "status",
      "notes"
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        event[field] = req.body[field];
      }
    });

    await event.save();

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      event
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Update only event status
const updateEventStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required"
      });
    }

    const event = await Event.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    event.status = status;

    await event.save();

    res.status(200).json({
      success: true,
      message: "Event status updated successfully",
      event
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Delete event
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: "Event deleted successfully"
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
  createEvent,
  getMyEvents,
  getEventById,
  updateEvent,
  updateEventStatus,
  deleteEvent
};