import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import PortalLayout from "../components/PortalLayout";
import "../App.css";

const API_URL = "http://localhost:5000";

const emptyForm = {
  company: "",
  role: "",
  description: "",
  package: "",
  location: "",
  jobType: "Full Time",
  applicationDeadline: "",
  driveDate: "",
  status: "Upcoming",
  minimumCgpa: "",
  maximumBacklogs: "",
  graduationYears: "",
  courses: "",
  requiredSkills: "",
  applicationLink: ""
};

function AdminDrives() {
  const navigate = useNavigate();

  const [drives, setDrives] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [statusFilter, setStatusFilter] = useState("All");

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================================================
  // LOAD DRIVES
  // =========================================================

  const loadDrives = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/admin-login");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/drives`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (
          response.status === 401 ||
          response.status === 403
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("role");

          navigate("/admin-login");
          return;
        }

        throw new Error(
          data.message ||
            "Unable to load placement drives."
        );
      }

      setDrives(data.drives || []);
    } catch (err) {
      setError(
        err.message ||
          "Unable to load placement drives."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDrives();
    window.scrollTo(0, 0);
  }, []);

  // =========================================================
  // FILTER
  // =========================================================

  const filteredDrives = useMemo(() => {
    if (statusFilter === "All") {
      return drives;
    }

    return drives.filter(
      (drive) => drive.status === statusFilter
    );
  }, [drives, statusFilter]);

  const openCount = drives.filter(
    (drive) => drive.status === "Open"
  ).length;

  const upcomingCount = drives.filter(
    (drive) => drive.status === "Upcoming"
  ).length;

  const closedCount = drives.filter(
    (drive) => drive.status === "Closed"
  ).length;

  // =========================================================
  // FORM
  // =========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value
    }));

    setError("");
    setSuccess("");
  };

  const handleAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setSuccess("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleEdit = (drive) => {
    setForm({
      company: drive.company || "",
      role: drive.role || "",
      description: drive.description || "",
      package: drive.package || "",
      location: drive.location || "",
      jobType: drive.jobType || "Full Time",

      applicationDeadline: drive.applicationDeadline
        ? new Date(drive.applicationDeadline)
            .toISOString()
            .split("T")[0]
        : "",

      driveDate: drive.driveDate
        ? new Date(drive.driveDate)
            .toISOString()
            .split("T")[0]
        : "",

      status: drive.status || "Upcoming",

      minimumCgpa:
        drive.eligibility?.minimumCgpa ?? "",

      maximumBacklogs:
        drive.eligibility?.maximumBacklogs ?? "",

      graduationYears:
        drive.eligibility?.graduationYears?.join(", ") ||
        "",

      courses:
        drive.eligibility?.courses?.join(", ") || "",

      requiredSkills:
        drive.eligibility?.requiredSkills?.join(", ") ||
        "",

      applicationLink: drive.applicationLink || ""
    });

    setEditingId(drive._id);
    setShowForm(true);
    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  // =========================================================
  // CREATE / UPDATE
  // =========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !form.company.trim() ||
      !form.role.trim() ||
      !form.applicationDeadline
    ) {
      setError(
        "Company, role and application deadline are required."
      );
      return;
    }

    const token = localStorage.getItem("token");

    const graduationYears = form.graduationYears
      .split(",")
      .map((item) => Number(item.trim()))
      .filter((item) => !Number.isNaN(item));

    const courses = form.courses
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const requiredSkills = form.requiredSkills
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const payload = {
      company: form.company.trim(),
      role: form.role.trim(),
      description: form.description.trim(),
      package: form.package.trim(),
      location: form.location.trim(),
      jobType: form.jobType,
      applicationDeadline: form.applicationDeadline,
      driveDate: form.driveDate || null,
      status: form.status,

      eligibility: {
        minimumCgpa:
          form.minimumCgpa === ""
            ? 0
            : Number(form.minimumCgpa),

        maximumBacklogs:
          form.maximumBacklogs === ""
            ? 0
            : Number(form.maximumBacklogs),

        graduationYears,
        courses,
        requiredSkills
      },

      applicationLink: form.applicationLink.trim()
    };

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const url = editingId
        ? `${API_URL}/api/drives/${editingId}`
        : `${API_URL}/api/drives`;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },

        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Unable to ${
              editingId ? "update" : "create"
            } placement drive.`
        );
      }

      setSuccess(
        editingId
          ? "Placement drive updated successfully."
          : "Placement drive created successfully."
      );

      resetForm();
      await loadDrives();
    } catch (err) {
      setError(
        err.message ||
          "Unable to save placement drive."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // CLOSE
  // =========================================================

  const handleCloseDrive = async (drive) => {
    if (drive.status === "Closed") {
      return;
    }

    const confirmed = window.confirm(
      `Close ${drive.company} - ${drive.role}?`
    );

    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem("token");

    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/api/drives/${drive._id}/close`,
        {
          method: "PATCH",

          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to close placement drive."
        );
      }

      setSuccess(
        "Placement drive closed successfully."
      );

      await loadDrives();
    } catch (err) {
      setError(
        err.message ||
          "Unable to close placement drive."
      );
    }
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = async (drive) => {
    const confirmed = window.confirm(
      `Delete ${drive.company} - ${drive.role}?`
    );

    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem("token");

    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/api/drives/${drive._id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to delete placement drive."
        );
      }

      setDrives((current) =>
        current.filter(
          (item) => item._id !== drive._id
        )
      );

      setSuccess(
        "Placement drive deleted successfully."
      );
    } catch (err) {
      setError(
        err.message ||
          "Unable to delete placement drive."
      );
    }
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <PortalLayout
      title="Placement Drives"
      subtitle="Create and manage placement opportunities for students."
    >
      <div className="admin-drives-common">

        {/* ACTION BAR */}

        <div className="admin-drive-actionbar">
          <div>
            <span>PLACEMENT MANAGEMENT</span>

            <h2>Placement Opportunities</h2>

            <p>
              Create drives and configure student
              eligibility requirements.
            </p>
          </div>

          <button
            type="button"
            className="admin-primary-btn"
            onClick={handleAdd}
          >
            + Add Drive
          </button>
        </div>

        {error && (
          <div className="admin-error">
            {error}
          </div>
        )}

        {success && (
          <div className="admin-success">
            {success}
          </div>
        )}

        {/* SUMMARY */}

        <div className="admin-drive-summary-grid">

          <div className="admin-drive-summary-card">
            <span>Total Drives</span>
            <strong>{drives.length}</strong>
            <p>All placement opportunities</p>
          </div>

          <div className="admin-drive-summary-card">
            <span>Open</span>
            <strong>{openCount}</strong>
            <p>Accepting applications</p>
          </div>

          <div className="admin-drive-summary-card">
            <span>Upcoming</span>
            <strong>{upcomingCount}</strong>
            <p>Scheduled opportunities</p>
          </div>

          <div className="admin-drive-summary-card">
            <span>Closed</span>
            <strong>{closedCount}</strong>
            <p>Completed drives</p>
          </div>

        </div>

        {/* FORM */}

        {showForm && (
          <section className="admin-dashboard-card admin-drive-form-card">

            <div className="admin-card-heading">

              <div>
                <span className="admin-detail-eyebrow">
                  {editingId
                    ? "EDIT DRIVE"
                    : "NEW DRIVE"}
                </span>

                <h2>
                  {editingId
                    ? "Edit Placement Drive"
                    : "Add Placement Drive"}
                </h2>

                <p>
                  Enter drive and eligibility
                  information.
                </p>
              </div>

              <button
                type="button"
                className="admin-close-details"
                onClick={resetForm}
              >
                Close
              </button>

            </div>

            <form
              className="admin-company-form"
              onSubmit={handleSubmit}
            >

              <div className="admin-form-grid">

                <div className="admin-form-group">
                  <label>Company *</label>

                  <input
                    type="text"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Example: TCS"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label>Role *</label>

                  <input
                    type="text"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    placeholder="Graduate Engineer"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label>Package</label>

                  <input
                    type="text"
                    name="package"
                    value={form.package}
                    onChange={handleChange}
                    placeholder="Example: 7 LPA"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Location</label>

                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Bengaluru"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Job Type</label>

                  <select
                    name="jobType"
                    value={form.jobType}
                    onChange={handleChange}
                  >
                    <option value="Full Time">
                      Full Time
                    </option>

                    <option value="Internship">
                      Internship
                    </option>

                    <option value="Contract">
                      Contract
                    </option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label>Status</label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option value="Upcoming">
                      Upcoming
                    </option>

                    <option value="Open">
                      Open
                    </option>

                    <option value="Closed">
                      Closed
                    </option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label>
                    Application Deadline *
                  </label>

                  <input
                    type="date"
                    name="applicationDeadline"
                    value={form.applicationDeadline}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label>Drive Date</label>

                  <input
                    type="date"
                    name="driveDate"
                    value={form.driveDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Minimum CGPA</label>

                  <input
                    type="number"
                    name="minimumCgpa"
                    value={form.minimumCgpa}
                    onChange={handleChange}
                    min="0"
                    max="10"
                    step="0.1"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Maximum Backlogs</label>

                  <input
                    type="number"
                    name="maximumBacklogs"
                    value={form.maximumBacklogs}
                    onChange={handleChange}
                    min="0"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Graduation Years</label>

                  <input
                    type="text"
                    name="graduationYears"
                    value={form.graduationYears}
                    onChange={handleChange}
                    placeholder="2026, 2027"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Courses</label>

                  <input
                    type="text"
                    name="courses"
                    value={form.courses}
                    onChange={handleChange}
                    placeholder="MCA, BCA, B.Tech"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Required Skills</label>

                  <input
                    type="text"
                    name="requiredSkills"
                    value={form.requiredSkills}
                    onChange={handleChange}
                    placeholder="Java, SQL, React"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Application Link</label>

                  <input
                    type="text"
                    name="applicationLink"
                    value={form.applicationLink}
                    onChange={handleChange}
                    placeholder="https://..."
                  />
                </div>

              </div>

              <div className="admin-form-group admin-form-full">
                <label>Description</label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="5"
                  maxLength="2000"
                  placeholder="Enter placement drive description..."
                />
              </div>

              <div className="admin-form-actions">

                <button
                  type="button"
                  className="admin-secondary-btn"
                  onClick={resetForm}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-primary-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Drive"
                    : "Create Drive"}
                </button>

              </div>

            </form>

          </section>
        )}

        {/* DRIVE LIST */}

        <section className="admin-dashboard-card admin-drive-list-card">

          <div className="admin-card-heading admin-drive-list-heading">

            <div>
              <h2>Placement Drives</h2>

              <p>
                {filteredDrives.length}{" "}
                {filteredDrives.length === 1
                  ? "drive"
                  : "drives"}{" "}
                displayed
              </p>
            </div>

            <div className="admin-drive-status-filter">

              <label>Status</label>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
              >
                <option value="All">
                  All Status
                </option>

                <option value="Upcoming">
                  Upcoming
                </option>

                <option value="Open">
                  Open
                </option>

                <option value="Closed">
                  Closed
                </option>
              </select>

            </div>

          </div>

          {loading ? (
            <div className="admin-common-loading">
              Loading drives...
            </div>
          ) : filteredDrives.length === 0 ? (
            <div className="admin-students-empty">
              <div>📢</div>
              <h3>No placement drives found</h3>
              <p>
                No drives match the selected status.
              </p>
            </div>
          ) : (
            <div className="admin-table-wrapper">

              <table className="admin-table">

                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Role</th>
                    <th>Package</th>
                    <th>Location</th>
                    <th>Deadline</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredDrives.map((drive) => (
                    <tr key={drive._id}>

                      <td>
                        <div className="admin-drive-company">
                          <div className="admin-drive-avatar">
                            {drive.company
                              ?.charAt(0)
                              ?.toUpperCase() || "C"}
                          </div>

                          <strong>
                            {drive.company}
                          </strong>
                        </div>
                      </td>

                      <td>{drive.role}</td>

                      <td>
                        {drive.package || "-"}
                      </td>

                      <td>
                        {drive.location || "-"}
                      </td>

                      <td>
                        {drive.applicationDeadline
                          ? new Date(
                              drive.applicationDeadline
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                      <td>
                        <span
                          className={`admin-status-badge ${
                            drive.status
                              ?.toLowerCase() || ""
                          }`}
                        >
                          {drive.status}
                        </span>
                      </td>

                      <td>
                        <div className="admin-table-actions">

                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(drive)
                            }
                          >
                            Edit
                          </button>

                          {drive.status !== "Closed" && (
                            <button
                              type="button"
                              onClick={() =>
                                handleCloseDrive(
                                  drive
                                )
                              }
                            >
                              Close
                            </button>
                          )}

                          <button
                            type="button"
                            className="danger"
                            onClick={() =>
                              handleDelete(drive)
                            }
                          >
                            Delete
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </section>

      </div>
    </PortalLayout>
  );
}

export default AdminDrives;
