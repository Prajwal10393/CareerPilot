import {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import PortalLayout from "../components/PortalLayout";
import "../App.css";

const API_URL =
  "http://localhost:5000";

function Interviews() {
  const navigate =
    useNavigate();

  const [interviews, setInterviews] =
    useState([]);

  const [filter, setFilter] =
    useState("All");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const token =
    localStorage.getItem("token");

  // =====================================================
  // FETCH INTERVIEWS
  // =====================================================

  const fetchInterviews =
    async () => {
      try {
        setLoading(true);
        setError("");

        if (!token) {
          navigate("/login");
          return;
        }

        const response =
          await fetch(
            `${API_URL}/api/student/interviews`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );

        const data =
          await response.json();

        if (
          response.status === 401
        ) {
          localStorage.removeItem(
            "token"
          );

          localStorage.removeItem(
            "user"
          );

          localStorage.removeItem(
            "role"
          );

          navigate("/login");

          return;
        }

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load interviews"
          );
        }

        setInterviews(
          data.interviews ||
            data.data ||
            []
        );
      } catch (err) {
        console.error(err);

        setError(
          err.message ||
            "Unable to load interviews"
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchInterviews();
    window.scrollTo(0, 0);
  }, []);

  // =====================================================
  // STATUS
  // =====================================================

  const getStatus = (
    interview
  ) => {
    return (
      interview.status ||
      "Scheduled"
    );
  };

  // =====================================================
  // FILTER
  // =====================================================

  const filteredInterviews =
    useMemo(() => {
      if (filter === "All") {
        return interviews;
      }

      return interviews.filter(
        (interview) => {
          const status = String(
            getStatus(interview)
          ).toLowerCase();

          if (
            filter === "Upcoming"
          ) {
            return (
              status ===
              "scheduled"
            );
          }

          return (
            status ===
            filter.toLowerCase()
          );
        }
      );
    }, [interviews, filter]);

  // =====================================================
  // COUNTS
  // =====================================================

  const upcomingCount =
    interviews.filter(
      (interview) =>
        String(
          getStatus(interview)
        ).toLowerCase() ===
        "scheduled"
    ).length;

  const completedCount =
    interviews.filter(
      (interview) =>
        String(
          getStatus(interview)
        ).toLowerCase() ===
        "completed"
    ).length;

  const selectedCount =
    interviews.filter(
      (interview) =>
        String(
          getStatus(interview)
        ).toLowerCase() ===
        "selected"
    ).length;

  // =====================================================
  // NEXT INTERVIEW
  // =====================================================

  const nextInterview =
    useMemo(() => {
      const now =
        new Date();

      return interviews
        .filter(
          (interview) => {
            if (
              !interview.interviewDate
            ) {
              return false;
            }

            const status =
              String(
                getStatus(
                  interview
                )
              ).toLowerCase();

            return (
              new Date(
                interview.interviewDate
              ) >= now &&
              status !==
                "completed" &&
              status !==
                "cancelled" &&
              status !==
                "rejected"
            );
          }
        )
        .sort(
          (a, b) =>
            new Date(
              a.interviewDate
            ) -
            new Date(
              b.interviewDate
            )
        )[0];
    }, [interviews]);

  // =====================================================
  // MARK COMPLETED
  // =====================================================

  const handleComplete =
    async (id) => {
      try {
        const response =
          await fetch(
            `${API_URL}/api/student/interviews/${id}/status`,
            {
              method: "PATCH",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`
              },

              body: JSON.stringify({
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
              "Unable to update interview"
          );
        }

        await fetchInterviews();
      } catch (err) {
        console.error(err);

        alert(
          err.message ||
            "Unable to update interview"
        );
      }
    };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete =
    async (id) => {
      const confirmed =
        window.confirm(
          "Are you sure you want to delete this interview?"
        );

      if (!confirmed) {
        return;
      }

      try {
        const response =
          await fetch(
            `${API_URL}/api/student/interviews/${id}`,
            {
              method: "DELETE",

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
              "Unable to delete interview"
          );
        }

        await fetchInterviews();
      } catch (err) {
        console.error(err);

        alert(
          err.message ||
            "Unable to delete interview"
        );
      }
    };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (
    date
  ) => {
    if (!date) {
      return "Not specified";
    }

    const value =
      new Date(date);

    if (
      Number.isNaN(
        value.getTime()
      )
    ) {
      return "Not specified";
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

  // =====================================================
  // FORMAT TIME
  // =====================================================

  const formatTime = (
    date
  ) => {
    if (!date) {
      return "Not specified";
    }

    const value =
      new Date(date);

    if (
      Number.isNaN(
        value.getTime()
      )
    ) {
      return "Not specified";
    }

    return value.toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit"
      }
    );
  };

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (
    status
  ) => {
    const value =
      String(
        status || ""
      ).toLowerCase();

    if (
      value === "completed"
    ) {
      return "completed";
    }

    if (
      value === "selected"
    ) {
      return "selected";
    }

    if (
      value === "rejected"
    ) {
      return "rejected";
    }

    if (
      value === "cancelled"
    ) {
      return "cancelled";
    }

    return "scheduled";
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <PortalLayout
      title="Interviews"
      subtitle="Track interview rounds, schedules and placement progress."
    >
      <div className="interviews-common-page">

        {loading ? (

          <div className="interviews-loading">

            <h2>
              Loading interviews...
            </h2>

            <p>
              Please wait while we
              fetch your interview
              schedule.
            </p>

          </div>

        ) : (

          <>
            {/* =============================================
                HERO
            ============================================= */}

            <section className="interviews-hero">

              <div>

                <div className="interviews-eyebrow">
                  INTERVIEW CENTER
                </div>

                <h1>
                  Interview Tracker
                </h1>

                <p>
                  Track upcoming
                  interview rounds,
                  results and your
                  placement progress.
                </p>

              </div>

              <div className="interviews-hero-actions">

                <Link
                  to="/interviews/add"
                  className="interview-primary-btn"
                >
                  + Add Interview
                </Link>

                <Link
                  to="/calendar"
                  className="interview-secondary-btn"
                >
                  View Calendar
                </Link>

              </div>

            </section>

            {/* =============================================
                STATS
            ============================================= */}

            <section className="interview-stats">

              <div className="interview-stat-card">

                <span>
                  Upcoming
                </span>

                <strong>
                  {upcomingCount}
                </strong>

                <small>
                  Scheduled interviews
                </small>

              </div>

              <div className="interview-stat-card">

                <span>
                  Completed
                </span>

                <strong>
                  {completedCount}
                </strong>

                <small>
                  Interview rounds
                  completed
                </small>

              </div>

              <div className="interview-stat-card">

                <span>
                  Selected
                </span>

                <strong>
                  {selectedCount}
                </strong>

                <small>
                  Successful interviews
                </small>

              </div>

              <div className="interview-stat-card">

                <span>
                  Next Interview
                </span>

                <strong>
                  {nextInterview
                    ? formatDate(
                        nextInterview.interviewDate
                      )
                    : "–"}
                </strong>

                <small>
                  {nextInterview
                    ? nextInterview.company
                    : "No upcoming interview"}
                </small>

              </div>

            </section>

            {/* =============================================
                CONTENT
            ============================================= */}

            <section className="interviews-content">

              <div className="interviews-section-header">

                <div>

                  <div className="interviews-section-label">
                    SCHEDULE
                  </div>

                  <h2>
                    Interview Schedule
                  </h2>

                  <p>
                    Keep track of every
                    upcoming and completed
                    interview round.
                  </p>

                </div>

                {/* FILTERS */}

                <div className="interview-filters">

                  {[
                    "All",
                    "Upcoming",
                    "Completed",
                    "Selected",
                    "Rejected"
                  ].map(
                    (status) => (

                      <button
                        key={status}
                        type="button"
                        className={
                          filter ===
                          status
                            ? "active"
                            : ""
                        }
                        onClick={() =>
                          setFilter(
                            status
                          )
                        }
                      >
                        {status}
                      </button>

                    )
                  )}

                </div>

              </div>

              {/* ===========================================
                  ERROR
              =========================================== */}

              {error && (

                <div className="interviews-error">

                  <h3>
                    Unable to load
                    interviews
                  </h3>

                  <p>
                    {error}
                  </p>

                  <button
                    type="button"
                    onClick={
                      fetchInterviews
                    }
                  >
                    Try Again
                  </button>

                </div>

              )}

              {/* ===========================================
                  EMPTY
              =========================================== */}

              {!error &&
                filteredInterviews.length ===
                  0 && (

                  <div className="interviews-empty">

                    <div className="interviews-empty-icon">
                      📅
                    </div>

                    <h3>
                      No interviews found
                    </h3>

                    <p>
                      There are no
                      interviews available
                      for this filter.
                    </p>

                    <Link
                      to="/interviews/add"
                      className="interview-empty-add-btn"
                    >
                      + Add Interview
                    </Link>

                  </div>

                )}

              {/* ===========================================
                  CARDS
              =========================================== */}

              {!error &&
                filteredInterviews.length >
                  0 && (

                  <div className="interviews-grid">

                    {filteredInterviews.map(
                      (interview) => {
                        const status =
                          getStatus(
                            interview
                          );

                        const lowerStatus =
                          String(
                            status
                          ).toLowerCase();

                        return (

                          <article
                            className="interview-card"
                            key={
                              interview._id
                            }
                          >

                            {/* COMPANY */}

                            <div className="interview-company-row">

                              <div className="interview-company-info">

                                <div className="interview-company-logo">
                                  {(interview.company ||
                                    "C")
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>

                                <div className="interview-company-text">

                                  <h3>
                                    {interview.company ||
                                      "Company"}
                                  </h3>

                                  <p>
                                    {interview.role ||
                                      "Role not specified"}
                                  </p>

                                </div>

                              </div>

                              <span
                                className={`interview-status ${getStatusClass(
                                  status
                                )}`}
                              >
                                {status}
                              </span>

                            </div>

                            {/* INFORMATION */}

                            <div className="interview-info-grid">

                              <div>
                                <span>
                                  Date
                                </span>

                                <strong>
                                  {formatDate(
                                    interview.interviewDate
                                  )}
                                </strong>
                              </div>

                              <div>
                                <span>
                                  Time
                                </span>

                                <strong>
                                  {interview.interviewTime ||
                                    formatTime(
                                      interview.interviewDate
                                    )}
                                </strong>
                              </div>

                              <div>
                                <span>
                                  Round
                                </span>

                                <strong>
                                  {interview.round ||
                                    interview.roundName ||
                                    "Not specified"}
                                </strong>
                              </div>

                              <div>
                                <span>
                                  Mode
                                </span>

                                <strong>
                                  {interview.mode ||
                                    interview.interviewMode ||
                                    "Not specified"}
                                </strong>
                              </div>

                            </div>

                            {/* LOCATION */}

                            {(interview.location ||
                              interview.meetingLink) && (

                              <div className="interview-location">

                                <span>
                                  Location /
                                  Meeting
                                </span>

                                {interview.meetingLink ? (

                                  <a
                                    href={
                                      interview.meetingLink
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    Join Interview
                                  </a>

                                ) : (

                                  <strong>
                                    {
                                      interview.location
                                    }
                                  </strong>

                                )}

                              </div>

                            )}

                            {/* NOTES */}

                            {interview.notes && (

                              <div className="interview-notes">

                                <span>
                                  Notes
                                </span>

                                <p>
                                  {
                                    interview.notes
                                  }
                                </p>

                              </div>

                            )}

                            {/* ACTIONS */}

                            <div className="interview-card-actions">

                              <Link
                                to={`/interviews/details?id=${interview._id}`}
                                className="interview-view-btn"
                              >
                                View
                              </Link>

                              <Link
                                to={`/interviews/edit?id=${interview._id}`}
                                className="interview-edit-btn"
                              >
                                Edit
                              </Link>

                              {lowerStatus ===
                                "scheduled" && (

                                <button
                                  type="button"
                                  className="interview-complete-btn"
                                  onClick={() =>
                                    handleComplete(
                                      interview._id
                                    )
                                  }
                                >
                                  Mark Completed
                                </button>

                              )}

                              <button
                                type="button"
                                className="interview-delete-btn"
                                onClick={() =>
                                  handleDelete(
                                    interview._id
                                  )
                                }
                              >
                                Delete
                              </button>

                            </div>

                          </article>
                        );
                      }
                    )}

                  </div>

                )}

            </section>
          </>
        )}

      </div>
    </PortalLayout>
  );
}

export default Interviews;
