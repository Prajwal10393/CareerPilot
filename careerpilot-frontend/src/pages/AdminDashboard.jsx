import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import PortalLayout from "../components/PortalLayout";
import "../App.css";

const API_URL = "https://careerpilot-wxja.onrender.com";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalAdmins: 0,
    totalApplications: 0,
    totalDrives: 0,
    openDrives: 0,
    totalOffers: 0,
    selectedStudents: 0,
    rejectedStudents: 0,
    shortlistedStudents: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // FETCH ADMIN DASHBOARD
  // =========================================================

  useEffect(() => {
    const loadDashboard = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/admin-login");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/admin/dashboard`,
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
              "Unable to load admin dashboard."
          );
        }

        setStats(data.stats || {});
      } catch (err) {
        setError(
          err.message ||
            "Unable to load admin dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
    window.scrollTo(0, 0);
  }, [navigate]);

  // =========================================================
  // CALCULATIONS
  // =========================================================

  const placementPercentage = useMemo(() => {
    if (!stats.totalStudents) {
      return 0;
    }

    return Math.min(
      Math.round(
        (stats.selectedStudents /
          stats.totalStudents) *
          100
      ),
      100
    );
  }, [
    stats.selectedStudents,
    stats.totalStudents
  ]);

  const resultTotal =
    stats.selectedStudents +
    stats.shortlistedStudents +
    stats.rejectedStudents;

  const selectedPercentage =
    resultTotal > 0
      ? Math.round(
          (stats.selectedStudents / resultTotal) *
            100
        )
      : 0;

  const shortlistedPercentage =
    resultTotal > 0
      ? Math.round(
          (stats.shortlistedStudents /
            resultTotal) *
            100
        )
      : 0;

  const rejectedPercentage =
    resultTotal > 0
      ? Math.round(
          (stats.rejectedStudents / resultTotal) *
            100
        )
      : 0;

  const openDrivePercentage =
    stats.totalDrives > 0
      ? Math.round(
          (stats.openDrives / stats.totalDrives) *
            100
        )
      : 0;

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <PortalLayout
        title="Admin Dashboard"
        subtitle="Monitor CareerPilot placement activities."
      >
        <div className="admin-common-loading">
          Loading admin dashboard...
        </div>
      </PortalLayout>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <PortalLayout
      title="Admin Dashboard"
      subtitle="Monitor students, placement drives, applications and placement results."
    >
      <div className="admin-dashboard-common">

        {error && (
          <div className="admin-error">
            {error}
          </div>
        )}

        {/* PRIMARY STATS */}

        <div className="admin-stats-grid">

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              👨‍🎓
            </div>

            <div>
              <span>Total Students</span>

              <strong>
                {stats.totalStudents}
              </strong>

              <p>Registered students</p>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              📝
            </div>

            <div>
              <span>Applications</span>

              <strong>
                {stats.totalApplications}
              </strong>

              <p>Total applications</p>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              🏢
            </div>

            <div>
              <span>Placement Drives</span>

              <strong>
                {stats.totalDrives}
              </strong>

              <p>
                {stats.openDrives} currently open
              </p>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              🎯
            </div>

            <div>
              <span>Selected Students</span>

              <strong>
                {stats.selectedStudents}
              </strong>

              <p>
                {placementPercentage}% placement rate
              </p>
            </div>
          </div>

        </div>

        {/* SECONDARY STATS */}

        <div className="admin-secondary-grid">

          <div className="admin-small-stat">
            <span>Total Offers</span>
            <strong>{stats.totalOffers}</strong>
          </div>

          <div className="admin-small-stat">
            <span>Open Drives</span>
            <strong>{stats.openDrives}</strong>
          </div>

          <div className="admin-small-stat">
            <span>Shortlisted</span>
            <strong>
              {stats.shortlistedStudents}
            </strong>
          </div>

          <div className="admin-small-stat">
            <span>Rejected</span>
            <strong>
              {stats.rejectedStudents}
            </strong>
          </div>

          <div className="admin-small-stat">
            <span>Administrators</span>
            <strong>{stats.totalAdmins}</strong>
          </div>

        </div>

        {/* ANALYTICS */}

        <div className="admin-dashboard-grid">

          {/* PLACEMENT OVERVIEW */}

          <section className="admin-dashboard-card">

            <div className="admin-card-heading">

              <div>
                <h2>
                  Placement Overview
                </h2>

                <p>
                  Current result distribution
                </p>
              </div>

              <Link to="/admin/results">
                View Results
              </Link>

            </div>

            <div className="admin-progress-list">

              <div>
                <div className="admin-progress-heading">
                  <span>Selected</span>

                  <strong>
                    {stats.selectedStudents}
                  </strong>
                </div>

                <div className="admin-progress">
                  <span
                    style={{
                      width:
                        `${selectedPercentage}%`
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="admin-progress-heading">
                  <span>Shortlisted</span>

                  <strong>
                    {stats.shortlistedStudents}
                  </strong>
                </div>

                <div className="admin-progress">
                  <span
                    style={{
                      width:
                        `${shortlistedPercentage}%`
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="admin-progress-heading">
                  <span>Rejected</span>

                  <strong>
                    {stats.rejectedStudents}
                  </strong>
                </div>

                <div className="admin-progress">
                  <span
                    style={{
                      width:
                        `${rejectedPercentage}%`
                    }}
                  />
                </div>
              </div>

            </div>

          </section>

          {/* DRIVE ACTIVITY */}

          <section className="admin-dashboard-card">

            <div className="admin-card-heading">

              <div>
                <h2>Drive Activity</h2>

                <p>
                  Current placement-drive activity
                </p>
              </div>

              <Link to="/admin/drives">
                Manage Drives
              </Link>

            </div>

            <div className="admin-drive-overview">

              <div
                className="admin-placement-circle"
                style={{
                  background: `conic-gradient(
                    #3155d9 0% ${openDrivePercentage}%,
                    #e9edf5 ${openDrivePercentage}% 100%
                  )`
                }}
              >
                <div>
                  <strong>
                    {stats.openDrives}
                  </strong>

                  <span>Open</span>
                </div>
              </div>

              <div className="admin-drive-numbers">

                <div>
                  <span>Total Drives</span>
                  <strong>
                    {stats.totalDrives}
                  </strong>
                </div>

                <div>
                  <span>Open Drives</span>
                  <strong>
                    {stats.openDrives}
                  </strong>
                </div>

                <div>
                  <span>Open Rate</span>
                  <strong>
                    {openDrivePercentage}%
                  </strong>
                </div>

              </div>

            </div>

          </section>

        </div>

        {/* PLACEMENT RATE */}

        <section className="admin-placement-banner">

          <div>
            <span>
              OVERALL PLACEMENT
            </span>

            <h2>
              {placementPercentage}% Placement Rate
            </h2>

            <p>
              {stats.selectedStudents} out of{" "}
              {stats.totalStudents} registered
              students currently have a selected
              placement result.
            </p>
          </div>

          <div
            className="admin-placement-circle"
            style={{
              background: `conic-gradient(
                #ffffff 0% ${placementPercentage}%,
                rgba(255,255,255,0.20)
                ${placementPercentage}% 100%
              )`
            }}
          >
            <div>
              <strong>
                {placementPercentage}%
              </strong>

              <span>Placed</span>
            </div>
          </div>

        </section>

        {/* QUICK ACTIONS */}

        <section className="admin-dashboard-card">

          <div className="admin-card-heading">

            <div>
              <h2>Quick Actions</h2>

              <p>
                Manage CareerPilot modules
              </p>
            </div>

          </div>

          <div className="admin-quick-grid">

            <Link to="/admin/students">
              <span>👨‍🎓</span>

              <div>
                <strong>
                  Manage Students
                </strong>

                <small>
                  View student profiles
                </small>
              </div>
            </Link>

            <Link to="/admin/companies">
              <span>🏢</span>

              <div>
                <strong>
                  Manage Companies
                </strong>

                <small>
                  Add and update companies
                </small>
              </div>
            </Link>

            <Link to="/admin/drives">
              <span>📢</span>

              <div>
                <strong>
                  Placement Drives
                </strong>

                <small>
                  Create and manage drives
                </small>
              </div>
            </Link>

            <Link to="/admin/results">
              <span>🏆</span>

              <div>
                <strong>
                  Placement Results
                </strong>

                <small>
                  Publish student results
                </small>
              </div>
            </Link>

            <Link to="/admin/analytics">
              <span>📊</span>

              <div>
                <strong>Analytics</strong>

                <small>
                  View placement metrics
                </small>
              </div>
            </Link>

            <Link to="/admin/reports">
              <span>📄</span>

              <div>
                <strong>Reports</strong>

                <small>
                  Generate placement reports
                </small>
              </div>
            </Link>

          </div>

        </section>

      </div>
    </PortalLayout>
  );
}

export default AdminDashboard;
