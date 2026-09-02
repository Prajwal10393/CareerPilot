import {
  useEffect,
  useMemo,
  useState
} from "react";

import { Link } from "react-router-dom";

import PortalLayout from "../components/PortalLayout";
import "../App.css";

const API_URL = "https://careerpilot-wxja.onrender.com";

function Calendar() {
  const token =
    localStorage.getItem("token");

  const today = new Date();

  const [selectedMonth, setSelectedMonth] =
    useState(today.getMonth());

  const [selectedYear, setSelectedYear] =
    useState(today.getFullYear());

  const [selectedDate, setSelectedDate] =
    useState(today.getDate());

  const [events, setEvents] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [showForm, setShowForm] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [form, setForm] =
    useState({
      title: "",
      eventType: "Other",
      company: "",
      startDate: "",
      endDate: "",
      mode: "Online",
      location: "",
      meetingLink: "",
      reminder: "1 Day",
      priority: "Medium",
      status: "Upcoming",
      notes: ""
    });

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  const weekDays = [
    "SUN",
    "MON",
    "TUE",
    "WED",
    "THU",
    "FRI",
    "SAT"
  ];

  const eventTypes = [
    "Interview",
    "Test",
    "Deadline",
    "Drive",
    "Offer",
    "Joining",
    "Reminder",
    "Other"
  ];

  const modes = [
    "Online",
    "Offline",
    "Hybrid"
  ];

  const reminders = [
    "None",
    "10 Minutes",
    "30 Minutes",
    "1 Hour",
    "1 Day",
    "2 Days",
    "1 Week"
  ];

  const priorities = [
    "Low",
    "Medium",
    "High"
  ];

  const statuses = [
    "Upcoming",
    "Completed",
    "Cancelled"
  ];

  // =====================================================
  // FETCH EVENTS
  // =====================================================

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        throw new Error(
          "Please login to view calendar events."
        );
      }

      const response =
        await fetch(
          `${API_URL}/api/student/events`,
          {
            method: "GET",
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load events"
        );
      }

      setEvents(
        data.events ||
          data.data ||
          []
      );
    } catch (err) {
      setError(
        err.message ||
          "Unable to load events"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();

    window.scrollTo(0, 0);
  }, []);

  // =====================================================
  // DATE HELPERS
  // =====================================================

  const formatTime = (
    date
  ) => {
    if (!date) {
      return "-";
    }

    const value =
      new Date(date);

    if (
      Number.isNaN(
        value.getTime()
      )
    ) {
      return "-";
    }

    return value.toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit"
      }
    );
  };

  const formatFullDate = (
    date
  ) => {
    if (!date) {
      return "-";
    }

    const value =
      new Date(date);

    if (
      Number.isNaN(
        value.getTime()
      )
    ) {
      return "-";
    }

    return value.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );
  };

  const dateForInput = (
    date
  ) => {
    if (!date) {
      return "";
    }

    const value =
      new Date(date);

    const localDate =
      new Date(
        value.getTime() -
          value.getTimezoneOffset() *
            60000
      );

    return localDate
      .toISOString()
      .slice(0, 16);
  };

  // =====================================================
  // CALENDAR GENERATION
  // =====================================================

  const daysInMonth =
    new Date(
      selectedYear,
      selectedMonth + 1,
      0
    ).getDate();

  const firstDay =
    new Date(
      selectedYear,
      selectedMonth,
      1
    ).getDay();

  const calendarDays =
    useMemo(() => {
      const days = [];

      for (
        let i = 0;
        i < firstDay;
        i++
      ) {
        days.push(null);
      }

      for (
        let day = 1;
        day <= daysInMonth;
        day++
      ) {
        days.push(day);
      }

      return days;
    }, [
      firstDay,
      daysInMonth
    ]);

  // =====================================================
  // MONTH EVENTS
  // =====================================================

  const monthEvents =
    useMemo(() => {
      return events
        .filter(
          (event) => {
            const date =
              new Date(
                event.startDate
              );

            return (
              date.getMonth() ===
                selectedMonth &&
              date.getFullYear() ===
                selectedYear
            );
          }
        )
        .sort(
          (a, b) =>
            new Date(
              a.startDate
            ) -
            new Date(
              b.startDate
            )
        );
    }, [
      events,
      selectedMonth,
      selectedYear
    ]);

  // =====================================================
  // SELECTED DATE EVENTS
  // =====================================================

  const selectedEvents =
    useMemo(() => {
      if (!selectedDate) {
        return [];
      }

      return monthEvents.filter(
        (event) => {
          const date =
            new Date(
              event.startDate
            );

          return (
            date.getDate() ===
            selectedDate
          );
        }
      );
    }, [
      monthEvents,
      selectedDate
    ]);

  // =====================================================
  // UPCOMING EVENTS
  // =====================================================

  const upcomingEvents =
    useMemo(() => {
      const now = new Date();

      return events
        .filter(
          (event) =>
            new Date(
              event.startDate
            ) >= now &&
            event.status ===
              "Upcoming"
        )
        .sort(
          (a, b) =>
            new Date(
              a.startDate
            ) -
            new Date(
              b.startDate
            )
        )
        .slice(0, 4);
    }, [events]);

  const getEventsForDay = (
    day
  ) => {
    return monthEvents.filter(
      (event) =>
        new Date(
          event.startDate
        ).getDate() === day
    );
  };

  // =====================================================
  // MONTH NAVIGATION
  // =====================================================

  const previousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(
        selectedYear - 1
      );
    } else {
      setSelectedMonth(
        selectedMonth - 1
      );
    }

    setSelectedDate(null);
  };

  const nextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(
        selectedYear + 1
      );
    } else {
      setSelectedMonth(
        selectedMonth + 1
      );
    }

    setSelectedDate(null);
  };

  const goToToday = () => {
    const current =
      new Date();

    setSelectedMonth(
      current.getMonth()
    );

    setSelectedYear(
      current.getFullYear()
    );

    setSelectedDate(
      current.getDate()
    );
  };

  // =====================================================
  // FORM
  // =====================================================

  const handleChange = (
    event
  ) => {
    const {
      name,
      value
    } = event.target;

    setForm(
      (previous) => ({
        ...previous,
        [name]: value
      })
    );
  };

  const resetForm = () => {
    setForm({
      title: "",
      eventType: "Other",
      company: "",
      startDate: "",
      endDate: "",
      mode: "Online",
      location: "",
      meetingLink: "",
      reminder: "1 Day",
      priority: "Medium",
      status: "Upcoming",
      notes: ""
    });

    setEditingId(null);
    setShowForm(false);
  };

  const handleAddEvent = () => {
    resetForm();

    setShowForm(true);
    setError("");
    setMessage("");

    if (selectedDate) {
      const date =
        new Date(
          selectedYear,
          selectedMonth,
          selectedDate,
          9,
          0
        );

      const localDate =
        new Date(
          date.getTime() -
            date.getTimezoneOffset() *
              60000
        );

      setForm(
        (previous) => ({
          ...previous,
          startDate:
            localDate
              .toISOString()
              .slice(0, 16)
        })
      );
    }
  };

  // =====================================================
  // EDIT
  // =====================================================

  const handleEdit = (
    event
  ) => {
    setEditingId(event._id);

    setForm({
      title:
        event.title || "",

      eventType:
        event.eventType ||
        "Other",

      company:
        event.company || "",

      startDate:
        dateForInput(
          event.startDate
        ),

      endDate:
        dateForInput(
          event.endDate
        ),

      mode:
        event.mode ||
        "Online",

      location:
        event.location || "",

      meetingLink:
        event.meetingLink || "",

      reminder:
        event.reminder ||
        "1 Day",

      priority:
        event.priority ||
        "Medium",

      status:
        event.status ||
        "Upcoming",

      notes:
        event.notes || ""
    });

    setShowForm(true);
    setError("");
    setMessage("");

    window.scrollTo({
      top: 150,
      behavior: "smooth"
    });
  };

  // =====================================================
  // SAVE
  // =====================================================

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      if (
        !form.title.trim() ||
        !form.startDate
      ) {
        setError(
          "Title and start date are required."
        );

        return;
      }

      try {
        setSaving(true);
        setError("");
        setMessage("");

        const url =
          editingId
            ? `${API_URL}/api/student/events/${editingId}`
            : `${API_URL}/api/student/events`;

        const response =
          await fetch(
            url,
            {
              method:
                editingId
                  ? "PUT"
                  : "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`
              },

              body:
                JSON.stringify({
                  title:
                    form.title,

                  eventType:
                    form.eventType,

                  company:
                    form.company,

                  startDate:
                    form.startDate,

                  endDate:
                    form.endDate ||
                    undefined,

                  mode:
                    form.mode,

                  location:
                    form.location,

                  meetingLink:
                    form.meetingLink,

                  reminder:
                    form.reminder,

                  priority:
                    form.priority,

                  status:
                    form.status,

                  notes:
                    form.notes
                })
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to save event"
          );
        }

        setMessage(
          editingId
            ? "Event updated successfully."
            : "Event added successfully."
        );

        resetForm();

        await fetchEvents();

        setTimeout(() => {
          setMessage("");
        }, 3000);
      } catch (err) {
        setError(
          err.message ||
            "Unable to save event"
        );
      } finally {
        setSaving(false);
      }
    };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete =
    async (id) => {
      const confirmed =
        window.confirm(
          "Are you sure you want to delete this event?"
        );

      if (!confirmed) {
        return;
      }

      try {
        const response =
          await fetch(
            `${API_URL}/api/student/events/${id}`,
            {
              method:
                "DELETE",

              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to delete event"
          );
        }

        setMessage(
          "Event deleted successfully."
        );

        await fetchEvents();
      } catch (err) {
        setError(
          err.message ||
            "Unable to delete event"
        );
      }
    };

  // =====================================================
  // MARK COMPLETED
  // =====================================================

  const markCompleted =
    async (event) => {
      try {
        const response =
          await fetch(
            `${API_URL}/api/student/events/${event._id}/status`,
            {
              method: "PATCH",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`
              },

              body:
                JSON.stringify({
                  status:
                    "Completed"
                })
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to update event"
          );
        }

        setMessage(
          "Event marked as completed."
        );

        await fetchEvents();
      } catch (err) {
        setError(
          err.message ||
            "Unable to update event"
        );
      }
    };

  // =====================================================
  // EVENT CLASS
  // =====================================================

  const getEventClass = (
    type
  ) => {
    switch (type) {
      case "Interview":
        return "interview";

      case "Test":
        return "assessment";

      case "Deadline":
        return "deadline";

      case "Drive":
        return "drive";

      default:
        return "task";
    }
  };

  // =====================================================
  // STATISTICS
  // =====================================================

  const interviewCount =
    events.filter(
      (event) =>
        event.eventType ===
        "Interview"
    ).length;

  const testCount =
    events.filter(
      (event) =>
        event.eventType ===
        "Test"
    ).length;

  const deadlineCount =
    events.filter(
      (event) =>
        event.eventType ===
        "Deadline"
    ).length;

  const driveCount =
    events.filter(
      (event) =>
        event.eventType ===
        "Drive"
    ).length;

  // =====================================================
  // UI
  // =====================================================

  return (
    <PortalLayout
      title="Calendar"
      subtitle="Manage interviews, tests, drives and important career deadlines."
    >
      <div className="calendar-common-page">

        {loading ? (

          <div className="calendar-loading">

            <h3>
              Loading Calendar...
            </h3>

            <p>
              Loading your career
              events.
            </p>

          </div>

        ) : (

          <>
            {/* =============================================
                HERO
            ============================================= */}

            <section className="calendar-hero">

              <div>

                <span className="calendar-label">
                  PLACEMENT PLANNER
                </span>

                <h1>
                  Career Calendar
                </h1>

                <p>
                  Manage interviews,
                  tests, placement
                  drives and important
                  application deadlines.
                </p>

              </div>

              <div className="calendar-hero-actions">

                <button
                  type="button"
                  className="calendar-add-btn"
                  onClick={
                    handleAddEvent
                  }
                >
                  + Add Event
                </button>

                <button
                  type="button"
                  className="calendar-today-btn"
                  onClick={
                    goToToday
                  }
                >
                  Today
                </button>

              </div>

            </section>

            {/* MESSAGE */}

            {message && (

              <div className="calendar-success-message">
                {message}
              </div>

            )}

            {error && (

              <div className="calendar-error-message">
                {error}
              </div>

            )}

            {/* =============================================
                ADD / EDIT FORM
            ============================================= */}

            {showForm && (

              <section className="application-form-card calendar-form-card">

                <div className="application-form-heading">

                  <div>

                    <span className="calendar-label">
                      {editingId
                        ? "UPDATE EVENT"
                        : "NEW EVENT"}
                    </span>

                    <h2>
                      {editingId
                        ? "Edit Event"
                        : "Add Event"}
                    </h2>

                  </div>

                  <button
                    type="button"
                    className="application-form-close"
                    onClick={
                      resetForm
                    }
                  >
                    ×
                  </button>

                </div>

                <form
                  className="application-form"
                  onSubmit={
                    handleSubmit
                  }
                >

                  <div className="application-form-grid">

                    <div className="application-field">

                      <label>
                        Event Title *
                      </label>

                      <input
                        type="text"
                        name="title"
                        value={
                          form.title
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="TCS Technical Interview"
                        required
                      />

                    </div>

                    <div className="application-field">

                      <label>
                        Event Type
                      </label>

                      <select
                        name="eventType"
                        value={
                          form.eventType
                        }
                        onChange={
                          handleChange
                        }
                      >

                        {eventTypes.map(
                          (type) => (
                            <option
                              key={
                                type
                              }
                              value={
                                type
                              }
                            >
                              {type}
                            </option>
                          )
                        )}

                      </select>

                    </div>

                    <div className="application-field">

                      <label>
                        Company
                      </label>

                      <input
                        type="text"
                        name="company"
                        value={
                          form.company
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="TCS"
                      />

                    </div>

                    <div className="application-field">

                      <label>
                        Start Date & Time *
                      </label>

                      <input
                        type="datetime-local"
                        name="startDate"
                        value={
                          form.startDate
                        }
                        onChange={
                          handleChange
                        }
                        required
                      />

                    </div>

                    <div className="application-field">

                      <label>
                        End Date & Time
                      </label>

                      <input
                        type="datetime-local"
                        name="endDate"
                        value={
                          form.endDate
                        }
                        onChange={
                          handleChange
                        }
                      />

                    </div>

                    <div className="application-field">

                      <label>
                        Mode
                      </label>

                      <select
                        name="mode"
                        value={
                          form.mode
                        }
                        onChange={
                          handleChange
                        }
                      >

                        {modes.map(
                          (mode) => (
                            <option
                              key={
                                mode
                              }
                              value={
                                mode
                              }
                            >
                              {mode}
                            </option>
                          )
                        )}

                      </select>

                    </div>

                    <div className="application-field">

                      <label>
                        Location
                      </label>

                      <input
                        type="text"
                        name="location"
                        value={
                          form.location
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="Bengaluru / Online"
                      />

                    </div>

                    <div className="application-field">

                      <label>
                        Meeting Link
                      </label>

                      <input
                        type="url"
                        name="meetingLink"
                        value={
                          form.meetingLink
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="https://..."
                      />

                    </div>

                    <div className="application-field">

                      <label>
                        Reminder
                      </label>

                      <select
                        name="reminder"
                        value={
                          form.reminder
                        }
                        onChange={
                          handleChange
                        }
                      >

                        {reminders.map(
                          (reminder) => (
                            <option
                              key={
                                reminder
                              }
                              value={
                                reminder
                              }
                            >
                              {reminder}
                            </option>
                          )
                        )}

                      </select>

                    </div>

                    <div className="application-field">

                      <label>
                        Priority
                      </label>

                      <select
                        name="priority"
                        value={
                          form.priority
                        }
                        onChange={
                          handleChange
                        }
                      >

                        {priorities.map(
                          (priority) => (
                            <option
                              key={
                                priority
                              }
                              value={
                                priority
                              }
                            >
                              {priority}
                            </option>
                          )
                        )}

                      </select>

                    </div>

                    <div className="application-field">

                      <label>
                        Status
                      </label>

                      <select
                        name="status"
                        value={
                          form.status
                        }
                        onChange={
                          handleChange
                        }
                      >

                        {statuses.map(
                          (status) => (
                            <option
                              key={
                                status
                              }
                              value={
                                status
                              }
                            >
                              {status}
                            </option>
                          )
                        )}

                      </select>

                    </div>

                    <div className="application-field application-field-full">

                      <label>
                        Notes
                      </label>

                      <textarea
                        name="notes"
                        value={
                          form.notes
                        }
                        onChange={
                          handleChange
                        }
                        maxLength="1000"
                        rows="4"
                        placeholder="Add event notes..."
                      />

                    </div>

                  </div>

                  <div className="application-form-actions">

                    <button
                      type="button"
                      className="application-cancel-btn"
                      onClick={
                        resetForm
                      }
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="application-save-btn"
                      disabled={
                        saving
                      }
                    >
                      {saving
                        ? "Saving..."
                        : editingId
                        ? "Save Changes"
                        : "Add Event"}
                    </button>

                  </div>

                </form>

              </section>

            )}

            {/* =============================================
                STATS
            ============================================= */}

            <section className="calendar-stats-grid">

              <div className="calendar-stat-card">

                <span>
                  Interviews
                </span>

                <strong>
                  {interviewCount}
                </strong>

                <small>
                  Scheduled interviews
                </small>

              </div>

              <div className="calendar-stat-card">

                <span>
                  Tests
                </span>

                <strong>
                  {testCount}
                </strong>

                <small>
                  Tests and assessments
                </small>

              </div>

              <div className="calendar-stat-card">

                <span>
                  Deadlines
                </span>

                <strong>
                  {deadlineCount}
                </strong>

                <small>
                  Application deadlines
                </small>

              </div>

              <div className="calendar-stat-card">

                <span>
                  Placement Drives
                </span>

                <strong>
                  {driveCount}
                </strong>

                <small>
                  Placement opportunities
                </small>

              </div>

            </section>

            {/* =============================================
                CALENDAR
            ============================================= */}

            <section className="calendar-layout">

              <div className="calendar-main-card">

                <div className="calendar-toolbar">

                  <div>

                    <span className="calendar-label">
                      CALENDAR
                    </span>

                    <h2>
                      {
                        monthNames[
                          selectedMonth
                        ]
                      }{" "}
                      {selectedYear}
                    </h2>

                  </div>

                  <div className="calendar-navigation">

                    <button
                      type="button"
                      onClick={
                        previousMonth
                      }
                    >
                      ←
                    </button>

                    <button
                      type="button"
                      onClick={
                        goToToday
                      }
                    >
                      Today
                    </button>

                    <button
                      type="button"
                      onClick={
                        nextMonth
                      }
                    >
                      →
                    </button>

                  </div>

                </div>

                <div className="calendar-weekdays">

                  {weekDays.map(
                    (day) => (
                      <div key={day}>
                        {day}
                      </div>
                    )
                  )}

                </div>

                <div className="calendar-grid">

                  {calendarDays.map(
                    (
                      day,
                      index
                    ) => {
                      if (!day) {
                        return (
                          <div
                            className="calendar-empty-day"
                            key={`empty-${index}`}
                          />
                        );
                      }

                      const dayEvents =
                        getEventsForDay(
                          day
                        );

                      const isToday =
                        day ===
                          today.getDate() &&
                        selectedMonth ===
                          today.getMonth() &&
                        selectedYear ===
                          today.getFullYear();

                      const isSelected =
                        selectedDate ===
                        day;

                      return (

                        <button
                          type="button"
                          key={day}
                          className={`calendar-day ${
                            isToday
                              ? "today"
                              : ""
                          } ${
                            isSelected
                              ? "selected"
                              : ""
                          }`}
                          onClick={() =>
                            setSelectedDate(
                              day
                            )
                          }
                        >

                          <span className="calendar-day-number">
                            {day}
                          </span>

                          <div className="calendar-day-events">

                            {dayEvents
                              .slice(
                                0,
                                2
                              )
                              .map(
                                (
                                  event
                                ) => (

                                  <span
                                    key={
                                      event._id
                                    }
                                    className={`calendar-event-dot ${getEventClass(
                                      event.eventType
                                    )}`}
                                  >
                                    {
                                      event.title
                                    }
                                  </span>

                                )
                              )}

                            {dayEvents.length >
                              2 && (

                              <small>
                                +
                                {dayEvents.length -
                                  2}{" "}
                                more
                              </small>

                            )}

                          </div>

                        </button>

                      );
                    }
                  )}

                </div>

              </div>

              {/* ===========================================
                  SIDE PANEL
              =========================================== */}

              <aside className="calendar-side-panel">

                <div className="calendar-selected-card">

                  <span className="calendar-label">
                    SELECTED DATE
                  </span>

                  <h2>
                    {selectedDate
                      ? `${selectedDate} ${monthNames[selectedMonth]}`
                      : "Select a date"}
                  </h2>

                  {selectedDate &&
                  selectedEvents.length >
                    0 ? (

                    <div className="calendar-selected-events">

                      {selectedEvents.map(
                        (event) => (

                          <div
                            className="calendar-selected-event"
                            key={
                              event._id
                            }
                          >

                            <div className="calendar-event-heading">

                              <span
                                className={`calendar-type-badge ${getEventClass(
                                  event.eventType
                                )}`}
                              >
                                {
                                  event.eventType
                                }
                              </span>

                              <span>
                                {formatTime(
                                  event.startDate
                                )}
                              </span>

                            </div>

                            <h3>
                              {event.title}
                            </h3>

                            <strong>
                              {event.company ||
                                "Personal Event"}
                            </strong>

                            <p>
                              {event.notes ||
                                "No notes added."}
                            </p>

                            <small>
                              Priority:{" "}
                              {
                                event.priority
                              }
                            </small>

                            <div className="calendar-event-actions">

                              <button
                                type="button"
                                onClick={() =>
                                  handleEdit(
                                    event
                                  )
                                }
                              >
                                Edit
                              </button>

                              {event.status ===
                                "Upcoming" && (

                                <button
                                  type="button"
                                  onClick={() =>
                                    markCompleted(
                                      event
                                    )
                                  }
                                >
                                  Complete
                                </button>

                              )}

                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(
                                    event._id
                                  )
                                }
                              >
                                Delete
                              </button>

                            </div>

                          </div>

                        )
                      )}

                    </div>

                  ) : (

                    <div className="calendar-no-event">

                      <span>
                        ✓
                      </span>

                      <h3>
                        No events scheduled
                      </h3>

                      <p>
                        You have no
                        placement activities
                        scheduled for this
                        date.
                      </p>

                      <button
                        type="button"
                        onClick={
                          handleAddEvent
                        }
                      >
                        + Add Event
                      </button>

                    </div>

                  )}

                </div>

                {/* LEGEND */}

                <div className="calendar-legend-card">

                  <span className="calendar-label">
                    EVENT TYPES
                  </span>

                  <h2>
                    Calendar Legend
                  </h2>

                  <div className="calendar-legend-list">

                    <div>
                      <span className="legend-dot interview" />
                      Interview
                    </div>

                    <div>
                      <span className="legend-dot assessment" />
                      Test
                    </div>

                    <div>
                      <span className="legend-dot deadline" />
                      Deadline
                    </div>

                    <div>
                      <span className="legend-dot drive" />
                      Placement Drive
                    </div>

                    <div>
                      <span className="legend-dot task" />
                      Other Event
                    </div>

                  </div>

                </div>

              </aside>

            </section>

            {/* =============================================
                UPCOMING
            ============================================= */}

            <section className="calendar-upcoming-section">

              <div className="calendar-section-heading">

                <div>

                  <span className="calendar-label">
                    UPCOMING
                  </span>

                  <h2>
                    Next Career Events
                  </h2>

                  <p>
                    Important placement
                    activities you should
                    prepare for.
                  </p>

                </div>

                <Link to="/interviews">
                  View Interviews
                </Link>

              </div>

              <div className="calendar-upcoming-grid">

                {upcomingEvents.length >
                0 ? (

                  upcomingEvents.map(
                    (event) => {
                      const date =
                        new Date(
                          event.startDate
                        );

                      return (

                        <article
                          className="calendar-upcoming-card"
                          key={
                            event._id
                          }
                        >

                          <div className="calendar-upcoming-date">

                            <strong>
                              {
                                date.getDate()
                              }
                            </strong>

                            <span>
                              {monthNames[
                                date.getMonth()
                              ].slice(
                                0,
                                3
                              )}
                            </span>

                          </div>

                          <div className="calendar-upcoming-info">

                            <span
                              className={`calendar-type-badge ${getEventClass(
                                event.eventType
                              )}`}
                            >
                              {
                                event.eventType
                              }
                            </span>

                            <h3>
                              {event.title}
                            </h3>

                            <p>
                              {event.company ||
                                "Career Event"}
                            </p>

                            <small>
                              {formatFullDate(
                                event.startDate
                              )}{" "}
                              •{" "}
                              {formatTime(
                                event.startDate
                              )}
                            </small>

                          </div>

                        </article>

                      );
                    }
                  )

                ) : (

                  <div className="calendar-no-event">

                    <h3>
                      No upcoming events
                    </h3>

                    <p>
                      Add an event to
                      start planning your
                      placement activities.
                    </p>

                  </div>

                )}

              </div>

            </section>

            {/* =============================================
                REMINDER
            ============================================= */}

            <section className="calendar-reminder-card">

              <div>

                <span className="calendar-label">
                  SMART REMINDERS
                </span>

                <h2>
                  Never miss an
                  opportunity
                </h2>

                <p>
                  CareerPilot keeps your
                  interviews, tests and
                  application deadlines
                  organized in one
                  placement calendar.
                </p>

              </div>

              <Link
                to="/notifications"
                className="calendar-reminder-btn"
              >
                View Notifications
              </Link>

            </section>

          </>
        )}

      </div>
    </PortalLayout>
  );
}

export default Calendar;
