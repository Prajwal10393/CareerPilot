import {
  useEffect,
  useMemo,
  useState
} from "react";

import { Link, useNavigate } from "react-router-dom";
import PortalLayout from "../components/PortalLayout";
import "../App.css";

const API_URL = "http://localhost:5000";

function AdminResults() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [results, setResults] = useState([]);
  const [students, setStudents] = useState([]);

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [showForm, setShowForm] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [selectedResult, setSelectedResult] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const emptyForm = {
    student: "",
    company: "",
    role: "",
    package: "",
    location: "",
    resultStatus: "Selected",
    joiningDate: "",
    remarks: ""
  };

  const [form, setForm] =
    useState(emptyForm);

  // =========================================================
  // LOAD STUDENTS + RESULTS
  // =========================================================

  const loadData = async () => {
    const currentToken =
      localStorage.getItem("token");

    if (!currentToken) {
      navigate("/admin-login");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const headers = {
        Authorization: `Bearer ${currentToken}`
      };

      const [
        studentsResponse,
        resultsResponse
      ] = await Promise.all([
        fetch(
          `${API_URL}/api/admin/students`,
          { headers }
        ),

        fetch(
          `${API_URL}/api/results`,
          { headers }
        )
      ]);

      const studentsData =
        await studentsResponse.json();

      const resultsData =
        await resultsResponse.json();

      if (!studentsResponse.ok) {
        if (
          studentsResponse.status === 401 ||
          studentsResponse.status === 403
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("role");

          navigate("/admin-login");
          return;
        }

        throw new Error(
          studentsData.message ||
            "Unable to load students."
        );
      }

      if (!resultsResponse.ok) {
        if (
          resultsResponse.status === 401 ||
          resultsResponse.status === 403
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("role");

          navigate("/admin-login");
          return;
        }

        throw new Error(
          resultsData.message ||
            "Unable to load placement results."
        );
      }

      setStudents(
        studentsData.students || []
      );

      setResults(
        resultsData.results || []
      );
    } catch (err) {
      setError(
        err.message ||
          "Unable to load placement results."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/admin-login");
      return;
    }

    loadData();

    window.scrollTo(0, 0);
  }, [token]);

  // =========================================================
  // FORM
  // =========================================================

  const handleChange = (event) => {
    const { name, value } =
      event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));

    setError("");
    setMessage("");
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleAddResult = () => {
    setForm(emptyForm);

    setEditingId(null);
    setSelectedResult(null);

    setError("");
    setMessage("");

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleEdit = (item) => {
    setEditingId(item._id);

    setForm({
      student:
        item.student?._id ||
        item.student ||
        "",

      company:
        item.company || "",

      role:
        item.role || "",

      package:
        item.package || "",

      location:
        item.location || "",

      resultStatus:
        item.resultStatus ||
        "Selected",

      joiningDate:
        item.joiningDate
          ? new Date(
              item.joiningDate
            )
              .toISOString()
              .split("T")[0]
          : "",

      remarks:
        item.remarks || ""
    });

    setSelectedResult(null);
    setShowForm(true);

    setError("");
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // =========================================================
  // ADD / UPDATE RESULT
  // =========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !form.student ||
      !form.company.trim() ||
      !form.role.trim() ||
      !form.resultStatus
    ) {
      setError(
        "Student, company, role and result status are required."
      );

      return;
    }

    const currentToken =
      localStorage.getItem("token");

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const url = editingId
        ? `${API_URL}/api/results/${editingId}`
        : `${API_URL}/api/results`;

      const response = await fetch(
        url,
        {
          method: editingId
            ? "PUT"
            : "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${currentToken}`
          },

          body: JSON.stringify({
            student: form.student,

            company:
              form.company.trim(),

            role:
              form.role.trim(),

            package:
              form.package.trim(),

            location:
              form.location.trim(),

            resultStatus:
              form.resultStatus,

            joiningDate:
              form.joiningDate ||
              null,

            remarks:
              form.remarks.trim()
          })
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to save placement result."
        );
      }

      setMessage(
        editingId
          ? "Placement result updated successfully."
          : "Placement result published successfully."
      );

      resetForm();

      await loadData();

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (err) {
      setError(
        err.message ||
          "Unable to save placement result."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // DELETE RESULT
  // =========================================================

  const handleDelete = async (item) => {
    const studentName =
      item.student?.name ||
      "this student";

    const confirmed =
      window.confirm(
        `Delete placement result for ${studentName}?`
      );

    if (!confirmed) {
      return;
    }

    const currentToken =
      localStorage.getItem("token");

    try {
      setError("");
      setMessage("");

      const response =
        await fetch(
          `${API_URL}/api/results/${item._id}`,
          {
            method: "DELETE",

            headers: {
              Authorization:
                `Bearer ${currentToken}`
            }
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to delete result."
        );
      }

      setSelectedResult(null);

      setMessage(
        "Placement result deleted successfully."
      );

      await loadData();

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (err) {
      setError(
        err.message ||
          "Unable to delete result."
      );
    }
  };

  // =========================================================
  // FILTER
  // =========================================================

  const filteredResults =
    useMemo(() => {
      if (statusFilter === "All") {
        return results;
      }

      return results.filter(
        (item) =>
          item.resultStatus ===
          statusFilter
      );
    }, [
      results,
      statusFilter
    ]);

  // =========================================================
  // STATISTICS
  // =========================================================

  const selectedCount =
    results.filter(
      (item) =>
        item.resultStatus ===
        "Selected"
    ).length;

  const rejectedCount =
    results.filter(
      (item) =>
        item.resultStatus ===
        "Rejected"
    ).length;

  const shortlistedCount =
    results.filter(
      (item) =>
        item.resultStatus ===
        "Shortlisted"
    ).length;

  const waitingCount =
    results.filter(
      (item) =>
        item.resultStatus ===
        "Waiting"
    ).length;

  const placementRate =
    results.length > 0
      ? Math.round(
          (selectedCount /
            results.length) *
            100
        )
      : 0;

  // =========================================================
  // HELPERS
  // =========================================================

  const formatDate = (date) => {
    if (!date) {
      return "Not Available";
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

  const getStudentName = (
    result
  ) => {
    return (
      result.student?.name ||
      "Unknown Student"
    );
  };

  const getStudentEmail = (
    result
  ) => {
    return (
      result.student?.email ||
      "Email not available"
    );
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <PortalLayout
        title="Placement Results"
        subtitle="Publish student placement results and track selections."
      >
        <div className="admin-common-loading">
          Loading placement results...
        </div>
      </PortalLayout>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <PortalLayout
      title="Placement Results"
      subtitle="Publish student placement results and track selections."
    >
      <div className="admin-results-page admin-results-common">

        {/* ACTION BAR */}

        <section className="admin-result-actionbar">

          <div>
            <span>
              PLACEMENT MANAGEMENT
            </span>

            <h2>
              Student Placement Results
            </h2>

            <p>
              Publish placement outcomes
              and track student selections.
            </p>
          </div>

          <button
            type="button"
            className="admin-primary-btn"
            onClick={handleAddResult}
          >
            + Publish Result
          </button>

        </section>

        {/* MESSAGES */}

        {error && (
          <div className="admin-error">
            {error}
          </div>
        )}

        {message && (
          <div className="admin-success-message">
            {message}
          </div>
        )}

        {/* STATS */}

        <section className="admin-result-stats-grid">

          <div className="admin-result-stat-card">
            <span>
              Results
            </span>

            <strong>
              {results.length}
            </strong>

            <small>
              Published results
            </small>
          </div>

          <div className="admin-result-stat-card">
            <span>
              Selected
            </span>

            <strong>
              {selectedCount}
            </strong>

            <small>
              Successful candidates
            </small>
          </div>

          <div className="admin-result-stat-card">
            <span>
              Shortlisted
            </span>

            <strong>
              {shortlistedCount}
            </strong>

            <small>
              Candidates shortlisted
            </small>
          </div>

          <div className="admin-result-stat-card">
            <span>
              Placement Rate
            </span>

            <strong>
              {placementRate}%
            </strong>

            <small>
              Current selection rate
            </small>
          </div>

        </section>

        {/* ADD / EDIT FORM */}

        {showForm && (
          <section className="admin-result-form-card">

            <div className="admin-result-form-heading">

              <div>
                <span className="admin-label">
                  {editingId
                    ? "UPDATE RESULT"
                    : "NEW RESULT"}
                </span>

                <h2>
                  {editingId
                    ? "Edit Placement Result"
                    : "Publish Placement Result"}
                </h2>

                <p>
                  Select a registered student
                  and enter placement information.
                </p>
              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={resetForm}
              >
                ×
              </button>

            </div>

            <form
              className="admin-result-form"
              onSubmit={handleSubmit}
            >

              {/* STUDENT */}

              <div className="admin-result-form-section">

                <div className="admin-result-form-section-title">

                  <span>
                    01
                  </span>

                  <div>
                    <h3>
                      Student Information
                    </h3>

                    <p>
                      Select a registered
                      CareerPilot student.
                    </p>
                  </div>

                </div>

                <div className="admin-result-form-grid">

                  <div className="admin-result-field full-width">

                    <label>
                      Student
                    </label>

                    <select
                      name="student"
                      value={form.student}
                      onChange={handleChange}
                      required
                    >
                      <option value="">
                        Select Student
                      </option>

                      {students.map(
                        (student) => (
                          <option
                            key={student._id}
                            value={student._id}
                          >
                            {student.name}
                            {" — "}
                            {student.email}
                          </option>
                        )
                      )}
                    </select>

                  </div>

                </div>

              </div>

              {/* JOB INFORMATION */}

              <div className="admin-result-form-section">

                <div className="admin-result-form-section-title">

                  <span>
                    02
                  </span>

                  <div>
                    <h3>
                      Job Information
                    </h3>

                    <p>
                      Enter company, role,
                      package and location.
                    </p>
                  </div>

                </div>

                <div className="admin-result-form-grid">

                  <div className="admin-result-field">
                    <label>
                      Company
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

                  <div className="admin-result-field">
                    <label>
                      Job Role
                    </label>

                    <input
                      type="text"
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      placeholder="Graduate Engineer"
                      required
                    />
                  </div>

                  <div className="admin-result-field">
                    <label>
                      Package
                    </label>

                    <input
                      type="text"
                      name="package"
                      value={form.package}
                      onChange={handleChange}
                      placeholder="Example: 7 LPA"
                    />
                  </div>

                  <div className="admin-result-field">
                    <label>
                      Location
                    </label>

                    <input
                      type="text"
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      placeholder="Bengaluru"
                    />
                  </div>

                </div>

              </div>

              {/* RESULT */}

              <div className="admin-result-form-section">

                <div className="admin-result-form-section-title">

                  <span>
                    03
                  </span>

                  <div>
                    <h3>
                      Placement Result
                    </h3>

                    <p>
                      Configure result status
                      and joining information.
                    </p>
                  </div>

                </div>

                <div className="admin-result-form-grid">

                  <div className="admin-result-field">

                    <label>
                      Result Status
                    </label>

                    <select
                      name="resultStatus"
                      value={form.resultStatus}
                      onChange={handleChange}
                    >
                      <option value="Selected">
                        Selected
                      </option>

                      <option value="Shortlisted">
                        Shortlisted
                      </option>

                      <option value="Waiting">
                        Waiting
                      </option>

                      <option value="Rejected">
                        Rejected
                      </option>
                    </select>

                  </div>

                  <div className="admin-result-field">

                    <label>
                      Joining Date
                    </label>

                    <input
                      type="date"
                      name="joiningDate"
                      value={form.joiningDate}
                      onChange={handleChange}
                    />

                  </div>

                  <div className="admin-result-field full-width">

                    <label>
                      Remarks
                    </label>

                    <textarea
                      name="remarks"
                      value={form.remarks}
                      onChange={handleChange}
                      placeholder="Optional remarks..."
                      rows="4"
                    />

                  </div>

                </div>

              </div>

              <div className="admin-result-form-actions">

                <button
                  type="button"
                  className="admin-modal-secondary"
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
                    ? "Save Changes"
                    : "Publish Result"}
                </button>

              </div>

            </form>

          </section>
        )}

        {/* RESULT DIRECTORY */}

        <section className="admin-results-main-card">

          <div className="admin-results-heading">

            <div>
              <span className="admin-label">
                RESULT DIRECTORY
              </span>

              <h2>
                Student Placement Results
              </h2>

              <p>
                {filteredResults.length}{" "}
                {filteredResults.length === 1
                  ? "result"
                  : "results"}{" "}
                displayed
              </p>
            </div>

            <div className="admin-result-status-filter">

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
                <option value="All">
                  All Results
                </option>

                <option value="Selected">
                  Selected
                </option>

                <option value="Shortlisted">
                  Shortlisted
                </option>

                <option value="Waiting">
                  Waiting
                </option>

                <option value="Rejected">
                  Rejected
                </option>
              </select>

            </div>

          </div>

          {filteredResults.length > 0 ? (

            <div className="admin-results-table-wrapper">

              <table className="admin-results-table">

                <thead>
                  <tr>
                    <th>
                      Student
                    </th>

                    <th>
                      Company & Role
                    </th>

                    <th>
                      Package
                    </th>

                    <th>
                      Result
                    </th>

                    <th>
                      Joining Date
                    </th>

                    <th>
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {filteredResults.map(
                    (item) => (

                      <tr key={item._id}>

                        <td>

                          <div className="admin-result-student">

                            <div className="admin-result-avatar">
                              {getStudentName(
                                item
                              )
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>
                              <strong>
                                {getStudentName(
                                  item
                                )}
                              </strong>

                              <span>
                                {getStudentEmail(
                                  item
                                )}
                              </span>
                            </div>

                          </div>

                        </td>

                        <td>

                          <div className="admin-result-company">

                            <strong>
                              {item.company}
                            </strong>

                            <span>
                              {item.role}
                            </span>

                            <small>
                              {item.location ||
                                "Location not specified"}
                            </small>

                          </div>

                        </td>

                        <td>

                          <strong className="admin-result-package">
                            {item.package ||
                              "Not Available"}
                          </strong>

                        </td>

                        <td>

                          <span
                            className={`admin-result-status ${
                              item.resultStatus
                                ?.toLowerCase() ||
                              ""
                            }`}
                          >
                            {item.resultStatus}
                          </span>

                        </td>

                        <td>

                          <span className="admin-result-date">
                            {formatDate(
                              item.joiningDate
                            )}
                          </span>

                        </td>

                        <td>

                          <div className="admin-result-actions">

                            <button
                              type="button"
                              className="admin-view-btn"
                              onClick={() =>
                                setSelectedResult(
                                  item
                                )
                              }
                            >
                              View
                            </button>

                            <button
                              type="button"
                              className="admin-edit-btn"
                              onClick={() =>
                                handleEdit(
                                  item
                                )
                              }
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="admin-delete-btn"
                              onClick={() =>
                                handleDelete(
                                  item
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

            <div className="admin-results-empty">

              <h3>
                No results found
              </h3>

              <p>
                No placement results match
                the selected status.
              </p>

              <button
                type="button"
                onClick={() =>
                  setStatusFilter("All")
                }
              >
                Clear Filter
              </button>

            </div>

          )}

        </section>

        {/* SUMMARY */}

        <section className="admin-result-insight-card">

          <div>

            <span className="admin-label">
              PLACEMENT SUMMARY
            </span>

            <h2>
              {selectedCount} students selected
            </h2>

            <p>
              {shortlistedCount} shortlisted,{" "}
              {waitingCount} waiting and{" "}
              {rejectedCount} rejected.
            </p>

          </div>

          <Link
            to="/admin/analytics"
            className="admin-primary-btn"
          >
            View Analytics
          </Link>

        </section>

        {/* RESULT DETAILS MODAL */}

        {selectedResult && (

          <div className="admin-result-modal-overlay">

            <div className="admin-result-modal">

              <div className="admin-result-modal-header">

                <div>
                  <span className="admin-label">
                    PLACEMENT RESULT
                  </span>

                  <h2>
                    {getStudentName(
                      selectedResult
                    )}
                  </h2>

                  <p>
                    {getStudentEmail(
                      selectedResult
                    )}
                  </p>
                </div>

                <button
                  type="button"
                  className="admin-modal-close"
                  onClick={() =>
                    setSelectedResult(
                      null
                    )
                  }
                >
                  ×
                </button>

              </div>

              <div className="admin-result-modal-result">

                <span
                  className={`admin-result-status ${
                    selectedResult.resultStatus
                      ?.toLowerCase() ||
                    ""
                  }`}
                >
                  {selectedResult.resultStatus}
                </span>

                {selectedResult.resultStatus ===
                  "Selected" && (

                  <strong>
                    {selectedResult.package ||
                      "Package not specified"}
                  </strong>

                )}

              </div>

              <div className="admin-result-modal-grid">

                <div>
                  <span>
                    Company
                  </span>

                  <strong>
                    {selectedResult.company}
                  </strong>
                </div>

                <div>
                  <span>
                    Job Role
                  </span>

                  <strong>
                    {selectedResult.role}
                  </strong>
                </div>

                <div>
                  <span>
                    Location
                  </span>

                  <strong>
                    {selectedResult.location ||
                      "Not Available"}
                  </strong>
                </div>

                <div>
                  <span>
                    Package
                  </span>

                  <strong>
                    {selectedResult.package ||
                      "Not Available"}
                  </strong>
                </div>

                <div>
                  <span>
                    Joining Date
                  </span>

                  <strong>
                    {formatDate(
                      selectedResult.joiningDate
                    )}
                  </strong>
                </div>

                <div>
                  <span>
                    Published Date
                  </span>

                  <strong>
                    {formatDate(
                      selectedResult.createdAt
                    )}
                  </strong>
                </div>

              </div>

              {selectedResult.remarks && (

                <div className="admin-result-remarks">

                  <strong>
                    Remarks
                  </strong>

                  <p>
                    {selectedResult.remarks}
                  </p>

                </div>

              )}

              <div className="admin-result-modal-actions">

                <button
                  type="button"
                  className="admin-modal-secondary"
                  onClick={() =>
                    setSelectedResult(
                      null
                    )
                  }
                >
                  Close
                </button>

                <button
                  type="button"
                  className="admin-edit-btn"
                  onClick={() =>
                    handleEdit(
                      selectedResult
                    )
                  }
                >
                  Edit Result
                </button>

              </div>

            </div>

          </div>

        )}

      </div>
    </PortalLayout>
  );
}

export default AdminResults;
