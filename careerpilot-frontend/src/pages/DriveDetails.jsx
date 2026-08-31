import "../App.css";
import { Link, useParams } from "react-router-dom";

function DriveDetails() {
  const { id } = useParams();

  const drive = {
    id,
    company: "Amazon",
    role: "SDE I",
    package: "18 LPA",
    location: "Bengaluru",
    workMode: "Hybrid",
    employmentType: "Full Time",
    deadline: "20 Aug 2026",
    openings: 25,
    cgpa: 7.0,
    maxBacklogs: 0,
    graduationYear: 2026,
    degree: "MCA / B.Tech / M.Tech"
  };

  const eligibility = [
    {
      label: "Degree",
      student: "MCA",
      required: drive.degree,
      status: "eligible"
    },
    {
      label: "Graduation Year",
      student: "2026",
      required: "2026",
      status: "eligible"
    },
    {
      label: "CGPA",
      student: "8.1",
      required: "Minimum 7.0",
      status: "eligible"
    },
    {
      label: "Active Backlogs",
      student: "0",
      required: "Maximum 0",
      status: "eligible"
    },
    {
      label: "Java",
      student: "Available",
      required: "Required",
      status: "eligible"
    },
    {
      label: "SQL",
      student: "Available",
      required: "Required",
      status: "eligible"
    },
    {
      label: "Docker",
      student: "Missing",
      required: "Preferred",
      status: "warning"
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

          <Link to="/applications">
            My Applications
          </Link>

          <Link to="/drives" className="active">
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

          <div className="drive-details-heading">

            <div>

              <Link
                to="/drives"
                className="drive-details-back"
              >
                ← Back to Placement Drives
              </Link>

              <div className="drive-details-title">

                <div className="drive-details-logo">
                  A
                </div>

                <div>

                  <h1>
                    {drive.company}
                  </h1>

                  <p>
                    {drive.role}
                  </p>

                </div>

              </div>

            </div>

            <button
              className="drive-details-apply"
              onClick={() =>
                alert(
                  "Application started successfully!"
                )
              }
            >
              Apply Now
            </button>

          </div>

          <div className="drive-details-summary">

            <div>

              <span>
                Package
              </span>

              <strong>
                {drive.package}
              </strong>

            </div>

            <div>

              <span>
                Location
              </span>

              <strong>
                {drive.location}
              </strong>

            </div>

            <div>

              <span>
                Work Mode
              </span>

              <strong>
                {drive.workMode}
              </strong>

            </div>

            <div>

              <span>
                Application Deadline
              </span>

              <strong>
                {drive.deadline}
              </strong>

            </div>

          </div>

          <div className="drive-details-grid">

            <section className="drive-details-card">

              <h2>
                Job Description
              </h2>

              <p>
                Join Amazon as an SDE I and work on
                scalable software systems used by millions
                of customers. You will collaborate with
                engineering teams, design reliable solutions
                and contribute to production-grade applications.
              </p>

              <h3>
                Responsibilities
              </h3>

              <ul>
                <li>
                  Design and develop scalable software solutions
                </li>

                <li>
                  Write clean and maintainable code
                </li>

                <li>
                  Collaborate with product and engineering teams
                </li>

                <li>
                  Debug and improve existing systems
                </li>

                <li>
                  Participate in code reviews
                </li>
              </ul>

            </section>

            <section className="drive-details-card">

              <h2>
                Job Information
              </h2>

              <div className="drive-information-list">

                <div>
                  <span>Employment Type</span>
                  <strong>{drive.employmentType}</strong>
                </div>

                <div>
                  <span>Openings</span>
                  <strong>{drive.openings}</strong>
                </div>

                <div>
                  <span>Required Degree</span>
                  <strong>{drive.degree}</strong>
                </div>

                <div>
                  <span>Graduation Year</span>
                  <strong>{drive.graduationYear}</strong>
                </div>

                <div>
                  <span>Minimum CGPA</span>
                  <strong>{drive.cgpa}</strong>
                </div>

                <div>
                  <span>Maximum Backlogs</span>
                  <strong>{drive.maxBacklogs}</strong>
                </div>

              </div>

            </section>

          </div>

          <section className="eligibility-section">

            <div className="eligibility-heading">

              <div>

                <span className="eligibility-badge">
                  SMART ELIGIBILITY CHECK
                </span>

                <h2>
                  Your Eligibility
                </h2>

                <p>
                  CareerPilot automatically compares your
                  profile with this placement drive.
                </p>

              </div>

              <div className="eligibility-result">

                <span>
                  Overall Result
                </span>

                <strong>
                  ✓ Eligible
                </strong>

              </div>

            </div>

            <div className="eligibility-table">

              <div className="eligibility-row header">

                <span>
                  Criteria
                </span>

                <span>
                  Your Profile
                </span>

                <span>
                  Requirement
                </span>

                <span>
                  Result
                </span>

              </div>

              {eligibility.map((item) => (

                <div
                  className="eligibility-row"
                  key={item.label}
                >

                  <strong>
                    {item.label}
                  </strong>

                  <span>
                    {item.student}
                  </span>

                  <span>
                    {item.required}
                  </span>

                  <span
                    className={
                      item.status === "eligible"
                        ? "eligibility-success"
                        : "eligibility-warning"
                    }
                  >
                    {item.status === "eligible"
                      ? "✓ Match"
                      : "⚠ Improve"}
                  </span>

                </div>

              ))}

            </div>

          </section>

          <div className="drive-ai-grid">

            <section className="drive-ai-card">

              <span className="drive-ai-label">
                AI JOB MATCH
              </span>

              <div className="drive-ai-score">

                <strong>
                  88%
                </strong>

                <span>
                  Job Match Score
                </span>

              </div>

              <div className="drive-ai-progress">

                <span style={{ width: "88%" }} />

              </div>

              <p>
                Your profile is a strong match for
                this Amazon SDE I opportunity.
              </p>

              <div className="drive-ai-skills">

                <div>

                  <h3>
                    Matching Skills
                  </h3>

                  <div>

                    <span>
                      Java
                    </span>

                    <span>
                      SQL
                    </span>

                    <span>
                      Git
                    </span>

                    <span>
                      Problem Solving
                    </span>

                  </div>

                </div>

                <div>

                  <h3>
                    Missing / Weak Skills
                  </h3>

                  <div className="missing">

                    <span>
                      Docker
                    </span>

                    <span>
                      AWS
                    </span>

                  </div>

                </div>

              </div>

              <Link to="/resume">
                View Full Resume Match Analysis
              </Link>

            </section>

            <section className="drive-ai-card">

              <span className="drive-ai-label">
                SELECTION PROCESS
              </span>

              <h2>
                Recruitment Stages
              </h2>

              <div className="selection-process">

                <div>
                  <span>1</span>
                  <strong>Application</strong>
                </div>

                <div>
                  <span>2</span>
                  <strong>Online Assessment</strong>
                </div>

                <div>
                  <span>3</span>
                  <strong>Technical Interview</strong>
                </div>

                <div>
                  <span>4</span>
                  <strong>HR Interview</strong>
                </div>

                <div>
                  <span>5</span>
                  <strong>Offer</strong>
                </div>

              </div>

            </section>

          </div>

          <section className="drive-important-dates">

            <h2>
              Important Dates
            </h2>

            <div className="drive-dates-grid">

              <div>

                <span>
                  Application Deadline
                </span>

                <strong>
                  20 Aug 2026
                </strong>

              </div>

              <div>

                <span>
                  Online Assessment
                </span>

                <strong>
                  24 Aug 2026
                </strong>

              </div>

              <div>

                <span>
                  Technical Interview
                </span>

                <strong>
                  28 Aug 2026
                </strong>

              </div>

              <div>

                <span>
                  Final Result
                </span>

                <strong>
                  31 Aug 2026
                </strong>

              </div>

            </div>

          </section>

        </main>

      </div>

    </div>
  );
}

export default DriveDetails;
