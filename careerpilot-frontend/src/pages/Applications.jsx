import {
  useEffect,
  useMemo,
  useState
} from "react";

import { Link } from "react-router-dom";
import PortalLayout from "../components/PortalLayout";
import "../App.css";

const API_URL = "http://localhost:5000";

function Applications() {
  const token =
    localStorage.getItem("token");

  const [applications, setApplications] =
    useState([]);

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [showForm, setShowForm] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [form, setForm] = useState({
    company: "",
    role: "",
    location: "",
    package: "",
    jobType: "Full Time",
    appliedDate: "",
    deadline: "",
    status: "Applied",
    source: "Other",
    jobLink: "",
    notes: ""
  });

  const statuses = [
    "All",
    "Applied",
    "Shortlisted",
    "Online Test",
    "Interview",
    "Offer",
    "Rejected",
    "Withdrawn"
  ];

  const jobTypes = [
    "Full Time",
    "Internship",
    "Contract",
    "Part Time"
  ];

  const sources = [
    "LinkedIn",
    "Company Website",
    "Campus",
    "Referral",
    "Job Portal",
    "Other"
  ];

  // =========================================================
  // DATE HELPERS
  // =========================================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );
  };

  const dateForInput = (date) => {
    if (!date) {
      return "";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "";
    }

    return parsedDate
      .toISOString()
      .split("T")[0];
  };

  // =========================================================
  // FETCH APPLICATIONS
  // =========================================================

  const fetchApplications =
    async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await fetch(
            `${API_URL}/api/student/applications`,
            {
              method: "GET",

              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load applications"
          );
        }

        setApplications(
          data.applications || []
        );
      } catch (error) {
        setError(
          error.message
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    if (token) {
      fetchApplications();
    } else {
      setError(
        "Login required to view applications."
      );

      setLoading(false);
    }

    window.scrollTo(0, 0);
  }, [token]);

  // =========================================================
  // FILTER
  // =========================================================

  const filteredApplications =
    useMemo(() => {
      return applications.filter(
        (application) => {
          return (
            statusFilter === "All" ||
            application.status ===
              statusFilter
          );
        }
      );
    }, [
      applications,
      statusFilter
    ]);

  // =========================================================
  // STATS
  // =========================================================

  const stats = useMemo(() => {
    return {
      total:
        applications.length,

      active:
        applications.filter(
          (application) =>
            ![
              "Rejected",
              "Offer",
              "Withdrawn"
            ].includes(
              application.status
            )
        ).length,

      interviews:
        applications.filter(
          (application) =>
            application.status ===
              "Interview" ||
            application.status ===
              "Shortlisted"
        ).length,

      offers:
        applications.filter(
          (application) =>
            application.status ===
            "Offer"
        ).length
    };
  }, [applications]);

  // =========================================================
  // FORM CHANGE
  // =========================================================

  const handleChange = (
    event
  ) => {
    const {
      name,
      value
    } = event.target;

    setForm(
      (previous) => ({
        ...previous,
        [name]: value
      })
    );

    setError("");
  };

  // =========================================================
  // RESET FORM
  // =========================================================

  const resetForm = () => {
    setForm({
      company: "",
      role: "",
      location: "",
      package: "",
      jobType: "Full Time",
      appliedDate: "",
      deadline: "",
      status: "Applied",
      source: "Other",
      jobLink: "",
      notes: ""
    });

    setEditingId(null);
    setShowForm(false);
  };

  // =========================================================
  // ADD APPLICATION
  // =========================================================

  const handleAddApplication =
    () => {
      resetForm();

      setShowForm(true);
      setError("");
      setMessage("");

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    };

  // =========================================================
  // EDIT APPLICATION
  // =========================================================

  const handleEdit = (
    application
  ) => {
    setEditingId(
      application._id
    );

    setForm({
      company:
        application.company ||
        "",

      role:
        application.role ||
        "",

      location:
        application.location ||
        "",

      package:
        application.package ||
        "",

      jobType:
        application.jobType ||
        "Full Time",

      appliedDate:
        dateForInput(
          application.appliedDate
        ),

      deadline:
        dateForInput(
          application.deadline
        ),

      status:
        application.status ||
        "Applied",

      source:
        application.source ||
        "Other",

      jobLink:
        application.jobLink ||
        "",

      notes:
        application.notes ||
        ""
    });

    setShowForm(true);
    setError("");
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // =========================================================
  // SAVE APPLICATION
  // =========================================================

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      if (
        !form.company.trim() ||
        !form.role.trim()
      ) {
        setError(
          "Company and role are required."
        );

        return;
      }

      try {
        setSaving(true);
        setError("");
        setMessage("");

        const url =
          editingId
            ? `${API_URL}/api/student/applications/${editingId}`
            : `${API_URL}/api/student/applications`;

        const payload = {
          company:
            form.company,

          role:
            form.role,

          package:
            form.package,

          location:
            form.location,

          jobType:
            form.jobType,

          status:
            form.status,

          source:
            form.source,

          jobLink:
            form.jobLink,

          notes:
            form.notes
        };

        if (
          form.appliedDate
        ) {
          payload.appliedDate =
            form.appliedDate;
        }

        if (
          form.deadline
        ) {
          payload.deadline =
            form.deadline;
        }

        const response =
          await fetch(
            url,
            {
              method:
                editingId
                  ? "PUT"
                  : "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`
              },

              body:
                JSON.stringify(
                  payload
                )
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to save application"
          );
        }

        setMessage(
          editingId
            ? "Application updated successfully."
            : "Application added successfully."
        );

        resetForm();

        await fetchApplications();

        setTimeout(() => {
          setMessage("");
        }, 2500);
      } catch (error) {
        setError(
          error.message
        );
      } finally {
        setSaving(false);
      }
    };

  // =========================================================
  // DELETE APPLICATION
  // =========================================================

  const handleDelete =
    async (id) => {
      const confirmed =
        window.confirm(
          "Are you sure you want to delete this application?"
        );

      if (!confirmed) {
        return;
      }

      try {
        setError("");
        setMessage("");

        const response =
          await fetch(
            `${API_URL}/api/student/applications/${id}`,
            {
              method: "DELETE",

              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to delete application"
          );
        }

        setMessage(
          "Application deleted successfully."
        );

        await fetchApplications();

        setTimeout(() => {
          setMessage("");
        }, 2500);
      } catch (error) {
        setError(
          error.message
        );
      }
    };

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <PortalLayout
      title="My Applications"
      subtitle="Track your job applications and placement progress."
    >
      <div className="applications-common-page">

        {/* =====================================================
            HERO
        ====================================================== */}

        <section className="applications-hero">

          <div>
            <span className="applications-label">
              PLACEMENT TRACKER
            </span>

            <h1>
              Job Applications
            </h1>

            <p>
              Track every application,
              online test, interview and
              offer from one place.
            </p>
          </div>

          <button
            type="button"
            className="applications-add-btn"
            onClick={
              handleAddApplication
            }
          >
            <span>+</span>
            Add Application
          </button>

        </section>

        {/* =====================================================
            MESSAGES
        ====================================================== */}

        {message && (
          <div className="applications-message">
            {message}
          </div>
        )}

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        {/* =====================================================
            STATS
        ====================================================== */}

        <section className="applications-stats">

          <div className="application-stat-card">
            <span>
              Total Applications
            </span>

            <strong>
              {loading
                ? "..."
                : stats.total}
            </strong>

            <small>
              All tracked applications
            </small>
          </div>

          <div className="application-stat-card">
            <span>
              Active
            </span>

            <strong>
              {loading
                ? "..."
                : stats.active}
            </strong>

            <small>
              Currently in progress
            </small>
          </div>

          <div className="application-stat-card">
            <span>
              Interviews
            </span>

            <strong>
              {loading
                ? "..."
                : stats.interviews}
            </strong>

            <small>
              Interview opportunities
            </small>
          </div>

          <div className="application-stat-card">
            <span>
              Offers
            </span>

            <strong>
              {loading
                ? "..."
                : stats.offers}
            </strong>

            <small>
              Offers received
            </small>
          </div>

        </section>

        {/* =====================================================
            FORM
        ====================================================== */}

        {showForm && (
          <section className="application-form-card">

            <div className="application-form-heading">
              <div>
                <span className="applications-label">
                  {editingId
                    ? "UPDATE APPLICATION"
                    : "NEW APPLICATION"}
                </span>

                <h2>
                  {editingId
                    ? "Edit Application"
                    : "Track New Application"}
                </h2>

                <p>
                  Add the latest details
                  about your placement
                  application.
                </p>
              </div>

              <button
                type="button"
                className="application-form-close"
                onClick={resetForm}
              >
                ×
              </button>
            </div>

            <form
              className="application-form"
              onSubmit={handleSubmit}
            >
              <div className="application-form-grid">

                <div className="application-field">
                  <label>
                    Company Name
                  </label>

                  <input
                    type="text"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Example: TCS"
                    required
                  />
                </div>

                <div className="application-field">
                  <label>
                    Job Role
                  </label>

                  <input
                    type="text"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    placeholder="Example: Graduate Engineer"
                    required
                  />
                </div>

                <div className="application-field">
                  <label>
                    Location
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Example: Bengaluru"
                  />
                </div>

                <div className="application-field">
                  <label>
                    Package
                  </label>

                  <input
                    type="text"
                    name="package"
                    value={form.package}
                    onChange={handleChange}
                    placeholder="Example: 4 LPA"
                  />
                </div>

                <div className="application-field">
                  <label>
                    Job Type
                  </label>

                  <select
                    name="jobType"
                    value={form.jobType}
                    onChange={handleChange}
                  >
                    {jobTypes.map(
                      (jobType) => (
                        <option
                          key={jobType}
                          value={jobType}
                        >
                          {jobType}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div className="application-field">
                  <label>
                    Status
                  </label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    {statuses
                      .filter(
                        (status) =>
                          status !==
                          "All"
                      )
                      .map(
                        (status) => (
                          <option
                            key={status}
                            value={status}
                          >
                            {status}
                          </option>
                        )
                      )}
                  </select>
                </div>

                <div className="application-field">
                  <label>
                    Applied Date
                  </label>

                  <input
                    type="date"
                    name="appliedDate"
                    value={
                      form.appliedDate
                    }
                    onChange={handleChange}
                  />
                </div>

                <div className="application-field">
                  <label>
                    Application Deadline
                  </label>

                  <input
                    type="date"
                    name="deadline"
                    value={
                      form.deadline
                    }
                    onChange={handleChange}
                  />
                </div>

                <div className="application-field">
                  <label>
                    Application Source
                  </label>

                  <select
                    name="source"
                    value={form.source}
                    onChange={handleChange}
                  >
                    {sources.map(
                      (source) => (
                        <option
                          key={source}
                          value={source}
                        >
                          {source}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div className="application-field">
                  <label>
                    Job Link
                  </label>

                  <input
                    type="url"
                    name="jobLink"
                    value={form.jobLink}
                    onChange={handleChange}
                    placeholder="Job application URL"
                  />
                </div>

                <div className="application-field application-field-full">
                  <label>
                    Notes
                  </label>

                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    maxLength="1000"
                    placeholder="Assessment details, interview notes, preparation reminders..."
                  />
                </div>

              </div>

              <div className="application-form-actions">

                <button
                  type="button"
                  className="application-cancel-btn"
                  onClick={resetForm}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="application-save-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Save Changes"
                    : "Add Application"}
                </button>

              </div>
            </form>

          </section>
        )}

        {/* =====================================================
            APPLICATION LIST
        ====================================================== */}

        <section className="applications-main-card">

          <div className="applications-toolbar applications-toolbar-no-search">

            <div>
              <h2>
                Applications
              </h2>

              <p className="applications-toolbar-text">
                Review and manage your
                placement applications.
              </p>
            </div>

            <div className="applications-filter">
              <label>
                Status
              </label>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
              >
                {statuses.map(
                  (status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>
                  )
                )}
              </select>
            </div>

          </div>

          <div className="applications-count">

            <span>
              {
                filteredApplications.length
              }{" "}
              applications
            </span>

            <Link to="/drives">
              Find Placement Drives →
            </Link>

          </div>

          {loading ? (
            <div className="applications-loading">
              Loading applications...
            </div>
          ) : filteredApplications.length >
            0 ? (

            <div className="applications-table-wrapper">

              <table className="applications-table">

                <thead>
                  <tr>
                    <th>
                      Company & Role
                    </th>

                    <th>
                      Package
                    </th>

                    <th>
                      Job Type
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Applied
                    </th>

                    <th>
                      Deadline
                    </th>

                    <th>
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredApplications.map(
                    (application) => (

                      <tr
                        key={
                          application._id
                        }
                      >
                        <td>
                          <div className="application-company-cell">

                            <div className="application-company-logo">
                              {application.company
                                ?.charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>
                              <strong>
                                {
                                  application.company
                                }
                              </strong>

                              <span>
                                {
                                  application.role
                                }
                              </span>

                              <small>
                                {
                                  application.location ||
                                  "-"
                                }
                              </small>
                            </div>

                          </div>
                        </td>

                        <td>
                          <strong className="application-package">
                            {application.package ||
                              "-"}
                          </strong>
                        </td>

                        <td>
                          {application.jobType ||
                            "-"}
                        </td>

                        <td>
                          <span
                            className={`application-status ${(
                              application.status ||
                              "Applied"
                            )
                              .toLowerCase()
                              .replaceAll(
                                " ",
                                "-"
                              )}`}
                          >
                            {
                              application.status
                            }
                          </span>
                        </td>

                        <td>
                          <span className="application-date">
                            {formatDate(
                              application.appliedDate
                            )}
                          </span>
                        </td>

                        <td>
                          <span className="application-date">
                            {formatDate(
                              application.deadline
                            )}
                          </span>
                        </td>

                        <td>
                          <div className="application-actions">

                            <button
                              type="button"
                              className="application-edit-btn"
                              onClick={() =>
                                handleEdit(
                                  application
                                )
                              }
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="application-delete-btn"
                              onClick={() =>
                                handleDelete(
                                  application._id
                                )
                              }
                            >
                              Delete
                            </button>

                          </div>
                        </td>
                      </tr>

                    )
                  )}
                </tbody>

              </table>

            </div>

          ) : (

            <div className="applications-empty">

              <div className="applications-empty-icon">
                ↗
              </div>

              <h3>
                No applications found
              </h3>

              <p>
                Change the status filter
                or add a new placement
                application.
              </p>

              <button
                type="button"
                onClick={
                  handleAddApplication
                }
              >
                Add Application
              </button>

            </div>

          )}

        </section>

      </div>
    </PortalLayout>
  );
}

export default Applications;
