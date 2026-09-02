import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import "../App.css";

const API_URL = "https://careerpilot-wxja.onrender.com";

function InterviewDetails() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const interviewId = searchParams.get("id");
  const token = localStorage.getItem("token");

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD INTERVIEW
  // ==========================================

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        setLoading(true);
        setError("");

        if (!token) {
          navigate("/login");
          return;
        }

        if (!interviewId) {
          throw new Error("Interview ID not found.");
        }

        /*
         * We already know this endpoint works because
         * Interviews.jsx uses it successfully.
         *
         * Fetch all interviews and find the selected one.
         */
        const response = await fetch(
          `${API_URL}/api/student/interviews`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("role");

          navigate("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to load interviews"
          );
        }

        const interviews =
          data.interviews ||
          data.data ||
          [];

        const selectedInterview =
          interviews.find(
            (item) =>
              String(item._id) ===
              String(interviewId)
          );

        if (!selectedInterview) {
          throw new Error(
            "Interview not found."
          );
        }

        setInterview(selectedInterview);
      } catch (err) {
        console.error(err);

        setError(
          err.message ||
            "Unable to load interview"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [interviewId, token, navigate]);

  // ==========================================
  // DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "Not specified";
    }

    const value = new Date(date);

    if (Number.isNaN(value.getTime())) {
      return "Not specified";
    }

    return value.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // TIME
  // ==========================================

  const formatTime = (date) => {
    if (!date) {
      return "Not specified";
    }

    const value = new Date(date);

    if (Number.isNaN(value.getTime())) {
      return "Not specified";
    }

    return value.toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // ==========================================
  // PREPARATION SCORE
  // ==========================================

  const getPreparationScore = () => {
    if (
      interview?.preparationScore !==
      undefined
    ) {
      return interview.preparationScore;
    }

    if (
      interview?.preparation !==
      undefined
    ) {
      return interview.preparation;
    }

    /*
     * Until preparationScore is stored
     * in the backend model, show 0 rather
     * than a fake hardcoded score.
     */
    return 0;
  };

  // ==========================================
  // TOPICS
  // ==========================================

  const getTopics = () => {
    const type =
      interview?.interviewType ||
      "Technical";

    if (type === "Aptitude") {
      return [
        "Quantitative Aptitude",
        "Logical Reasoning",
        "Verbal Ability",
        "Data Interpretation",
      ];
    }

    if (type === "Coding") {
      return [
        "Arrays",
        "Strings",
        "Collections",
        "Algorithms",
        "Problem Solving",
      ];
    }

    if (type === "HR") {
      return [
        "Self Introduction",
        "Strengths & Weaknesses",
        "Career Goals",
        "Why This Company?",
        "Project Explanation",
      ];
    }

    if (type === "Group Discussion") {
      return [
        "Current Topics",
        "Communication",
        "Leadership",
        "Listening Skills",
        "Team Discussion",
      ];
    }

    return [
      "Java OOP",
      "Collections",
      "Exception Handling",
      "SQL Joins",
      "Subqueries",
      "Projects",
      "Spring Boot Basics",
    ];
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="interview-details-page">
        <div className="interview-details-loading">
          Loading interview details...
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error || !interview) {
    return (
      <div className="interview-details-page">

        <div className="interview-details-error">

          <h2>
            Unable to load interview
          </h2>

          <p>
            {error ||
              "Interview not found."}
          </p>

          <Link
            to="/interviews"
            className="interview-details-back-btn"
          >
            ← Back to Interviews
          </Link>

        </div>

      </div>
    );
  }

  const preparationScore =
    getPreparationScore();

  const topics = getTopics();

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="interview-details-page">

      {/* ======================================
          HEADER
          ====================================== */}

      <section className="interview-details-hero">

        <div>

          <span className="interview-details-label">
            INTERVIEW DETAILS
          </span>

          <h1>
            {interview.company ||
              "Company"}
          </h1>

          <p>
            {interview.role ||
              "Role not specified"}

            {" • "}

            {interview.round ||
              interview.interviewType ||
              "Interview"}
          </p>

        </div>

        <div className="interview-details-hero-actions">

          <Link
            to="/interviews"
            className="interview-details-back-btn"
          >
            ← Back
          </Link>

          <Link
            to={`/interviews/edit?id=${interview._id}`}
            className="interview-details-edit-btn"
          >
            Edit Interview
          </Link>

        </div>

      </section>

      {/* ======================================
          MAIN GRID
          ====================================== */}

      <section className="interview-details-grid">

        {/* SCHEDULE */}

        <article className="interview-details-card">

          <span className="interview-details-label">
            SCHEDULE
          </span>

          <h2>
            Interview Schedule
          </h2>

          <div className="interview-details-info-grid">

            <div>
              <span>Date</span>

              <strong>
                {formatDate(
                  interview.interviewDate
                )}
              </strong>
            </div>

            <div>
              <span>Time</span>

              <strong>
                {interview.interviewTime ||
                  formatTime(
                    interview.interviewDate
                  )}
              </strong>
            </div>

            <div>
              <span>
                Interview Type
              </span>

              <strong>
                {interview.interviewType ||
                  "Not specified"}
              </strong>
            </div>

            <div>
              <span>Round</span>

              <strong>
                {interview.round ||
                  "Not specified"}
              </strong>
            </div>

            <div>
              <span>Mode</span>

              <strong>
                {interview.mode ||
                  "Not specified"}
              </strong>
            </div>

            <div>
              <span>Status</span>

              <strong>
                {interview.status ||
                  "Scheduled"}
              </strong>
            </div>

          </div>

          {/* LOCATION */}

          {interview.location && (

            <div
              className="interview-details-notes"
              style={{
                marginTop: "18px",
              }}
            >
              <strong>
                Location
              </strong>

              <p
                style={{
                  margin:
                    "6px 0 0 0",
                }}
              >
                {interview.location}
              </p>
            </div>

          )}

          {/* MEETING */}

          {interview.meetingLink && (

            <a
              href={
                interview.meetingLink
              }
              target="_blank"
              rel="noreferrer"
              className="interview-details-meeting-btn"
            >
              Join Interview
            </a>

          )}

        </article>

        {/* ======================================
            READINESS
            ====================================== */}

        <article className="interview-details-card">

          <span className="interview-details-label">
            READINESS
          </span>

          <h2>
            Preparation Score
          </h2>

          <div className="interview-details-score">

            <strong>
              {preparationScore}%
            </strong>

            <span>
              {preparationScore >= 80
                ? "Well Prepared"
                : preparationScore >= 60
                ? "Almost Ready"
                : preparationScore > 0
                ? "Needs Preparation"
                : "Not Evaluated"}
            </span>

          </div>

          <div className="interview-progress-track">

            <span
              style={{
                width: `${Math.min(
                  Math.max(
                    preparationScore,
                    0
                  ),
                  100
                )}%`,
              }}
            />

          </div>

          <Link
            to="/practice"
            className="interview-details-practice-btn"
          >
            Start Practice
          </Link>

        </article>

      </section>

      {/* ======================================
          TOPICS
          ====================================== */}

      <section className="interview-details-card">

        <span className="interview-details-label">
          PREPARATION TOPICS
        </span>

        <h2>
          Topics to Review
        </h2>

        <div className="interview-details-topics">

          {topics.map((topic) => (

            <span key={topic}>
              {topic}
            </span>

          ))}

        </div>

      </section>

      {/* ======================================
          NOTES
          ====================================== */}

      <section className="interview-details-card">

        <span className="interview-details-label">
          NOTES
        </span>

        <h2>
          Interview Preparation Notes
        </h2>

        <p className="interview-details-notes">
          {interview.notes ||
            "No preparation notes have been added for this interview."}
        </p>

      </section>

      {/* ======================================
          BOTTOM ACTIONS
          ====================================== */}

      <section className="interview-details-actions">

        <Link
          to="/calendar"
          className="interview-details-secondary-btn"
        >
          View Calendar
        </Link>

        <Link
          to="/skills"
          className="interview-details-primary-btn"
        >
          View Skill Gap
        </Link>

      </section>

    </div>
  );
}

export default InterviewDetails;
