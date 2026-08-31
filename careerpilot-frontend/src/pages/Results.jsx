import {
  useEffect,
  useMemo,
  useState
} from "react";

import { Link } from "react-router-dom";

import PortalLayout from "../components/PortalLayout";
import "../App.css";

const API_URL = "http://localhost:5000";

function Results() {
  const token =
    localStorage.getItem("token");

  const [results, setResults] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [filter, setFilter] =
    useState("All");

  const [
    selectedResult,
    setSelectedResult
  ] = useState(null);

  // =====================================================
  // LOAD RESULTS
  // =====================================================

  const loadResults = async () => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        throw new Error(
          "Please login to view your placement results."
        );
      }

      const response =
        await fetch(
          `${API_URL}/api/results/my-results`,
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
        throw new Error(
          data.message ||
            "Unable to load placement results."
        );
      }

      setResults(
        data.results ||
          data.data ||
          []
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
    loadResults();
    window.scrollTo(0, 0);
  }, []);

  // =====================================================
  // FILTER
  // =====================================================

  const filteredResults =
    useMemo(() => {
      if (filter === "All") {
        return results;
      }

      return results.filter(
        (item) =>
          item.resultStatus ===
          filter
      );
    }, [results, filter]);

  // =====================================================
  // STATS
  // =====================================================

  const selectedCount =
    results.filter(
      (item) =>
        item.resultStatus ===
        "Selected"
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

  const rejectedCount =
    results.filter(
      (item) =>
        item.resultStatus ===
        "Rejected"
    ).length;

  // =====================================================
  // DATE
  // =====================================================

  const formatDate = (
    date
  ) => {
    if (!date) {
      return "Not Available";
    }

    const value =
      new Date(date);

    if (
      Number.isNaN(
        value.getTime()
      )
    ) {
      return "Not Available";
    }

    return value.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );
  };

  // =====================================================
  // RESULT MESSAGE
  // =====================================================

  const getResultMessage = (
    status
  ) => {
    if (
      status === "Selected"
    ) {
      return "Congratulations! You have been selected.";
    }

    if (
      status === "Shortlisted"
    ) {
      return "You have been shortlisted for the next stage.";
    }

    if (
      status === "Waiting"
    ) {
      return "Your final result is currently pending.";
    }

    return "This application was not selected.";
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <PortalLayout
      title="Results"
      subtitle="Track your placement selections, shortlists and final outcomes."
    >
      <div className="results-common-page">

        {loading ? (

          <div className="results-loading">

            <h2>
              Loading Results...
            </h2>

            <p>
              Checking your latest
              placement results.
            </p>

          </div>

        ) : (

          <>
            {/* =============================================
                HERO
            ============================================= */}

            <section className="results-hero">

              <div>

                <span className="results-label">
                  PLACEMENT RESULTS
                </span>

                <h1>
                  My Placement Results
                </h1>

                <p>
                  View your selections,
                  shortlists, waiting
                  results and final
                  placement status.
                </p>

              </div>

              <Link
                to="/dashboard"
                className="results-dashboard-btn"
              >
                Dashboard
              </Link>

            </section>

            {/* ERROR */}

            {error && (

              <div className="results-error-message">

                <span>
                  {error}
                </span>

                <button
                  type="button"
                  onClick={
                    loadResults
                  }
                >
                  Try Again
                </button>

              </div>

            )}

            {/* =============================================
                STATS
            ============================================= */}

            <section className="results-stats-grid">

              <div className="results-stat-card">

                <span>
                  Total Results
                </span>

                <strong>
                  {results.length}
                </strong>

                <small>
                  Published results
                </small>

              </div>

              <div className="results-stat-card">

                <span>
                  Selected
                </span>

                <strong>
                  {selectedCount}
                </strong>

                <small>
                  Final selections
                </small>

              </div>

              <div className="results-stat-card">

                <span>
                  Shortlisted
                </span>

                <strong>
                  {shortlistedCount}
                </strong>

                <small>
                  Shortlisted applications
                </small>

              </div>

              <div className="results-stat-card">

                <span>
                  Waiting
                </span>

                <strong>
                  {waitingCount}
                </strong>

                <small>
                  Awaiting decision
                </small>

              </div>

            </section>

            {/* =============================================
                MAIN
            ============================================= */}

            <section className="results-main-card">

              <div className="results-toolbar">

                <div>

                  <span className="results-label">
                    RESULT HISTORY
                  </span>

                  <h2>
                    Placement Updates
                  </h2>

                  <p className="results-toolbar-text">
                    Review all published
                    placement outcomes.
                  </p>

                </div>

                <select
                  value={filter}
                  onChange={
                    (event) =>
                      setFilter(
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

              {/* ===========================================
                  RESULTS LIST
              =========================================== */}

              {filteredResults.length >
              0 ? (

                <div className="results-list">

                  {filteredResults.map(
                    (item) => (

                      <article
                        className="result-card"
                        key={
                          item._id
                        }
                      >

                        <div className="result-card-header">

                          <div className="result-company-avatar">
                            {(item.company ||
                              "C")
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div className="result-company-info">

                            <h3>
                              {item.company ||
                                "Company"}
                            </h3>

                            <p>
                              {item.role ||
                                "Role not specified"}
                            </p>

                          </div>

                          <span
                            className={`result-status ${String(
                              item.resultStatus ||
                                "waiting"
                            ).toLowerCase()}`}
                          >
                            {item.resultStatus ||
                              "Waiting"}
                          </span>

                        </div>

                        <div className="result-details-grid">

                          <div>
                            <span>
                              Package
                            </span>

                            <strong>
                              {item.package ||
                                "Not Available"}
                            </strong>
                          </div>

                          <div>
                            <span>
                              Location
                            </span>

                            <strong>
                              {item.location ||
                                "Not Available"}
                            </strong>
                          </div>

                          <div>
                            <span>
                              Joining Date
                            </span>

                            <strong>
                              {formatDate(
                                item.joiningDate
                              )}
                            </strong>
                          </div>

                          <div>
                            <span>
                              Result Published
                            </span>

                            <strong>
                              {formatDate(
                                item.createdAt
                              )}
                            </strong>
                          </div>

                        </div>

                        {item.remarks && (

                          <div className="result-remarks">

                            <span>
                              Remarks
                            </span>

                            <p>
                              {item.remarks}
                            </p>

                          </div>

                        )}

                        <div className="result-card-footer">

                          <span>
                            {getResultMessage(
                              item.resultStatus
                            )}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              setSelectedResult(
                                item
                              )
                            }
                          >
                            View Details
                          </button>

                        </div>

                      </article>

                    )
                  )}

                </div>

              ) : (

                <div className="results-empty">

                  <div className="results-empty-icon">
                    ✓
                  </div>

                  <h3>
                    No placement results
                  </h3>

                  <p>
                    {results.length === 0
                      ? "Your placement results will appear here when they are published by the administrator."
                      : "No results match the selected filter."}
                  </p>

                  {filter !== "All" && (

                    <button
                      type="button"
                      onClick={() =>
                        setFilter("All")
                      }
                    >
                      View All Results
                    </button>

                  )}

                </div>

              )}

            </section>

            {/* =============================================
                SUMMARY
            ============================================= */}

            <section className="results-summary-card">

              <div>

                <span className="results-label">
                  PLACEMENT SUMMARY
                </span>

                <h2>
                  {selectedCount > 0
                    ? "Congratulations on your placement!"
                    : "Keep moving forward"}
                </h2>

                <p>
                  {selectedCount} selected,{" "}
                  {shortlistedCount} shortlisted,{" "}
                  {waitingCount} waiting and{" "}
                  {rejectedCount} rejected.
                </p>

              </div>

              <Link
                to="/drives"
                className="results-dashboard-btn"
              >
                Explore Drives
              </Link>

            </section>
          </>
        )}

        {/* ===============================================
            DETAILS MODAL
        =============================================== */}

        {selectedResult && (

          <div
            className="result-modal-overlay"
            onClick={() =>
              setSelectedResult(
                null
              )
            }
          >

            <div
              className="result-modal"
              onClick={
                (event) =>
                  event.stopPropagation()
              }
            >

              <div className="result-modal-header">

                <div>

                  <span className="results-label">
                    PLACEMENT RESULT
                  </span>

                  <h2>
                    {
                      selectedResult.company
                    }
                  </h2>

                  <p>
                    {
                      selectedResult.role
                    }
                  </p>

                </div>

                <button
                  type="button"
                  className="result-modal-close"
                  onClick={() =>
                    setSelectedResult(
                      null
                    )
                  }
                >
                  ×
                </button>

              </div>

              <div className="result-modal-status">

                <span
                  className={`result-status ${String(
                    selectedResult.resultStatus ||
                      "waiting"
                  ).toLowerCase()}`}
                >
                  {
                    selectedResult.resultStatus
                  }
                </span>

                {selectedResult.resultStatus ===
                  "Selected" && (

                  <strong>
                    {selectedResult.package ||
                      "Package not specified"}
                  </strong>

                )}

              </div>

              <div className="result-modal-grid">

                <div>
                  <span>
                    Company
                  </span>

                  <strong>
                    {
                      selectedResult.company
                    }
                  </strong>
                </div>

                <div>
                  <span>
                    Role
                  </span>

                  <strong>
                    {
                      selectedResult.role
                    }
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
                    Location
                  </span>

                  <strong>
                    {selectedResult.location ||
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

                <div className="result-modal-remarks">

                  <span>
                    Remarks
                  </span>

                  <p>
                    {
                      selectedResult.remarks
                    }
                  </p>

                </div>

              )}

              <div className="result-modal-actions">

                <button
                  type="button"
                  onClick={() =>
                    setSelectedResult(
                      null
                    )
                  }
                >
                  Close
                </button>

              </div>

            </div>

          </div>

        )}

      </div>
    </PortalLayout>
  );
}

export default Results;
