import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import PortalLayout from "../components/PortalLayout";
import "../App.css";

const API_URL = "https://careerpilot-wxja.onrender.com";

const emptyForm = {
  name: "",
  industry: "",
  location: "",
  website: "",
  contactEmail: "",
  description: "",
  status: "Active"
};

function AdminCompanies() {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [form, setForm] =
    useState(emptyForm);

  const [editingId, setEditingId] =
    useState(null);

  const [showForm, setShowForm] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // =========================================================
  // LOAD COMPANIES
  // =========================================================

  const loadCompanies = async () => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      navigate("/admin-login");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/companies`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      const data =
        await response.json();

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
            "Unable to load companies."
        );
      }

      setCompanies(
        data.companies ||
          data.data ||
          []
      );
    } catch (err) {
      setError(
        err.message ||
          "Unable to load companies."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
    window.scrollTo(0, 0);
  }, []);

  // =========================================================
  // FILTER
  // =========================================================

  const filteredCompanies =
    useMemo(() => {
      if (statusFilter === "All") {
        return companies;
      }

      return companies.filter(
        (company) =>
          company.status ===
          statusFilter
      );
    }, [
      companies,
      statusFilter
    ]);

  const activeCompanies =
    companies.filter(
      (company) =>
        company.status === "Active"
    ).length;

  const inactiveCompanies =
    companies.filter(
      (company) =>
        company.status === "Inactive"
    ).length;

  // =========================================================
  // FORM
  // =========================================================

  const handleChange = (event) => {
    const {
      name,
      value
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value
    }));

    setError("");
    setSuccess("");
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
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

  const handleEdit = (company) => {
    setForm({
      name:
        company.name || "",

      industry:
        company.industry || "",

      location:
        company.location || "",

      website:
        company.website || "",

      contactEmail:
        company.contactEmail || "",

      description:
        company.description || "",

      status:
        company.status || "Active"
    });

    setEditingId(company._id);
    setError("");
    setSuccess("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // =========================================================
  // CREATE / UPDATE
  // =========================================================

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      if (!form.name.trim()) {
        setError(
          "Company name is required."
        );
        return;
      }

      const token =
        localStorage.getItem(
          "token"
        );

      try {
        setSaving(true);
        setError("");
        setSuccess("");

        const url =
          editingId
            ? `${API_URL}/api/companies/${editingId}`
            : `${API_URL}/api/companies`;

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
                JSON.stringify({
                  name:
                    form.name.trim(),

                  industry:
                    form.industry.trim(),

                  location:
                    form.location.trim(),

                  website:
                    form.website.trim(),

                  contactEmail:
                    form.contactEmail.trim(),

                  description:
                    form.description.trim(),

                  status:
                    form.status
                })
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              `Unable to ${
                editingId
                  ? "update"
                  : "create"
              } company.`
          );
        }

        setSuccess(
          editingId
            ? "Company updated successfully."
            : "Company added successfully."
        );

        resetForm();

        await loadCompanies();
      } catch (err) {
        setError(
          err.message ||
            "Unable to save company."
        );
      } finally {
        setSaving(false);
      }
    };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete =
    async (company) => {
      const confirmed =
        window.confirm(
          `Delete ${company.name}?`
        );

      if (!confirmed) {
        return;
      }

      const token =
        localStorage.getItem(
          "token"
        );

      try {
        setError("");
        setSuccess("");

        const response =
          await fetch(
            `${API_URL}/api/companies/${company._id}`,
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
              "Unable to delete company."
          );
        }

        setCompanies(
          (current) =>
            current.filter(
              (item) =>
                item._id !==
                company._id
            )
        );

        setSuccess(
          "Company deleted successfully."
        );
      } catch (err) {
        setError(
          err.message ||
            "Unable to delete company."
        );
      }
    };

  // =========================================================
  // UI
  // =========================================================

  return (
    <PortalLayout
      title="Companies"
      subtitle="Add and manage companies participating in placement activities."
    >
      <div className="admin-companies-common">

        {/* ACTION BAR */}

        <div className="admin-company-actionbar">

          <div>
            <span>
              COMPANY MANAGEMENT
            </span>

            <h2>
              Placement Companies
            </h2>

            <p>
              Maintain company information
              used across placement drives.
            </p>
          </div>

          <button
            type="button"
            className="admin-primary-btn"
            onClick={handleAdd}
          >
            + Add Company
          </button>

        </div>

        {/* MESSAGES */}

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

        <div className="admin-company-summary-grid">

          <div className="admin-company-summary-card">
            <span>
              Total Companies
            </span>

            <strong>
              {companies.length}
            </strong>

            <p>
              Registered placement companies
            </p>
          </div>

          <div className="admin-company-summary-card">
            <span>Active</span>

            <strong>
              {activeCompanies}
            </strong>

            <p>
              Currently active companies
            </p>
          </div>

          <div className="admin-company-summary-card">
            <span>Inactive</span>

            <strong>
              {inactiveCompanies}
            </strong>

            <p>
              Inactive company records
            </p>
          </div>

        </div>

        {/* =====================================================
            ADD / EDIT FORM
        ====================================================== */}

        {showForm && (

          <section className="admin-dashboard-card admin-company-form-card">

            <div className="admin-card-heading">

              <div>

                <span className="admin-detail-eyebrow">
                  {editingId
                    ? "EDIT COMPANY"
                    : "NEW COMPANY"}
                </span>

                <h2>
                  {editingId
                    ? "Edit Company"
                    : "Add Company"}
                </h2>

                <p>
                  Enter the company
                  information below.
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

                  <label>
                    Company Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Example: IBM"
                    required
                  />

                </div>

                <div className="admin-form-group">

                  <label>
                    Industry
                  </label>

                  <input
                    type="text"
                    name="industry"
                    value={form.industry}
                    onChange={handleChange}
                    placeholder="Example: Information Technology"
                  />

                </div>

                <div className="admin-form-group">

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

                <div className="admin-form-group">

                  <label>
                    Contact Email
                  </label>

                  <input
                    type="email"
                    name="contactEmail"
                    value={
                      form.contactEmail
                    }
                    onChange={handleChange}
                    placeholder="careers@example.com"
                  />

                </div>

                <div className="admin-form-group">

                  <label>
                    Website
                  </label>

                  <input
                    type="text"
                    name="website"
                    value={form.website}
                    onChange={handleChange}
                    placeholder="Company website"
                  />

                </div>

                <div className="admin-form-group">

                  <label>Status</label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option value="Active">
                      Active
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>
                  </select>

                </div>

              </div>

              <div className="admin-form-group admin-form-full">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  value={
                    form.description
                  }
                  onChange={
                    handleChange
                  }
                  rows="5"
                  maxLength="1500"
                  placeholder="Enter company description..."
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
                    ? "Update Company"
                    : "Add Company"}
                </button>

              </div>

            </form>

          </section>

        )}

        {/* =====================================================
            COMPANY LIST
        ====================================================== */}

        <section className="admin-dashboard-card">

          <div className="admin-card-heading admin-company-list-heading">

            <div>
              <h2>Companies</h2>

              <p>
                {filteredCompanies.length}{" "}
                {filteredCompanies.length === 1
                  ? "company"
                  : "companies"}{" "}
                displayed
              </p>
            </div>

            <div className="admin-company-status-filter">

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
                  All
                </option>

                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>
              </select>

            </div>

          </div>

          {loading ? (

            <div className="admin-common-loading">
              Loading companies...
            </div>

          ) : filteredCompanies.length === 0 ? (

            <div className="admin-students-empty">

              <div>🏢</div>

              <h3>
                No companies found
              </h3>

              <p>
                No companies match the
                selected status.
              </p>

            </div>

          ) : (

            <div className="admin-table-wrapper">

              <table className="admin-table">

                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Industry</th>
                    <th>Location</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredCompanies.map(
                    (company) => (

                      <tr
                        key={
                          company._id
                        }
                      >

                        <td>

                          <div className="admin-company-name">

                            <div className="admin-company-avatar">
                              {company.name
                                ?.charAt(0)
                                ?.toUpperCase() ||
                                "C"}
                            </div>

                            <div>

                              <strong>
                                {
                                  company.name
                                }
                              </strong>

                              {company.website && (
                                <small>
                                  {
                                    company.website
                                  }
                                </small>
                              )}

                            </div>

                          </div>

                        </td>

                        <td>
                          {company.industry ||
                            "-"}
                        </td>

                        <td>
                          {company.location ||
                            "-"}
                        </td>

                        <td>
                          {company.contactEmail ||
                            "-"}
                        </td>

                        <td>

                          <span
                            className={`admin-status-badge ${
                              company.status ===
                              "Inactive"
                                ? "inactive"
                                : ""
                            }`}
                          >
                            {company.status}
                          </span>

                        </td>

                        <td>

                          <div className="admin-table-actions">

                            <button
                              type="button"
                              onClick={() =>
                                handleEdit(
                                  company
                                )
                              }
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="danger"
                              onClick={() =>
                                handleDelete(
                                  company
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

          )}

        </section>

      </div>
    </PortalLayout>
  );
}

export default AdminCompanies;
