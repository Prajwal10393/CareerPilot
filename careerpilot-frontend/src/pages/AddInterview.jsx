import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "https://careerpilot-wxja.onrender.com";

function AddInterview() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    application: "",
    round: "",
    interviewType: "",
    interviewDate: "",
    interviewTime: "",
    mode: "",
    status: "Scheduled",
    location: "",
    meetingLink: "",
    interviewerName: "",
    notes: "",
  });

  /* ========================================
     LOAD APPLICATIONS
  ======================================== */

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/student/applications`,
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
          data.message || "Unable to load applications"
        );
      }

      setApplications(
        data.applications || data.data || []
      );
    } catch (err) {
      console.error(err);
    }
  };

  /* ========================================
     INPUT CHANGE
  ======================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* ========================================
     RELATED APPLICATION
  ======================================== */

  const handleApplicationChange = (e) => {
    const applicationId = e.target.value;

    const selectedApplication =
      applications.find(
        (application) =>
          application._id === applicationId
      );

    setFormData((previous) => ({
      ...previous,

      application: applicationId,

      company:
        selectedApplication?.company ||
        previous.company,

      role:
        selectedApplication?.role ||
        selectedApplication?.jobRole ||
        previous.role,
    }));
  };

  /* ========================================
     SUBMIT
  ======================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.company.trim()) {
      setError("Company name is required.");
      return;
    }

    if (!formData.role.trim()) {
      setError("Job role is required.");
      return;
    }

    if (!formData.round) {
      setError("Please select interview round.");
      return;
    }

    if (!formData.interviewDate) {
      setError("Please select interview date.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        company: formData.company.trim(),
        role: formData.role.trim(),

        round: formData.round,

        interviewType:
          formData.interviewType,

        interviewDate:
          formData.interviewDate,

        interviewTime:
          formData.interviewTime,

        mode: formData.mode,

        status:
          formData.status || "Scheduled",

        location:
          formData.location.trim(),

        meetingLink:
          formData.meetingLink.trim(),

        interviewerName:
          formData.interviewerName.trim(),

        notes:
          formData.notes.trim(),
      };

      if (formData.application) {
        payload.application =
          formData.application;
      }

      const response = await fetch(
        `${API_URL}/api/student/interviews`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to add interview"
        );
      }

      navigate("/interviews");
    } catch (err) {
      console.error(err);

      setError(
        err.message || "Unable to add interview"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-interview-page">

      {/* ========================================
          SEARCH BAR REMOVED
      ======================================== */}

      <div className="add-interview-page-header">
        <div>
          <h1>Add Interview</h1>

          <p>
            Schedule and track a new interview
            round.
          </p>
        </div>

        <Link
          to="/interviews"
          className="add-interview-back"
        >
          ← Back to Interviews
        </Link>
      </div>

      {error && (
        <div className="add-interview-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        {/* ========================================
            APPLICATION INFORMATION
        ======================================== */}

        <section className="add-interview-card">
          <h2>Application Information</h2>

          <div className="add-interview-grid">

            <div className="add-interview-field">
              <label>Company</label>

              <input
                type="text"
                name="company"
                placeholder="Example: Google"
                value={formData.company}
                onChange={handleChange}
                required
              />
            </div>

            <div className="add-interview-field">
              <label>Job Role</label>

              <input
                type="text"
                name="role"
                placeholder="Example: Software Engineer"
                value={formData.role}
                onChange={handleChange}
                required
              />
            </div>

            <div className="add-interview-field full-width">
              <label>Related Application</label>

              <select
                name="application"
                value={formData.application}
                onChange={
                  handleApplicationChange
                }
              >
                <option value="">
                  Select application
                </option>

                {applications.map(
                  (application) => (
                    <option
                      key={application._id}
                      value={application._id}
                    >
                      {application.company} -{" "}
                      {application.role ||
                        application.jobRole ||
                        "Role"}
                    </option>
                  )
                )}
              </select>
            </div>

          </div>
        </section>

        {/* ========================================
            INTERVIEW DETAILS
        ======================================== */}

        <section className="add-interview-card">
          <h2>Interview Details</h2>

          <div className="add-interview-grid">

            <div className="add-interview-field">
              <label>Interview Round</label>

              <select
                name="round"
                value={formData.round}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select round
                </option>

                <option value="Aptitude">
                  Aptitude
                </option>

                <option value="Technical Round 1">
                  Technical Round 1
                </option>

                <option value="Technical Round 2">
                  Technical Round 2
                </option>

                <option value="Coding Round">
                  Coding Round
                </option>

                <option value="Managerial">
                  Managerial
                </option>

                <option value="HR">
                  HR
                </option>

                <option value="Final">
                  Final
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </div>

            <div className="add-interview-field">
              <label>Interview Type</label>

              <select
                name="interviewType"
                value={
                  formData.interviewType
                }
                onChange={handleChange}
              >
                <option value="">
                  Select type
                </option>

                <option value="Technical">
                  Technical
                </option>

                <option value="HR">
                  HR
                </option>

                <option value="Coding">
                  Coding
                </option>

                <option value="Managerial">
                  Managerial
                </option>

                <option value="Aptitude">
                  Aptitude
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </div>

            <div className="add-interview-field">
              <label>Date</label>

              <input
                type="date"
                name="interviewDate"
                value={
                  formData.interviewDate
                }
                onChange={handleChange}
                required
              />
            </div>

            <div className="add-interview-field">
              <label>Time</label>

              <input
                type="time"
                name="interviewTime"
                value={
                  formData.interviewTime
                }
                onChange={handleChange}
              />
            </div>

            <div className="add-interview-field">
              <label>Mode</label>

              <select
                name="mode"
                value={formData.mode}
                onChange={handleChange}
              >
                <option value="">
                  Select mode
                </option>

                <option value="Online">
                  Online
                </option>

                <option value="Offline">
                  Offline
                </option>

                <option value="Hybrid">
                  Hybrid
                </option>
              </select>
            </div>

            <div className="add-interview-field">
              <label>Status</label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Scheduled">
                  Scheduled
                </option>

                <option value="Completed">
                  Completed
                </option>

                <option value="Selected">
                  Selected
                </option>

                <option value="Rejected">
                  Rejected
                </option>

                <option value="Cancelled">
                  Cancelled
                </option>
              </select>
            </div>

          </div>
        </section>

        {/* ========================================
            LOCATION / MEETING
        ======================================== */}

        <section className="add-interview-card">
          <h2>Location & Meeting</h2>

          <div className="add-interview-grid">

            <div className="add-interview-field">
              <label>Location</label>

              <input
                type="text"
                name="location"
                placeholder="Example: Bengaluru"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div className="add-interview-field">
              <label>Meeting Link</label>

              <input
                type="url"
                name="meetingLink"
                placeholder="https://..."
                value={
                  formData.meetingLink
                }
                onChange={handleChange}
              />
            </div>

            <div className="add-interview-field full-width">
              <label>
                Interviewer Name
              </label>

              <input
                type="text"
                name="interviewerName"
                placeholder="Enter interviewer name"
                value={
                  formData.interviewerName
                }
                onChange={handleChange}
              />
            </div>

          </div>
        </section>

        {/* ========================================
            NOTES
        ======================================== */}

        <section className="add-interview-card">
          <h2>Notes</h2>

          <div className="add-interview-field">
            <label>Interview Notes</label>

            <textarea
              name="notes"
              rows="5"
              placeholder="Add preparation notes, instructions or other details..."
              value={formData.notes}
              onChange={handleChange}
            />
          </div>
        </section>

        {/* ========================================
            BUTTONS
        ======================================== */}

        <div className="add-interview-actions">

          <button
            type="button"
            className="add-interview-cancel-btn"
            onClick={() =>
              navigate("/interviews")
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            className="add-interview-save-btn"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : "Save Interview"}
          </button>

        </div>

      </form>
    </div>
  );
}

export default AddInterview;
