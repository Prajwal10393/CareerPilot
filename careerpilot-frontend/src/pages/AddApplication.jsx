import { Link } from "react-router-dom";

function AddApplication() {
  return (
    <div className="applications-page">
      <section className="applications-hero">
        <div>
          <span className="applications-label">
            APPLICATION TRACKER
          </span>

          <h1>Add Application</h1>

          <p>
            Add a new job application to your
            CareerPilot placement tracker.
          </p>
        </div>

        <Link
          to="/applications"
          className="applications-back-btn"
        >
          Back to Applications
        </Link>
      </section>

      <section className="application-form-card">
        <h2>New Application</h2>

        <form>
          <div className="application-form-grid">
            <div>
              <label>Company Name</label>
              <input
                type="text"
                placeholder="Example: TCS"
                required
              />
            </div>

            <div>
              <label>Job Role</label>
              <input
                type="text"
                placeholder="Graduate Engineer"
                required
              />
            </div>

            <div>
              <label>Location</label>
              <input
                type="text"
                placeholder="Bengaluru"
              />
            </div>

            <div>
              <label>Package</label>
              <input
                type="text"
                placeholder="Example: 5 LPA"
              />
            </div>

            <div>
              <label>Application Date</label>
              <input type="date" />
            </div>

            <div>
              <label>Status</label>

              <select>
                <option>Applied</option>
                <option>Shortlisted</option>
                <option>Interview</option>
                <option>Selected</option>
                <option>Rejected</option>
              </select>
            </div>
          </div>

          <div className="application-form-actions">
            <Link to="/applications">
              Cancel
            </Link>

            <button type="submit">
              Add Application
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default AddApplication;
