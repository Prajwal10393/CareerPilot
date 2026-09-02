import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "../App.css";

const API_URL = "https://careerpilot-wxja.onrender.com";

function EditInterview() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const interviewId = searchParams.get("id");
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    interviewType: "Technical",
    round: "",
    interviewDate: "",
    mode: "Online",
    location: "",
    meetingLink: "",
    status: "Scheduled",
    result: "",
    notes: "",
  });

  // ==========================================
  // FORMAT DATE FOR datetime-local
  // ==========================================

  const formatDateTimeLocal = (date) => {
    if (!date) return "";

    const d = new Date(date);

    if (Number.isNaN(d.getTime())) {
      return "";
    }

    const pad = (num) =>
      String(num).padStart(2, "0");

    return `${d.getFullYear()}-${pad(
      d.getMonth() + 1
    )}-${pad(d.getDate())}T${pad(
      d.getHours()
    )}:${pad(d.getMinutes())}`;
  };

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
          setError("Interview ID not found.");
          return;
        }

        const response = await fetch(
          `${API_URL}/api/student/interviews/${interviewId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to load interview"
          );
        }

        const interview =
          data.interview || data.data || data;

        setFormData({
          company: interview.company || "",
          role: interview.role || "",
          interviewType:
            interview.interviewType ||
            "Technical",
          round:
            interview.round ||
            interview.roundName ||
            "",
          interviewDate:
            formatDateTimeLocal(
              interview.interviewDate
            ),
          mode:
            interview.mode ||
            interview.interviewMode ||
            "Online",
          location:
            interview.location || "",
          meetingLink:
            interview.meetingLink || "",
          status:
            interview.status === "Upcoming"
              ? "Scheduled"
              : interview.status ||
                "Scheduled",
          result:
            interview.result || "",
          notes:
            interview.notes || "",
        });
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
  }, [interviewId]);

  // ==========================================
  // HANDLE CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // UPDATE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.company.trim() ||
      !formData.role.trim() ||
      !formData.interviewDate
    ) {
      setError(
        "Company, job role and interview date are required."
      );
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API_URL}/api/student/interviews/${interviewId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            company: formData.company.trim(),
            role: formData.role.trim(),
            interviewType:
              formData.interviewType,
            round: formData.round.trim(),
            interviewDate:
              formData.interviewDate,
            mode: formData.mode,
            location:
              formData.location.trim(),
            meetingLink:
              formData.meetingLink.trim(),
            status: formData.status,
            result:
              formData.result.trim(),
            notes:
              formData.notes.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to update interview"
        );
      }

      setSuccess(
        "Interview updated successfully."
      );

      setTimeout(() => {
        navigate("/interviews");
      }, 800);
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Unable to update interview"
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="edit-interview-page">
        <div className="edit-interview-loading">
          Loading interview...
        </div>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="edit-interview-page">

      {/* HEADER */}

      <div className="edit-interview-header">
        <div>
          <div className="edit-interview-eyebrow">
            INTERVIEW MANAGEMENT
          </div>

          <h1>Edit Interview</h1>

          <p>
            Update interview schedule,
            interview round and preparation
            information.
          </p>
        </div>

        <Link
          to="/interviews"
          className="edit-interview-back"
        >
          ← Back to Interviews
        </Link>
      </div>

      {error && (
        <div className="edit-interview-error">
          {error}
        </div>
      )}

      {success && (
        <div className="edit-interview-success">
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="edit-interview-form"
      >

        {/* COMPANY */}

        <div className="edit-interview-card">
          <div className="edit-section-label">
            COMPANY DETAILS
          </div>

          <h2>
            Interview Information
          </h2>

          <div className="edit-form-grid">

            <div className="edit-form-group">
              <label>Company *</label>

              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Example: TCS"
                required
              />
            </div>

            <div className="edit-form-group">
              <label>Job Role *</label>

              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="Graduate Engineer Trainee"
                required
              />
            </div>

            <div className="edit-form-group">
              <label>
                Interview Type
              </label>

              <select
                name="interviewType"
                value={
                  formData.interviewType
                }
                onChange={handleChange}
              >
                <option value="Aptitude">
                  Aptitude
                </option>

                <option value="Technical">
                  Technical
                </option>

                <option value="Coding">
                  Coding
                </option>

                <option value="HR">
                  HR
                </option>

                <option value="Managerial">
                  Managerial
                </option>

                <option value="Group Discussion">
                  Group Discussion
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </div>

            <div className="edit-form-group">
              <label>
                Interview Round
              </label>

              <input
                type="text"
                name="round"
                value={formData.round}
                onChange={handleChange}
                placeholder="Technical Round 1"
              />
            </div>

            <div className="edit-form-group">
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
        </div>

        {/* DATE & TIME */}

        <div className="edit-interview-card">
          <div className="edit-section-label">
            SCHEDULE
          </div>

          <h2>Date & Time</h2>

          <div className="edit-form-grid">

            <div className="edit-form-group">
              <label>
                Interview Date & Time *
              </label>

              <input
                type="datetime-local"
                name="interviewDate"
                value={
                  formData.interviewDate
                }
                onChange={handleChange}
                required
              />
            </div>

            <div className="edit-form-group">
              <label>Mode</label>

              <select
                name="mode"
                value={formData.mode}
                onChange={handleChange}
              >
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

            <div className="edit-form-group">
              <label>Location</label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Bengaluru / Mysore"
              />
            </div>

            <div className="edit-form-group">
              <label>
                Meeting Link
              </label>

              <input
                type="url"
                name="meetingLink"
                value={
                  formData.meetingLink
                }
                onChange={handleChange}
                placeholder="https://meet..."
              />
            </div>

          </div>
        </div>

        {/* ADDITIONAL INFORMATION */}

        <div className="edit-interview-card">
          <div className="edit-section-label">
            INTERVIEW DETAILS
          </div>

          <h2>
            Result & Notes
          </h2>

          <div className="edit-form-grid">

            <div className="edit-form-group">
              <label>Result</label>

              <input
                type="text"
                name="result"
                value={formData.result}
                onChange={handleChange}
                placeholder="Optional result"
              />
            </div>

            <div className="edit-form-group edit-full-width">
              <label>Notes</label>

              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="5"
                placeholder="Add preparation notes..."
              />
            </div>

          </div>
        </div>

        {/* BUTTONS */}

        <div className="edit-interview-actions">

          <Link
            to="/interviews"
            className="edit-cancel-btn"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="edit-save-btn"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>

        </div>

      </form>

    </div>
  );
}

export default EditInterview;
