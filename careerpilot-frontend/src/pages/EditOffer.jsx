import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "../App.css";

const API_URL = "http://localhost:5000";

function EditOffer() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const offerId = searchParams.get("id");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    ctc: "",
    baseSalary: "",
    location: "",
    workMode: "Onsite",
    offerDate: "",
    joiningDate: "",
    decisionDeadline: "",
    status: "Received",
    bond: "",
    notes: "",
  });

  const token = localStorage.getItem("token");

  const formatDateForInput = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toISOString().split("T")[0];
  };

  useEffect(() => {
    const fetchOffer = async () => {
      if (!offerId) {
        setError("Offer ID not found.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/student/offers/${offerId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load offer.");
        }

        const offer = data.offer || data.data || data;

        setFormData({
          company: offer.company || "",
          role: offer.role || "",
          ctc: offer.ctc || "",
          baseSalary: offer.baseSalary || "",
          location: offer.location || "",
          workMode: offer.workMode || "Onsite",
          offerDate: formatDateForInput(offer.offerDate),
          joiningDate: formatDateForInput(offer.joiningDate),
          decisionDeadline: formatDateForInput(
            offer.decisionDeadline
          ),
          status: offer.status || "Received",
          bond: offer.bond || "",
          notes: offer.notes || "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOffer();
  }, [offerId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.company.trim()) {
      setError("Company name is required.");
      return;
    }

    if (!formData.role.trim()) {
      setError("Job role is required.");
      return;
    }

    if (!formData.ctc.trim()) {
      setError("CTC is required.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        company: formData.company.trim(),
        role: formData.role.trim(),
        ctc: formData.ctc.trim(),
        baseSalary: formData.baseSalary.trim(),
        location: formData.location.trim(),
        workMode: formData.workMode,
        offerDate: formData.offerDate || null,
        joiningDate: formData.joiningDate || null,
        decisionDeadline:
          formData.decisionDeadline || null,
        status: formData.status,
        bond: formData.bond.trim(),
        notes: formData.notes.trim(),
      };

      const response = await fetch(
        `${API_URL}/api/student/offers/${offerId}`,
        {
          method: "PUT",
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
          data.message || "Unable to update offer."
        );
      }

      setSuccess("Offer updated successfully.");

      setTimeout(() => {
        navigate("/offers");
      }, 700);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="content-card">
          <p>Loading offer...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <p className="section-label">
            OFFER MANAGEMENT
          </p>

          <h1>Edit Offer</h1>

          <p>
            Update company, compensation, joining
            and offer status information.
          </p>
        </div>

        <Link
          to="/offers"
          className="secondary-btn"
        >
          ← Back to Offers
        </Link>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {success && (
        <div className="success-message">
          {success}
        </div>
      )}

      <form
        className="form-card"
        onSubmit={handleSubmit}
      >
        <div className="form-section">
          <div className="form-section-header">
            <span className="step-number">
              01
            </span>

            <div>
              <h2>Company Information</h2>
              <p>
                Update company and job position
                information.
              </p>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Company Name *</label>

              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Example: IBM"
                required
              />
            </div>

            <div className="form-group">
              <label>Job Role *</label>

              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="Example: Software Engineer"
                required
              />
            </div>

            <div className="form-group">
              <label>Location</label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Example: Bengaluru"
              />
            </div>

            <div className="form-group">
              <label>Work Mode</label>

              <select
                name="workMode"
                value={formData.workMode}
                onChange={handleChange}
              >
                <option value="Onsite">
                  Onsite
                </option>

                <option value="On-site">
                  On-site
                </option>

                <option value="Hybrid">
                  Hybrid
                </option>

                <option value="Remote">
                  Remote
                </option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-section-header">
            <span className="step-number">
              02
            </span>

            <div>
              <h2>Compensation</h2>
              <p>
                Update CTC and base salary
                information.
              </p>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>CTC *</label>

              <input
                type="text"
                name="ctc"
                value={formData.ctc}
                onChange={handleChange}
                placeholder="Example: 600000"
                required
              />
            </div>

            <div className="form-group">
              <label>Base Salary</label>

              <input
                type="text"
                name="baseSalary"
                value={formData.baseSalary}
                onChange={handleChange}
                placeholder="Example: 500000"
              />
            </div>

            <div className="form-group">
              <label>Bond</label>

              <input
                type="text"
                name="bond"
                value={formData.bond}
                onChange={handleChange}
                placeholder="Example: 1 Year"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-section-header">
            <span className="step-number">
              03
            </span>

            <div>
              <h2>Important Dates</h2>
              <p>
                Manage offer, joining and response
                deadline dates.
              </p>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Offer Date</label>

              <input
                type="date"
                name="offerDate"
                value={formData.offerDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Joining Date</label>

              <input
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Decision Deadline</label>

              <input
                type="date"
                name="decisionDeadline"
                value={
                  formData.decisionDeadline
                }
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-section-header">
            <span className="step-number">
              04
            </span>

            <div>
              <h2>Offer Status</h2>
              <p>
                Update your current offer
                decision.
              </p>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Status</label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Received">
                  Received
                </option>

                <option value="Pending">
                  Pending
                </option>

                <option value="Accepted">
                  Accepted
                </option>

                <option value="Rejected">
                  Rejected
                </option>
              </select>
            </div>

            <div className="form-group full-width">
              <label>Notes</label>

              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add notes about this offer..."
                rows="5"
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <Link
            to="/offers"
            className="secondary-btn"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="primary-btn"
            disabled={saving}
          >
            {saving
              ? "Saving Changes..."
              : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditOffer;
