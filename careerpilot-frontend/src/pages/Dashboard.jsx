import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PortalLayout from "../components/PortalLayout";
import "../App.css";

const API_URL = "http://localhost:5000";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const todayLabel = new Date().toLocaleDateString(
    "en-IN",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    }
  );

  const [analytics, setAnalytics] = useState(null);
  const [resume, setResume] = useState(null);
  const [applications, setApplications] = useState([]);
  const [events, setEvents] = useState([]);
  const [skills, setSkills] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // LOAD DASHBOARD DATA
  // =========================================================

  useEffect(() => {
    const loadDashboard = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`
      };

      try {
        setLoading(true);
        setError("");

        const results = await Promise.allSettled([
          fetch(
            `${API_URL}/api/analytics/student`,
            {
              headers
            }
          ),

          fetch(
            `${API_URL}/api/student/resume/analysis`,
            {
              headers
            }
          ),

          fetch(
            `${API_URL}/api/student/applications`,
            {
              headers
            }
          ),

          fetch(
            `${API_URL}/api/student/events`,
            {
              headers
            }
          ),

          fetch(
            `${API_URL}/api/student/skills`,
            {
              headers
            }
          )
        ]);

        // ANALYTICS

        if (results[0].status === "fulfilled") {
          const response = results[0].value;

          if (response.status === 401) {
            navigate("/login");
            return;
          }

          if (response.ok) {
            const data = await response.json();
            setAnalytics(data);
          }
        }

        // RESUME

        if (
          results[1].status === "fulfilled" &&
          results[1].value.ok
        ) {
          const data =
            await results[1].value.json();

          setResume(
            data.resume ||
              data.analysis ||
              data.data ||
              data
          );
        }

        // APPLICATIONS

        if (
          results[2].status === "fulfilled" &&
          results[2].value.ok
        ) {
          const data =
            await results[2].value.json();

          setApplications(
            data.applications || []
          );
        }

        // EVENTS

        if (
          results[3].status === "fulfilled" &&
          results[3].value.ok
        ) {
          const data =
            await results[3].value.json();

          setEvents(data.events || []);
        }

        // SKILLS

        if (
          results[4].status === "fulfilled" &&
          results[4].value.ok
        ) {
          const data =
            await results[4].value.json();

          setSkills(data.skills || []);
        }
      } catch (err) {
        console.error(err);

        setError(
          "Some dashboard information could not be loaded."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [navigate]);

  // =========================================================
  // ANALYTICS DATA
  // =========================================================

  const summary =
    analytics?.summary || {};

  const performance =
    analytics?.performance || {};

  const totalApplications =
    summary.totalApplications ??
    applications.length;

  const totalInterviews =
    summary.totalInterviews ?? 0;

  const totalOffers =
    summary.totalOffers ?? 0;

  // =========================================================
  // ATS SCORE
  // =========================================================

  const rawAtsScore =
    resume?.atsScore ??
    resume?.score ??
    resume?.generalAtsScore ??
    0;

  const atsScore = Math.max(
    0,
    Math.min(
      Number(rawAtsScore) || 0,
      10
    )
  );

  const atsPercentage =
    Math.round(atsScore * 10);

  // =========================================================
  // COMPANY MATCH
  // =========================================================

  const rawCompanyMatch =
    resume?.companyMatchScore ?? 0;

  const companyMatchScore =
    Math.max(
      0,
      Math.min(
        Number(rawCompanyMatch) || 0,
        10
      )
    );

  const companyMatchPercentage =
    Math.round(
      companyMatchScore * 10
    );

  // =========================================================
  // SKILL SCORE
  // =========================================================

  const skillScore = useMemo(() => {
    if (!skills.length) {
      return 0;
    }

    const total = skills.reduce(
      (sum, skill) =>
        sum +
        Number(
          skill.proficiency ??
            skill.score ??
            skill.levelPercentage ??
            0
        ),
      0
    );

    return Math.round(
      total / skills.length
    );
  }, [skills]);

  // =========================================================
  // INTERVIEW READINESS
  // =========================================================

  const interviewReadiness =
    totalInterviews > 0
      ? Math.min(
          100,
          Math.max(
            50,
            Number(
              performance.interviewRate ||
                0
            )
          )
        )
      : Number(
          performance.interviewRate || 0
        );

  // =========================================================
  // OVERALL READINESS
  // =========================================================

  const readinessValues = [
    atsPercentage,
    skillScore,
    interviewReadiness
  ].filter(
    (value) => value > 0
  );

  const readinessScore =
    readinessValues.length > 0
      ? Math.round(
          readinessValues.reduce(
            (sum, value) =>
              sum + value,
            0
          ) /
            readinessValues.length
        )
      : 0;

  // =========================================================
  // UPCOMING EVENTS
  // =========================================================

  const upcomingEvents =
    useMemo(() => {
      const now = new Date();

      return events
        .filter((event) => {
          if (
            event.status ===
              "Completed" ||
            event.status ===
              "Cancelled"
          ) {
            return false;
          }

          const dateValue =
            event.eventDate ||
            event.date ||
            event.startDate;

          if (!dateValue) {
            return false;
          }

          const date =
            new Date(dateValue);

          return (
            !Number.isNaN(
              date.getTime()
            ) &&
            date >=
              new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate()
              )
          );
        })
        .sort((a, b) => {
          const dateA = new Date(
            a.eventDate ||
              a.date ||
              a.startDate
          );

          const dateB = new Date(
            b.eventDate ||
              b.date ||
              b.startDate
          );

          return dateA - dateB;
        })
        .slice(0, 3)
        .map((event) => {
          const eventDate =
            new Date(
              event.eventDate ||
                event.date ||
                event.startDate
            );

          return {
            id: event._id,

            date: eventDate
              .getDate()
              .toString()
              .padStart(2, "0"),

            month: eventDate
              .toLocaleString(
                "en-US",
                {
                  month: "short"
                }
              )
              .toUpperCase(),

            title:
              event.title ||
              event.eventTitle ||
              "Career Event",

            company:
              event.company ||
              event.description ||
              "CareerPilot",

            type:
              event.eventType ||
              event.type ||
              "Other"
          };
        });
    }, [events]);

  // =========================================================
  // RECENT APPLICATIONS
  // =========================================================

  const recentApplications =
    useMemo(() => {
      return [...applications]
        .sort((a, b) => {
          const dateA =
            new Date(
              a.updatedAt ||
                a.createdAt ||
                a.appliedDate ||
                0
            );

          const dateB =
            new Date(
              b.updatedAt ||
                b.createdAt ||
                b.appliedDate ||
                0
            );

          return dateB - dateA;
        })
        .slice(0, 3)
        .map((application) => {
          const dateValue =
            application.appliedDate ||
            application.createdAt ||
            application.updatedAt;

          const date =
            dateValue
              ? new Date(dateValue)
              : null;

          return {
            id: application._id,

            company:
              application.company ||
              "Company",

            role:
              application.role ||
              application.jobRole ||
              "Role",

            status:
              application.status ||
              "Applied",

            date:
              date &&
              !Number.isNaN(
                date.getTime()
              )
                ? date.toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short"
                    }
                  )
                : "-"
          };
        });
    }, [applications]);

  // =========================================================
  // SKILL GAP
  // =========================================================

  const recommendedSkills =
    useMemo(() => {
      const missing =
        resume?.companyMissingSkills ||
        resume?.missingSkills ||
        [];

      if (
        Array.isArray(missing) &&
        missing.length
      ) {
        return missing.slice(0, 3);
      }

      const weakSkills = [...skills]
        .filter(
          (skill) =>
            Number(
              skill.proficiency ??
                skill.score ??
                skill.levelPercentage ??
                0
            ) < 60
        )
        .sort(
          (a, b) =>
            Number(
              a.proficiency ??
                a.score ??
                a.levelPercentage ??
                0
            ) -
            Number(
              b.proficiency ??
                b.score ??
                b.levelPercentage ??
                0
            )
        )
        .map(
          (skill) =>
            skill.skillName ||
            skill.name
        )
        .filter(Boolean);

      return weakSkills.slice(0, 3);
    }, [resume, skills]);

  // =========================================================
  // STATISTICS
  // =========================================================

  const stats = [
    {
      title: "Applications",
      value: totalApplications,
      subtitle:
        `${applications.length} applications tracked`,
      icon: "↗"
    },
    {
      title: "Interviews",
      value: totalInterviews,
      subtitle:
        totalInterviews === 1
          ? "1 interview recorded"
          : `${totalInterviews} interviews recorded`,
      icon: "◉"
    },
    {
      title: "Offers",
      value: totalOffers,
      subtitle:
        totalOffers === 1
          ? "1 offer received"
          : `${totalOffers} offers received`,
      icon: "✓"
    },
    {
      title: "ATS Score",
      value:
        `${atsScore.toFixed(1)}/10`,
      subtitle:
        atsScore > 0
          ? "Latest resume analysis"
          : "Analyze your resume",
      icon: "✦"
    }
  ];

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <PortalLayout
      title="Student Dashboard"
      subtitle={todayLabel}
    >
      <div className="dashboard-content dashboard-content-common">

        {/* =====================================================
            WELCOME
        ====================================================== */}

        <section className="dashboard-welcome">
          <div>
            <span className="dashboard-eyebrow">
              CAREERPILOT
            </span>

            <h1>
              Welcome back,{" "}
              {user?.name || "Student"}
            </h1>

            <p>
              Track your applications,
              interviews, placement drives and
              career readiness from one
              dashboard.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap"
            }}
          >
            <div
              className={`dashboard-status-badge ${
                readinessScore >= 75
                  ? "ready"
                  : "building"
              }`}
            >
              <span className="dashboard-status-dot" />

              {readinessScore >= 75
                ? "Placement Ready"
                : "Building Readiness"}
            </div>

            <Link
              to="/resume"
              className="dashboard-analyze-btn"
            >
              Analyze Resume
            </Link>
          </div>
        </section>

        {/* =====================================================
            ERROR
        ====================================================== */}

        {error && (
          <div className="dashboard-card">
            <p>{error}</p>
          </div>
        )}

        {/* =====================================================
            LOADING
        ====================================================== */}

        {loading && (
          <div className="dashboard-card">
            <p>
              Loading your dashboard...
            </p>
          </div>
        )}

        {/* =====================================================
            STATISTICS
        ====================================================== */}

        <section className="dashboard-stat-grid">
          {stats.map((stat) => (
            <div
              className="dashboard-stat-card"
              key={stat.title}
            >
              <div className="dashboard-stat-card-top">
                <span>
                  {stat.title}
                </span>

                <div className="dashboard-stat-icon">
                  {stat.icon}
                </div>
              </div>

              <strong>
                {stat.value}
              </strong>

              <p>
                {stat.subtitle}
              </p>
            </div>
          ))}
        </section>

        {/* =====================================================
            READINESS + SKILL GAP
        ====================================================== */}

        <section className="dashboard-two-column">

          {/* PLACEMENT READINESS */}

          <div className="dashboard-card">
            <div className="dashboard-card-heading">
              <div>
                <span className="dashboard-section-label">
                  AI INSIGHTS
                </span>

                <h2>
                  Placement Readiness
                </h2>
              </div>

              <strong className="dashboard-readiness-score">
                {readinessScore}%
              </strong>
            </div>

            <div className="dashboard-progress">
              <span
                style={{
                  width:
                    `${readinessScore}%`
                }}
              />
            </div>

            <div className="dashboard-readiness-list">
              <div>
                <span>
                  Resume Strength
                </span>

                <strong>
                  {atsPercentage}%
                </strong>
              </div>

              <div>
                <span>
                  Skill Match
                </span>

                <strong>
                  {companyMatchPercentage ||
                    skillScore}
                  %
                </strong>
              </div>

              <div>
                <span>
                  Interview Readiness
                </span>

                <strong>
                  {interviewReadiness}%
                </strong>
              </div>
            </div>

            <Link
              to="/analytics"
              className="dashboard-link"
            >
              View Analytics →
            </Link>
          </div>

          {/* SKILL GAP */}

          <div className="dashboard-card">
            <div className="dashboard-card-heading">
              <div>
                <span className="dashboard-section-label">
                  SKILL GAP
                </span>

                <h2>
                  Recommended Focus
                </h2>
              </div>
            </div>

            {recommendedSkills.length > 0 ? (
              <>
                <div className="dashboard-skill-tags">
                  {recommendedSkills.map(
                    (skill) => (
                      <span key={skill}>
                        {skill}
                      </span>
                    )
                  )}
                </div>

                <p className="dashboard-card-description">
                  Focus on these skills to
                  improve your job and company
                  match.
                </p>
              </>
            ) : (
              <p className="dashboard-card-description">
                Add your skills and analyze
                your resume to receive
                personalized recommendations.
              </p>
            )}

            <Link
              to="/skills"
              className="dashboard-secondary-btn"
            >
              View Skill Analysis
            </Link>
          </div>
        </section>

        {/* =====================================================
            EVENTS + APPLICATIONS
        ====================================================== */}

        <section className="dashboard-two-column">

          {/* UPCOMING EVENTS */}

          <div className="dashboard-card">
            <div className="dashboard-card-heading">
              <h2>
                Upcoming Events
              </h2>

              <Link to="/calendar">
                View Calendar
              </Link>
            </div>

            <div className="upcoming-list">
              {upcomingEvents.length === 0 ? (
                <p className="dashboard-card-description">
                  No upcoming events.
                </p>
              ) : (
                upcomingEvents.map(
                  (event) => (
                    <div
                      className="upcoming-item"
                      key={
                        event.id ||
                        event.title
                      }
                    >
                      <div className="upcoming-date">
                        <strong>
                          {event.date}
                        </strong>

                        <span>
                          {event.month}
                        </span>
                      </div>

                      <div className="dashboard-event-info">
                        <h3>
                          {event.title}
                        </h3>

                        <p>
                          {event.company}
                        </p>
                      </div>

                      <span
                        className={`dashboard-event-status ${String(
                          event.type
                        )
                          .toLowerCase()
                          .replace(
                            /\s+/g,
                            "-"
                          )}`}
                      >
                        {event.type}
                      </span>
                    </div>
                  )
                )
              )}
            </div>
          </div>

          {/* RECENT APPLICATIONS */}

          <div className="dashboard-card">
            <div className="dashboard-card-heading">
              <h2>
                Recent Applications
              </h2>

              <Link to="/applications">
                View All
              </Link>
            </div>

            <div className="recent-applications">
              {recentApplications.length === 0 ? (
                <p className="dashboard-card-description">
                  No applications added yet.
                </p>
              ) : (
                recentApplications.map(
                  (application) => (
                    <div
                      className="recent-row"
                      key={
                        application.id ||
                        `${application.company}-${application.role}`
                      }
                    >
                      <div>
                        <strong>
                          {application.company}
                        </strong>

                        <span>
                          {application.role}
                        </span>
                      </div>

                      <span
                        className={`dashboard-status ${String(
                          application.status
                        )
                          .toLowerCase()
                          .replace(
                            /\s+/g,
                            "-"
                          )}`}
                      >
                        {application.status}
                      </span>

                      <small>
                        {application.date}
                      </small>
                    </div>
                  )
                )
              )}
            </div>
          </div>
        </section>

        {/* =====================================================
            QUICK ACTIONS
        ====================================================== */}

        <section className="dashboard-section">
          <div className="dashboard-section-heading">
            <div>
              <span className="dashboard-section-label">
                QUICK ACTIONS
              </span>

              <h2>
                Continue your placement
                journey
              </h2>
            </div>
          </div>

          <div className="dashboard-quick-actions">

            <Link to="/applications">
              <strong>
                Add Application
              </strong>

              <span>
                Track a new job opportunity
              </span>
            </Link>

            <Link to="/resume">
              <strong>
                Scan Resume
              </strong>

              <span>
                Analyze your ATS score
              </span>
            </Link>

            <Link to="/skills">
              <strong>
                Analyze Skills
              </strong>

              <span>
                Discover missing skills
              </span>
            </Link>

            <Link to="/drives">
              <strong>
                Placement Drives
              </strong>

              <span>
                Find eligible opportunities
              </span>
            </Link>

          </div>
        </section>

      </div>
    </PortalLayout>
  );
}

export default Dashboard;
