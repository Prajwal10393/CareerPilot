import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

const API_URL = "https://careerpilot-wxja.onrender.com";

function AddOffer() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    application: "",
    package: "",
    baseSalary: "",
    location: "",
    workMode: "",
    bond: "",
    offerDate: "",
    joiningDate: "",
    status: "Received",
    notes: "",
  });

  // =========================================
  // LOAD APPLICATIONS
  // =========================================

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
      console.error(
        "Application load error:",
        err
      );
    }
  };

  // =========================================
  // INPUT CHANGE
  // =========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================
  // RELATED APPLICATION
  // =========================================

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

  // =========================================
  // SUBMIT OFFER
  // =========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // COMPANY

    if (!formData.company.trim()) {
      setError(
        "Company name is required."
      );
      return;
    }

    // ROLE

    if (!formData.role.trim()) {
      setError(
        "Job role is required."
      );
      return;
    }

    // CTC / PACKAGE

    if (!formData.package.trim()) {
      setError(
        "Total package / CTC is required."
      );
      return;
    }

    // CHECK NUMBER

    const ctcValue = Number(
      formData.package
    );

    if (
      Number.isNaN(ctcValue) ||
      ctcValue <= 0
    ) {
      setError(
        "Enter a valid CTC. Example: 5.5"
      );
      return;
    }

    // BASE SALARY CHECK

    if (formData.baseSalary) {
      const baseSalaryValue = Number(
        formData.baseSalary
      );

      if (
        Number.isNaN(baseSalaryValue) ||
        baseSalaryValue < 0
      ) {
        setError(
          "Enter a valid base salary."
        );
        return;
      }

      if (
        baseSalaryValue >
        ctcValue
      ) {
        setError(
          "Base salary cannot be greater than total package."
        );
        return;
      }
    }

    try {
      setLoading(true);

      // =====================================
      // IMPORTANT:
      // Backend requires field name "ctc"
      // =====================================

      const payload = {
        company:
          formData.company.trim(),

        role:
          formData.role.trim(),

        ctc:
          formData.package.trim(),

        baseSalary:
          formData.baseSalary
            ? formData.baseSalary.trim()
            : undefined,

        location:
          formData.location.trim(),

        workMode:
          formData.workMode ||
          undefined,

        bond:
          formData.bond.trim(),

        offerDate:
          formData.offerDate ||
          undefined,

        joiningDate:
          formData.joiningDate ||
          undefined,

        status:
          formData.status,

        notes:
          formData.notes.trim(),
      };

      // RELATED APPLICATION OPTIONAL

      if (formData.application) {
        payload.application =
          formData.application;
      }

      console.log(
        "Offer payload:",
        payload
      );

      const response = await fetch(
        `${API_URL}/api/student/offers`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body:
            JSON.stringify(payload),
        }
      );

      const data =
        await response.json();

      console.log(
        "Offer response:",
        data
      );

      if (response.status === 401) {
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
            "Unable to add offer"
        );
      }

      setSuccess(
        "Offer added successfully."
      );

      setTimeout(() => {
        navigate("/offers");
      }, 700);
    } catch (err) {
      console.error(
        "Offer save error:",
        err
      );

      setError(
        err.message ||
          "Unable to add offer"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // UI
  // =========================================

  return (
    <div className="add-offer-page">

      {/* ================= HEADER ================= */}

      <div className="add-offer-page-header">

        <div>
          <h1>Add Offer</h1>

          <p>
            Add and track a new placement
            offer.
          </p>
        </div>

        <Link
          to="/offers"
          className="add-offer-back"
        >
          ← Back to Offers
        </Link>

      </div>

      {/* ================= ERROR ================= */}

      {error && (
        <div className="add-offer-error">
          {error}
        </div>
      )}

      {/* ================= SUCCESS ================= */}

      {success && (
        <div
          style={{
            padding: "16px 20px",
            marginBottom: "20px",
            borderRadius: "10px",
            background: "#ecfdf5",
            border:
              "1px solid #bbf7d0",
            color: "#15803d",
            fontWeight: "700",
          }}
        >
          {success}
        </div>
      )}

      {/* ================= FORM ================= */}

      <form onSubmit={handleSubmit}>

        {/* =====================================
            COMPANY & ROLE
            ===================================== */}

        <section className="add-offer-card">

          <h2>
            Company &amp; Role
          </h2>

          <div className="add-offer-grid">

            {/* COMPANY */}

            <div className="add-offer-field">

              <label>
                Company *
              </label>

              <input
                type="text"
                name="company"
                placeholder="Example: IBM"
                value={
                  formData.company
                }
                onChange={
                  handleChange
                }
                required
              />

            </div>

            {/* ROLE */}

            <div className="add-offer-field">

              <label>
                Job Role *
              </label>

              <input
                type="text"
                name="role"
                placeholder="Example: Associate System Engineer"
                value={
                  formData.role
                }
                onChange={
                  handleChange
                }
                required
              />

            </div>

            {/* APPLICATION */}

            <div className="add-offer-field full-width">

              <label>
                Related Application
              </label>

              <select
                name="application"
                value={
                  formData.application
                }
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
                      key={
                        application._id
                      }
                      value={
                        application._id
                      }
                    >
                      {application.company}
                      {" - "}
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

        {/* =====================================
            OFFER DETAILS
            ===================================== */}

        <section className="add-offer-card">

          <h2>
            Offer Details
          </h2>

          <div className="add-offer-grid">

            {/* TOTAL PACKAGE */}

            <div className="add-offer-field">

              <label>
                Total Package / CTC (LPA) *
              </label>

              <input
                type="number"
                name="package"
                step="0.1"
                min="0"
                placeholder="Example: 5.5"
                value={
                  formData.package
                }
                onChange={
                  handleChange
                }
                required
              />

            </div>

            {/* BASE SALARY */}

            <div className="add-offer-field">

              <label>
                Base Salary (LPA)
              </label>

              <input
                type="number"
                name="baseSalary"
                step="0.1"
                min="0"
                placeholder="Example: 4.5"
                value={
                  formData.baseSalary
                }
                onChange={
                  handleChange
                }
              />

            </div>

            {/* OFFER DATE */}

            <div className="add-offer-field">

              <label>
                Offer Date
              </label>

              <input
                type="date"
                name="offerDate"
                value={
                  formData.offerDate
                }
                onChange={
                  handleChange
                }
              />

            </div>

            {/* JOINING DATE */}

            <div className="add-offer-field">

              <label>
                Joining Date
              </label>

              <input
                type="date"
                name="joiningDate"
                value={
                  formData.joiningDate
                }
                onChange={
                  handleChange
                }
              />

            </div>

            {/* STATUS */}

            <div className="add-offer-field">

              <label>
                Status
              </label>

              <select
                name="status"
                value={
                  formData.status
                }
                onChange={
                  handleChange
                }
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

          </div>

        </section>

        {/* =====================================
            ADDITIONAL INFORMATION
            ===================================== */}

        <section className="add-offer-card">

          <h2>
            Additional Information
          </h2>

          <div className="add-offer-grid">

            {/* LOCATION */}

            <div className="add-offer-field">

              <label>
                Location
              </label>

              <input
                type="text"
                name="location"
                placeholder="Example: Bengaluru"
                value={
                  formData.location
                }
                onChange={
                  handleChange
                }
              />

            </div>

            {/* WORK MODE */}

            <div className="add-offer-field">

              <label>
                Work Mode
              </label>

              <select
                name="workMode"
                value={
                  formData.workMode
                }
                onChange={
                  handleChange
                }
              >

                <option value="">
                  Select work mode
                </option>

                <option value="Onsite">
                  Onsite
                </option>

                <option value="Hybrid">
                  Hybrid
                </option>

                <option value="Remote">
                  Remote
                </option>

              </select>

            </div>

            {/* BOND */}

            <div className="add-offer-field full-width">

              <label>
                Bond / Service Agreement
              </label>

              <input
                type="text"
                name="bond"
                placeholder="Example: 1 year / No bond"
                value={
                  formData.bond
                }
                onChange={
                  handleChange
                }
              />

            </div>

            {/* NOTES */}

            <div className="add-offer-field full-width">

              <label>
                Notes
              </label>

              <textarea
                name="notes"
                rows="5"
                placeholder="Add additional information about this offer..."
                value={
                  formData.notes
                }
                onChange={
                  handleChange
                }
              />

            </div>

          </div>

        </section>

        {/* =====================================
            ACTION BUTTONS
            ===================================== */}

        <div className="add-offer-actions">

          <button
            type="button"
            className="add-offer-cancel-btn"
            onClick={() =>
              navigate("/offers")
            }
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="add-offer-save-btn"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : "Save Offer"}
          </button>

        </div>

      </form>

    </div>
  );
}

export default AddOffer;
