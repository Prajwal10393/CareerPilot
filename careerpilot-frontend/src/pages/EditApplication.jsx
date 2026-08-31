import "../App.css";
import { Link, useNavigate, useParams } from "react-router-dom";

function EditApplication() {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleUpdate = (event) => {
    event.preventDefault();

    alert("Application updated successfully!");

    navigate(`/applications/${id}`);
  };

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

          <div className="add-application-heading">

            <div>

              <h1>
                Edit Application
              </h1>

              <p>
                Update your application information and status.
              </p>

            </div>

            <Link
              to={`/applications/${id}`}
              className="add-application-back"
            >
              ← Back to Application
            </Link>

          </div>

          <form
            className="add-application-card"
            onSubmit={handleUpdate}
          >

            <div className="add-application-section">

              <div className="add-section-heading">

                <h2>
                  Job Information
                </h2>

              </div>

              <div className="add-application-grid">

                <div className="add-form-group">

                  <label>
                    Company Name
                  </label>

                  <input
                    type="text"
                    defaultValue="Google"
                    required
                  />

                </div>

                <div className="add-form-group">

                  <label>
                    Job Role
                  </label>

                  <input
                    type="text"
                    defaultValue="Software Engineer"
                    required
                  />

                </div>

                <div className="add-form-group">

                  <label>
                    Package (LPA)
                  </label>

                  <input
                    type="number"
                    step="0.1"
                    defaultValue="22"
                  />

                </div>

                <div className="add-form-group">

                  <label>
                    Location
                  </label>

                  <input
                    type="text"
                    defaultValue="Bengaluru"
                  />

                </div>

                <div className="add-form-group">

                  <label>
                    Current Status
                  </label>

                  <select defaultValue="Interview">

                    <option>
                      Applied
                    </option>

                    <option>
                      Shortlisted
                    </option>

                    <option>
                      Online Test
                    </option>

                    <option>
                      Interview
                    </option>

                    <option>
                      HR Interview
                    </option>

                    <option>
                      Offer
                    </option>

                    <option>
                      Rejected
                    </option>

                  </select>

                </div>

                <div className="add-form-group">

                  <label>
                    Application Date
                  </label>

                  <input
                    type="date"
                    defaultValue="2026-08-03"
                  />

                </div>

                <div className="add-form-group full">

                  <label>
                    Notes
                  </label>

                  <textarea
                    rows="5"
                    defaultValue="Prepare Java, DSA, SQL, DBMS and system design basics before the next round."
                  />

                </div>

              </div>

            </div>

            <div className="add-application-actions">

              <button
                type="submit"
                className="save-application-btn"
              >
                Update Application
              </button>

              <Link
                to={`/applications/${id}`}
                className="cancel-application-btn"
              >
                Cancel
              </Link>

            </div>

          </form>

        </main>

      </div>

    </div>
  );
}

export default EditApplication;
