import {
  useEffect,
  useMemo,
  useState
} from "react";

import { useNavigate } from "react-router-dom";
import PortalLayout from "../components/PortalLayout";
import "../App.css";

const API_URL = "https://careerpilot-wxja.onrender.com";

function AdminReports() {
  const navigate = useNavigate();

  const [students, setStudents] =
    useState([]);

  const [companies, setCompanies] =
    useState([]);

  const [drives, setDrives] =
    useState([]);

  const [results, setResults] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =========================================================
  // LOAD REPORT DATA
  // =========================================================

  useEffect(() => {
    const loadReports = async () => {
      const token =
        localStorage.getItem("token");

      if (!token) {
        navigate("/admin-login");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const headers = {
          Authorization:
            `Bearer ${token}`
        };

        const [
          studentsResponse,
          companiesResponse,
          drivesResponse,
          resultsResponse
        ] = await Promise.all([
          fetch(
            `${API_URL}/api/admin/students`,
            { headers }
          ),

          fetch(
            `${API_URL}/api/companies`,
            { headers }
          ),

          fetch(
            `${API_URL}/api/drives`,
            { headers }
          ),

          fetch(
            `${API_URL}/api/results`,
            { headers }
          )
        ]);

        const studentsData =
          await studentsResponse.json();

        const companiesData =
          await companiesResponse.json();

        const drivesData =
          await drivesResponse.json();

        const resultsData =
          await resultsResponse.json();

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

        if (!studentsResponse.ok) {
          throw new Error(
            studentsData.message ||
              "Unable to load students."
          );
        }

        if (!companiesResponse.ok) {
          throw new Error(
            companiesData.message ||
              "Unable to load companies."
          );
        }

        if (!drivesResponse.ok) {
          throw new Error(
            drivesData.message ||
              "Unable to load drives."
          );
        }

        if (!resultsResponse.ok) {
          throw new Error(
            resultsData.message ||
              "Unable to load results."
          );
        }

        setStudents(
          studentsData.students || []
        );

        setCompanies(
          companiesData.companies ||
            companiesData.data ||
            []
        );

        setDrives(
          drivesData.drives || []
        );

        setResults(
          resultsData.results || []
        );
      } catch (err) {
        setError(
          err.message ||
            "Unable to load report data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadReports();

    window.scrollTo(0, 0);
  }, [navigate]);

  // =========================================================
  // CALCULATIONS
  // =========================================================

  const report = useMemo(() => {
    const selected =
      results.filter(
        (result) =>
          result.resultStatus ===
          "Selected"
      ).length;

    const shortlisted =
      results.filter(
        (result) =>
          result.resultStatus ===
          "Shortlisted"
      ).length;

    const waiting =
      results.filter(
        (result) =>
          result.resultStatus ===
          "Waiting"
      ).length;

    const rejected =
      results.filter(
        (result) =>
          result.resultStatus ===
          "Rejected"
      ).length;

    const openDrives =
      drives.filter(
        (drive) =>
          drive.status === "Open"
      ).length;

    const upcomingDrives =
      drives.filter(
        (drive) =>
          drive.status ===
          "Upcoming"
      ).length;

    const closedDrives =
      drives.filter(
        (drive) =>
          drive.status === "Closed"
      ).length;

    const activeCompanies =
      companies.filter(
        (company) =>
          company.status === "Active"
      ).length;

    const placementRate =
      students.length > 0
        ? Math.round(
            (selected /
              students.length) *
              100
          )
        : 0;

    return {
      selected,
      shortlisted,
      waiting,
      rejected,
      openDrives,
      upcomingDrives,
      closedDrives,
      activeCompanies,
      placementRate
    };
  }, [
    students,
    companies,
    drives,
    results
  ]);

  // =========================================================
  // CSV DOWNLOAD
  // =========================================================

  const downloadCSV = (
    filename,
    rows
  ) => {
    if (!rows.length) {
      alert("No data available.");
      return;
    }

    const headers =
      Object.keys(rows[0]);

    const csvRows = [
      headers.join(","),

      ...rows.map((row) =>
        headers
          .map((header) => {
            const value =
              row[header] ?? "";

            return `"${String(
              value
            ).replace(
              /"/g,
              '""'
            )}"`;
          })
          .join(",")
      )
    ];

    const blob = new Blob(
      [csvRows.join("\n")],
      {
        type:
          "text/csv;charset=utf-8;"
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(
      link
    );

    link.click();

    document.body.removeChild(
      link
    );

    URL.revokeObjectURL(url);
  };

  // =========================================================
  // STUDENT REPORT
  // =========================================================

  const exportStudents = () => {
    const rows =
      students.map(
        (student) => ({
          Name:
            student.name || "",

          Email:
            student.email || "",

          Role:
            student.role || "",

          RegisteredDate:
            student.createdAt
              ? new Date(
                  student.createdAt
                ).toLocaleDateString()
              : ""
        })
      );

    downloadCSV(
      "careerpilot-students-report.csv",
      rows
    );
  };

  // =========================================================
  // COMPANY REPORT
  // =========================================================

  const exportCompanies = () => {
    const rows =
      companies.map(
        (company) => ({
          Company:
            company.name || "",

          Industry:
            company.industry || "",

          Location:
            company.location || "",

          Email:
            company.contactEmail || "",

          Status:
            company.status || ""
        })
      );

    downloadCSV(
      "careerpilot-companies-report.csv",
      rows
    );
  };

  // =========================================================
  // DRIVE REPORT
  // =========================================================

  const exportDrives = () => {
    const rows =
      drives.map(
        (drive) => ({
          Company:
            drive.company || "",

          Role:
            drive.role || "",

          Package:
            drive.package || "",

          Location:
            drive.location || "",

          JobType:
            drive.jobType || "",

          Status:
            drive.status || "",

          ApplicationDeadline:
            drive.applicationDeadline
              ? new Date(
                  drive.applicationDeadline
                ).toLocaleDateString()
              : "",

          DriveDate:
            drive.driveDate
              ? new Date(
                  drive.driveDate
                ).toLocaleDateString()
              : ""
        })
      );

    downloadCSV(
      "careerpilot-placement-drives-report.csv",
      rows
    );
  };

  // =========================================================
  // RESULT REPORT
  // =========================================================

  const exportResults = () => {
    const rows =
      results.map(
        (result) => ({
          Student:
            result.student?.name ||
            result.student?.email ||
            "",

          Company:
            result.company || "",

          Role:
            result.role || "",

          Package:
            result.package || "",

          Location:
            result.location || "",

          Result:
            result.resultStatus || "",

          JoiningDate:
            result.joiningDate
              ? new Date(
                  result.joiningDate
                ).toLocaleDateString()
              : ""
        })
      );

    downloadCSV(
      "careerpilot-placement-results-report.csv",
      rows
    );
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <PortalLayout
      title="Reports"
      subtitle="View placement statistics and export CareerPilot data."
    >
      <div className="admin-reports-common">

        {/* REPORT HEADER */}

        <section className="admin-report-actionbar">

          <div>
            <span>
              REPORT CENTER
            </span>

            <h2>
              Placement Reports
            </h2>

            <p>
              Review CareerPilot placement
              data and download reports.
            </p>
          </div>

          <div className="admin-report-rate">

            <span>
              PLACEMENT RATE
            </span>

            <strong>
              {report.placementRate}%
            </strong>

          </div>

        </section>

        {/* ERROR */}

        {error && (
          <div className="admin-error">
            {error}
          </div>
        )}

        {loading ? (

          <section className="admin-dashboard-card">

            <div className="admin-common-loading">
              Loading reports...
            </div>

          </section>

        ) : (
          <>

            {/* SUMMARY */}

            <section className="admin-report-grid">

              <div className="admin-report-stat">

                <span>
                  Students
                </span>

                <strong>
                  {students.length}
                </strong>

                <small>
                  Registered students
                </small>

              </div>

              <div className="admin-report-stat">

                <span>
                  Companies
                </span>

                <strong>
                  {companies.length}
                </strong>

                <small>
                  {report.activeCompanies}{" "}
                  active
                </small>

              </div>

              <div className="admin-report-stat">

                <span>
                  Placement Drives
                </span>

                <strong>
                  {drives.length}
                </strong>

                <small>
                  {report.openDrives} open
                </small>

              </div>

              <div className="admin-report-stat">

                <span>
                  Selected
                </span>

                <strong>
                  {report.selected}
                </strong>

                <small>
                  Placement results
                </small>

              </div>

              <div className="admin-report-stat">

                <span>
                  Placement Rate
                </span>

                <strong>
                  {report.placementRate}%
                </strong>

                <small>
                  Selected / students
                </small>

              </div>

            </section>

            {/* RESULT SUMMARY */}

            <section className="admin-dashboard-card admin-report-section">

              <div className="admin-card-heading">

                <div>
                  <span className="admin-detail-eyebrow">
                    RESULTS
                  </span>

                  <h2>
                    Placement Result Summary
                  </h2>

                  <p>
                    Current student placement
                    outcomes.
                  </p>
                </div>

              </div>

              <div className="admin-secondary-grid">

                <div className="admin-small-stat selected">

                  <span>
                    Selected
                  </span>

                  <strong>
                    {report.selected}
                  </strong>

                </div>

                <div className="admin-small-stat shortlisted">

                  <span>
                    Shortlisted
                  </span>

                  <strong>
                    {report.shortlisted}
                  </strong>

                </div>

                <div className="admin-small-stat waiting">

                  <span>
                    Waiting
                  </span>

                  <strong>
                    {report.waiting}
                  </strong>

                </div>

                <div className="admin-small-stat rejected">

                  <span>
                    Rejected
                  </span>

                  <strong>
                    {report.rejected}
                  </strong>

                </div>

              </div>

            </section>

            {/* DRIVE SUMMARY */}

            <section className="admin-dashboard-card admin-report-section">

              <div className="admin-card-heading">

                <div>
                  <span className="admin-detail-eyebrow">
                    DRIVES
                  </span>

                  <h2>
                    Placement Drive Summary
                  </h2>

                  <p>
                    Current drive status
                    distribution.
                  </p>
                </div>

              </div>

              <div className="admin-secondary-grid">

                <div className="admin-small-stat open">

                  <span>
                    Open
                  </span>

                  <strong>
                    {report.openDrives}
                  </strong>

                </div>

                <div className="admin-small-stat upcoming">

                  <span>
                    Upcoming
                  </span>

                  <strong>
                    {report.upcomingDrives}
                  </strong>

                </div>

                <div className="admin-small-stat closed">

                  <span>
                    Closed
                  </span>

                  <strong>
                    {report.closedDrives}
                  </strong>

                </div>

              </div>

            </section>

            {/* EXPORT */}

            <section className="admin-dashboard-card admin-report-section">

              <div className="admin-card-heading">

                <div>
                  <span className="admin-detail-eyebrow">
                    EXPORT
                  </span>

                  <h2>
                    Export Reports
                  </h2>

                  <p>
                    Download project data
                    as CSV files.
                  </p>
                </div>

              </div>

              <div className="admin-export-grid">

                <div className="admin-export-card">

                  <div className="admin-export-icon">
                    ST
                  </div>

                  <h3>
                    Student Report
                  </h3>

                  <p>
                    Export registered
                    student information.
                  </p>

                  <span className="admin-export-count">
                    {students.length} records
                  </span>

                  <button
                    type="button"
                    onClick={
                      exportStudents
                    }
                  >
                    Download CSV
                  </button>

                </div>

                <div className="admin-export-card">

                  <div className="admin-export-icon">
                    CO
                  </div>

                  <h3>
                    Company Report
                  </h3>

                  <p>
                    Export placement
                    company information.
                  </p>

                  <span className="admin-export-count">
                    {companies.length} records
                  </span>

                  <button
                    type="button"
                    onClick={
                      exportCompanies
                    }
                  >
                    Download CSV
                  </button>

                </div>

                <div className="admin-export-card">

                  <div className="admin-export-icon">
                    DR
                  </div>

                  <h3>
                    Drive Report
                  </h3>

                  <p>
                    Export all placement
                    drive information.
                  </p>

                  <span className="admin-export-count">
                    {drives.length} records
                  </span>

                  <button
                    type="button"
                    onClick={
                      exportDrives
                    }
                  >
                    Download CSV
                  </button>

                </div>

                <div className="admin-export-card">

                  <div className="admin-export-icon">
                    RS
                  </div>

                  <h3>
                    Result Report
                  </h3>

                  <p>
                    Export student placement
                    results.
                  </p>

                  <span className="admin-export-count">
                    {results.length} records
                  </span>

                  <button
                    type="button"
                    onClick={
                      exportResults
                    }
                  >
                    Download CSV
                  </button>

                </div>

              </div>

            </section>

          </>
        )}

      </div>
    </PortalLayout>
  );
}

export default AdminReports;
