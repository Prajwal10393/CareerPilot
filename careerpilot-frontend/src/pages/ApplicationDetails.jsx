import "../App.css";
import { Link, useParams } from "react-router-dom";

function ApplicationDetails() {
  const { id } = useParams();

  const application = {
    id,
    company: "Google",
    role: "Software Engineer",
    package: "22 LPA",
    location: "Bengaluru",
    status: "Interview",
    appliedDate: "03 Aug 2026",
    source: "Campus Drive",
    jobUrl: "https://careers.google.com",
    employmentType: "Full Time",
    workMode: "Hybrid",
    notes:
      "Prepare Java, DSA, SQL, DBMS and system design basics before the next round."
  };

  const timeline = [
    {
      stage: "Applied",
      date: "03 Aug 2026",
      status: "Completed",
      note: "Application submitted successfully."
    },
    {
      stage: "Shortlisted",
      date: "06 Aug 2026",
      status: "Completed",
      note: "Profile shortlisted for online assessment."
    },
    {
      stage: "Online Test",
      date: "08 Aug 2026",
      status: "Completed",
      note: "Online assessment completed."
    },
    {
      stage: "Technical Interview",
      date: "14 Aug 2026",
      status: "Current",
      note: "Technical interview scheduled at 10:00 AM."
    },
    {
      stage: "HR Interview",
      date: "-",
      status: "Pending",
      note: "Waiting for technical round result."
    },
    {
      stage: "Offer",
      date: "-",
      status: "Pending",
      note: "Final result pending."
    }
  ];

  return (
    <div className="dashboard-page">

      <aside className="dashboard-sidebar">

        <div className="dashboard-logo">
          CareerPilot
        </div>

        <nav className="dashboard-menu">

          <Link to="/dashboard">
            Dashboard
          </Link>

          <Link to="/applications" className="active">
            My Applications
          </Link>

          <Link to="/drives">
            Placement Drives
          </Link>

          <Link to="/resume">
            AI Resume Analyzer
          </Link>

          <Link to="/skills">
            Skills
          </Link>

          <Link to="/interviews">
            Interviews
          </Link>

          <Link to="/offers">
            Offers
          </Link>

          <Link to="/calendar">
            Calendar
          </Link>

          <Link to="/analytics">
            Analytics
          </Link>

          <Link to="/practice">
            Practice
          </Link>

          <Link to="/profile">
            Profile
          </Link>

        </nav>

        <Link
          to="/login"
          className="dashboard-logout"
        >
          Logout
        </Link>

      </aside>

      <div className="dashboard-main">

        <header className="dashboard-topbar">

          <div className="dashboard-search">

            <input
              type="text"
              placeholder="Search CareerPilot..."
            />

          </div>

          <div className="dashboard-user">

            <div className="notification-icon">
              🔔
            </div>

            <div className="dashboard-avatar">
              PN
            </div>

            <span>
              Prajwal
            </span>

          </div>

        </header>

        <main className="dashboard-content">

          <div className="application-details-heading">

            <div>

              <Link
                to="/applications"
                className="application-details-back"
              >
                ← Back to Applications
              </Link>

              <div className="application-title-row">

                <div className="application-large-logo">
                  G
                </div>

                <div>

                  <h1>
                    {application.company}
                  </h1>

                  <p>
                    {application.role}
                  </p>

                </div>

              </div>

            </div>

            <div className="application-detail-actions">

              <Link
                to={`/applications/${id}/edit`}
                className="application-edit-btn"
              >
                Edit Application
              </Link>

              <button
                className="application-delete-btn"
                onClick={() =>
                  confirm(
                    "Are you sure you want to delete this application?"
                  )
                }
              >
                Delete
              </button>

            </div>

          </div>

          <div className="application-detail-summary">

            <div>

              <span>
                Current Status
              </span>

              <strong className="application-current-status">
                {application.status}
              </strong>

            </div>

            <div>

              <span>
                Package
              </span>

              <strong>
                {application.package}
              </strong>

            </div>

            <div>

              <span>
                Location
              </span>

              <strong>
                {application.location}
              </strong>

            </div>

            <div>

              <span>
                Applied Date
              </span>

              <strong>
                {application.appliedDate}
              </strong>

            </div>

          </div>

          <div className="application-detail-grid">

            <section className="application-detail-card">

              <h2>
                Application Information
              </h2>

              <div className="application-info-grid">

                <div>

                  <span>
                    Company
                  </span>

                  <strong>
                    {application.company}
                  </strong>

                </div>

                <div>

                  <span>
                    Job Role
                  </span>

                  <strong>
                    {application.role}
                  </strong>

                </div>

                <div>

                  <span>
                    Employment Type
                  </span>

                  <strong>
                    {application.employmentType}
                  </strong>

                </div>

                <div>

                  <span>
                    Work Mode
                  </span>

                  <strong>
                    {application.workMode}
                  </strong>

                </div>

                <div>

                  <span>
                    Application Source
                  </span>

                  <strong>
                    {application.source}
                  </strong>

                </div>

                <div>

                  <span>
                    Job Link
                  </span>

                  <a
                    href={application.jobUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open Job Posting
                  </a>

                </div>

              </div>

            </section>

            <section className="application-detail-card">

              <h2>
                Notes
              </h2>

              <p className="application-notes">
                {application.notes}
              </p>

              <button
                className="application-note-btn"
                onClick={() =>
                  alert("Add note frontend working!")
                }
              >
                + Add Note
              </button>

            </section>

          </div>

          <section className="application-timeline-card">

            <div className="application-timeline-heading">

              <div>

                <h2>
                  Recruitment Timeline
                </h2>

                <p>
                  Track each stage of your recruitment process.
                </p>

              </div>

              <button
                onClick={() =>
                  alert("Update status frontend working!")
                }
              >
                Update Status
              </button>

            </div>

            <div className="application-timeline">

              {timeline.map((item, index) => (

                <div
                  className="application-timeline-item"
                  key={item.stage}
                >

                  <div className="timeline-left">

                    <div
                      className={
                        `timeline-circle ${item.status.toLowerCase()}`
                      }
                    >
                      {index + 1}
                    </div>

                    {index !== timeline.length - 1 && (
                      <div className="timeline-line" />
                    )}

                  </div>

                  <div className="timeline-content">

                    <div className="timeline-content-top">

                      <div>

                        <h3>
                          {item.stage}
                        </h3>

                        <p>
                          {item.date}
                        </p>

                      </div>

                      <span
                        className={
                          `timeline-status ${item.status.toLowerCase()}`
                        }
                      >
                        {item.status}
                      </span>

                    </div>

                    <p className="timeline-note">
                      {item.note}
                    </p>

                  </div>

                </div>

              ))}

            </div>

          </section>

          <div className="application-detail-grid">

            <section className="application-detail-card">

              <h2>
                Upcoming Activity
              </h2>

              <div className="application-upcoming-box">

                <div className="application-upcoming-date">

                  <strong>
                    14
                  </strong>

                  <span>
                    AUG
                  </span>

                </div>

                <div>

                  <h3>
                    Technical Interview
                  </h3>

                  <p>
                    10:00 AM · Online
                  </p>

                </div>

              </div>

              <Link
                to="/interviews"
                className="application-view-interview"
              >
                View Interview Details
              </Link>

            </section>

            <section className="application-detail-card">

              <h2>
                AI Job Match
              </h2>

              <div className="application-match-score">

                <strong>
                  84%
                </strong>

                <span>
                  Job Match Score
                </span>

              </div>

              <div className="application-match-progress">

                <span style={{ width: "84%" }} />

              </div>

              <p className="application-match-text">
                Your profile strongly matches this role.
                Improve Docker and AWS knowledge to increase
                your match score.
              </p>

              <Link
                to="/resume"
                className="application-match-link"
              >
                View Full AI Analysis
              </Link>

            </section>

          </div>

        </main>

      </div>

    </div>
  );
}

export default ApplicationDetails;
