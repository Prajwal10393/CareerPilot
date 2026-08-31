import {
  useEffect,
  useMemo,
  useState
} from "react";

import { useNavigate } from "react-router-dom";

import PortalLayout from "../components/PortalLayout";
import "../App.css";

const API_URL =
  "http://localhost:5000";

function AdminAnalytics() {
  const navigate =
    useNavigate();

  const [
    analytics,
    setAnalytics
  ] = useState(null);

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    error,
    setError
  ] = useState("");

  // =========================================================
  // LOAD ANALYTICS
  // =========================================================

  useEffect(() => {
    const loadAnalytics =
      async () => {
        const token =
          localStorage.getItem(
            "token"
          );

        if (!token) {
          navigate(
            "/admin-login"
          );

          return;
        }

        try {
          setLoading(true);
          setError("");

          const response =
            await fetch(
              `${API_URL}/api/admin/analytics`,
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
              response.status ===
                401 ||
              response.status ===
                403
            ) {
              localStorage.removeItem(
                "token"
              );

              localStorage.removeItem(
                "user"
              );

              localStorage.removeItem(
                "role"
              );

              navigate(
                "/admin-login"
              );

              return;
            }

            throw new Error(
              data.message ||
                "Unable to load admin analytics."
            );
          }

          setAnalytics(data);
        } catch (err) {
          setError(
            err.message ||
              "Unable to load admin analytics."
          );
        } finally {
          setLoading(false);
        }
      };

    loadAnalytics();

    window.scrollTo(
      0,
      0
    );
  }, [navigate]);

  // =========================================================
  // DATA
  // =========================================================

  const summary =
    analytics?.summary ||
    {};

  const results =
    analytics?.placementResults ||
    {};

  const driveStatus =
    analytics?.driveStatus ||
    {};

  const companyStatus =
    analytics?.companyStatus ||
    {};

  const applicationStatus =
    analytics?.applicationStatus ||
    {};

  const performance =
    analytics?.performance ||
    {};

  // =========================================================
  // RESULT TOTAL
  // =========================================================

  const resultTotal =
    useMemo(() => {
      return (
        Number(
          results.selected || 0
        ) +
        Number(
          results.shortlisted ||
            0
        ) +
        Number(
          results.waiting || 0
        ) +
        Number(
          results.rejected || 0
        )
      );
    }, [results]);

  const maxResultValue =
    Math.max(
      Number(
        results.selected || 0
      ),

      Number(
        results.shortlisted ||
          0
      ),

      Number(
        results.waiting || 0
      ),

      Number(
        results.rejected || 0
      ),

      1
    );

  const maxApplicationValue =
    Math.max(
      Number(
        applicationStatus.applied ||
          0
      ),

      Number(
        applicationStatus
          .shortlisted || 0
      ),

      Number(
        applicationStatus
          .interview || 0
      ),

      Number(
        applicationStatus
          .selected || 0
      ),

      Number(
        applicationStatus
          .rejected || 0
      ),

      1
    );

  // =========================================================
  // CALCULATED INSIGHTS
  // =========================================================

  const activeOpportunities =
    Number(
      driveStatus.open || 0
    ) +
    Number(
      driveStatus.upcoming || 0
    );

  const totalApplications =
    Number(
      summary.totalApplications ||
        0
    );

  const selectedStudents =
    Number(
      results.selected || 0
    );

  const placementRate =
    Number(
      performance.placementRate ||
        0
    );

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <PortalLayout
        title="Analytics"
        subtitle="Monitor CareerPilot placement performance and platform activity."
      >
        <div className="admin-common-loading">
          Loading analytics...
        </div>
      </PortalLayout>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <PortalLayout
      title="Analytics"
      subtitle="Monitor CareerPilot placement performance and platform activity."
    >
      <div className="admin-analytics-common">

        {/* ERROR */}

        {error && (
          <div className="admin-error">
            {error}
          </div>
        )}

        {/* ================================================
            HEADER
        ================================================ */}

        <section className="admin-analytics-actionbar">

          <div>

            <span>
              PLATFORM ANALYTICS
            </span>

            <h2>
              Placement Performance
            </h2>

            <p>
              Track students,
              applications, companies,
              placement drives and
              placement outcomes.
            </p>

          </div>

          <div className="admin-analytics-rate">

            <span>
              PLACEMENT RATE
            </span>

            <strong>
              {placementRate}%
            </strong>

          </div>

        </section>

        {/* ================================================
            SUMMARY
        ================================================ */}

        <section className="admin-analytics-summary-grid">

          <div className="admin-analytics-stat-card">

            <span>
              Total Students
            </span>

            <strong>
              {summary.totalStudents ||
                0}
            </strong>

            <small>
              Registered student
              accounts
            </small>

          </div>

          <div className="admin-analytics-stat-card">

            <span>
              Applications
            </span>

            <strong>
              {totalApplications}
            </strong>

            <small>
              Total applications
              tracked
            </small>

          </div>

          <div className="admin-analytics-stat-card">

            <span>
              Companies
            </span>

            <strong>
              {summary.totalCompanies ||
                0}
            </strong>

            <small>
              Placement companies
            </small>

          </div>

          <div className="admin-analytics-stat-card">

            <span>
              Placement Drives
            </span>

            <strong>
              {summary.totalDrives ||
                0}
            </strong>

            <small>
              Total placement drives
            </small>

          </div>

          <div className="admin-analytics-stat-card">

            <span>
              Offers
            </span>

            <strong>
              {summary.totalOffers ||
                0}
            </strong>

            <small>
              Offers recorded
            </small>

          </div>

        </section>

        {/* ================================================
            PLACEMENT PERFORMANCE
        ================================================ */}

        <section className="admin-dashboard-card admin-analytics-performance-card">

          <div className="admin-card-heading">

            <div>

              <span className="admin-detail-eyebrow">
                PERFORMANCE
              </span>

              <h2>
                Placement Performance
              </h2>

              <p>
                Overall placement and
                application outcomes.
              </p>

            </div>

            <div className="admin-placement-rate">

              <strong>
                {placementRate}%
              </strong>

              <span>
                Placement Rate
              </span>

            </div>

          </div>

          <div className="admin-analytics-grid-two">

            {/* RESULTS */}

            <div className="admin-analytics-chart-card">

              <div className="admin-analytics-chart-heading">

                <div>

                  <h3>
                    Placement Results
                  </h3>

                  <p>
                    Student result
                    distribution
                  </p>

                </div>

                <strong>
                  {resultTotal}
                </strong>

              </div>

              <div className="admin-analytics-bar-list">

                <AnalyticsBar
                  label="Selected"
                  value={
                    results.selected ||
                    0
                  }
                  max={
                    maxResultValue
                  }
                />

                <AnalyticsBar
                  label="Shortlisted"
                  value={
                    results.shortlisted ||
                    0
                  }
                  max={
                    maxResultValue
                  }
                />

                <AnalyticsBar
                  label="Waiting"
                  value={
                    results.waiting ||
                    0
                  }
                  max={
                    maxResultValue
                  }
                />

                <AnalyticsBar
                  label="Rejected"
                  value={
                    results.rejected ||
                    0
                  }
                  max={
                    maxResultValue
                  }
                />

              </div>

              <div className="admin-analytics-total">

                Total Results:{" "}
                <strong>
                  {resultTotal}
                </strong>

              </div>

            </div>

            {/* APPLICATION STATUS */}

            <div className="admin-analytics-chart-card">

              <div className="admin-analytics-chart-heading">

                <div>

                  <h3>
                    Application Status
                  </h3>

                  <p>
                    Application pipeline
                    distribution
                  </p>

                </div>

                <strong>
                  {totalApplications}
                </strong>

              </div>

              <div className="admin-analytics-bar-list">

                <AnalyticsBar
                  label="Applied"
                  value={
                    applicationStatus
                      .applied || 0
                  }
                  max={
                    maxApplicationValue
                  }
                />

                <AnalyticsBar
                  label="Shortlisted"
                  value={
                    applicationStatus
                      .shortlisted || 0
                  }
                  max={
                    maxApplicationValue
                  }
                />

                <AnalyticsBar
                  label="Interview"
                  value={
                    applicationStatus
                      .interview || 0
                  }
                  max={
                    maxApplicationValue
                  }
                />

                <AnalyticsBar
                  label="Selected"
                  value={
                    applicationStatus
                      .selected || 0
                  }
                  max={
                    maxApplicationValue
                  }
                />

                <AnalyticsBar
                  label="Rejected"
                  value={
                    applicationStatus
                      .rejected || 0
                  }
                  max={
                    maxApplicationValue
                  }
                />

              </div>

            </div>

          </div>

        </section>

        {/* ================================================
            DRIVE + COMPANY ACTIVITY
        ================================================ */}

        <div className="admin-analytics-grid-two">

          {/* DRIVE */}

          <section className="admin-dashboard-card">

            <div className="admin-card-heading">

              <div>

                <span className="admin-detail-eyebrow">
                  DRIVES
                </span>

                <h2>
                  Drive Activity
                </h2>

                <p>
                  Current placement-drive
                  status.
                </p>

              </div>

            </div>

            <div className="admin-analytics-metric-grid">

              <div className="admin-analytics-metric open">

                <span>
                  Open
                </span>

                <strong>
                  {driveStatus.open ||
                    0}
                </strong>

              </div>

              <div className="admin-analytics-metric upcoming">

                <span>
                  Upcoming
                </span>

                <strong>
                  {driveStatus.upcoming ||
                    0}
                </strong>

              </div>

              <div className="admin-analytics-metric closed">

                <span>
                  Closed
                </span>

                <strong>
                  {driveStatus.closed ||
                    0}
                </strong>

              </div>

            </div>

          </section>

          {/* COMPANY */}

          <section className="admin-dashboard-card">

            <div className="admin-card-heading">

              <div>

                <span className="admin-detail-eyebrow">
                  COMPANIES
                </span>

                <h2>
                  Company Activity
                </h2>

                <p>
                  Current company
                  participation status.
                </p>

              </div>

            </div>

            <div className="admin-analytics-metric-grid">

              <div className="admin-analytics-metric active">

                <span>
                  Active
                </span>

                <strong>
                  {companyStatus.active ||
                    0}
                </strong>

              </div>

              <div className="admin-analytics-metric inactive">

                <span>
                  Inactive
                </span>

                <strong>
                  {companyStatus.inactive ||
                    0}
                </strong>

              </div>

              <div className="admin-analytics-metric">

                <span>
                  Total
                </span>

                <strong>
                  {summary.totalCompanies ||
                    0}
                </strong>

              </div>

            </div>

          </section>

        </div>

        {/* ================================================
            INSIGHTS
        ================================================ */}

        <section className="admin-dashboard-card admin-analytics-insights-section">

          <div className="admin-card-heading">

            <div>

              <span className="admin-detail-eyebrow">
                INSIGHTS
              </span>

              <h2>
                Platform Insights
              </h2>

              <p>
                Quick overview of
                CareerPilot placement
                activity.
              </p>

            </div>

          </div>

          <div className="admin-analytics-insights-grid">

            <div className="admin-analytics-insight-card">

              <span>
                Student Placement
              </span>

              <strong>
                {selectedStudents}
              </strong>

              <p>
                Students currently
                recorded as selected.
              </p>

            </div>

            <div className="admin-analytics-insight-card">

              <span>
                Active Opportunities
              </span>

              <strong>
                {activeOpportunities}
              </strong>

              <p>
                Open and upcoming
                placement drives.
              </p>

            </div>

            <div className="admin-analytics-insight-card">

              <span>
                Active Companies
              </span>

              <strong>
                {companyStatus.active ||
                  0}
              </strong>

              <p>
                Companies currently
                marked active.
              </p>

            </div>

            <div className="admin-analytics-insight-card">

              <span>
                Placement Rate
              </span>

              <strong>
                {placementRate}%
              </strong>

              <p>
                Selected students
                compared with registered
                students.
              </p>

            </div>

          </div>

        </section>

      </div>
    </PortalLayout>
  );
}

// =========================================================
// ANALYTICS BAR
// =========================================================

function AnalyticsBar({
  label,
  value,
  max
}) {
  const percentage =
    max > 0
      ? Math.min(
          (Number(value) /
            max) *
            100,
          100
        )
      : 0;

  return (
    <div className="admin-analytics-bar-row">

      <div className="admin-analytics-bar-label">

        <span>
          {label}
        </span>

        <strong>
          {value}
        </strong>

      </div>

      <div className="admin-analytics-bar-track">

        <div
          className="admin-analytics-bar-fill"
          style={{
            width:
              `${percentage}%`
          }}
        />

      </div>

    </div>
  );
}

export default AdminAnalytics;
