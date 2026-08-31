import {
  useEffect,
  useMemo,
  useState
} from "react";

import PortalLayout from "../components/PortalLayout";
import "../App.css";

const API_URL = "http://localhost:5000";

function Drives() {
  const token =
    localStorage.getItem("token");

  const [drives, setDrives] =
    useState([]);

  const [
    locationFilter,
    setLocationFilter
  ] = useState("All");

  const [
    eligibilityFilter,
    setEligibilityFilter
  ] = useState("All");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    refreshing,
    setRefreshing
  ] = useState(false);

  // =========================================================
  // DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "-";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );
  };

  // =========================================================
  // MATCH SCORE
  // =========================================================

  const calculateMatchScore = (
    checks
  ) => {
    if (!checks) {
      return 0;
    }

    const checkList = [
      checks.cgpa,
      checks.backlogs,
      checks.course,
      checks.graduationYear,
      checks.skills
    ].filter(Boolean);

    if (checkList.length === 0) {
      return 0;
    }

    const passed =
      checkList.filter(
        (check) =>
          check.eligible
      ).length;

    return Math.round(
      (passed /
        checkList.length) *
        100
    );
  };

  // =========================================================
  // ELIGIBILITY
  // =========================================================

  const fetchEligibility =
    async (drive) => {
      try {
        const response =
          await fetch(
            `${API_URL}/api/eligibility/${drive._id}`,
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
          return {
            ...drive,

            eligible: false,

            matchScore: 0,

            eligibilityChecks:
              null,

            eligibilityReasons: [
              data.message ||
                "Eligibility could not be checked"
            ]
          };
        }

        return {
          ...drive,

          eligible:
            data.eligible,

          matchScore:
            calculateMatchScore(
              data.checks
            ),

          eligibilityChecks:
            data.checks,

          eligibilityReasons:
            data.reasons || []
        };
      } catch {
        return {
          ...drive,

          eligible: false,

          matchScore: 0,

          eligibilityChecks:
            null,

          eligibilityReasons: [
            "Eligibility check failed"
          ]
        };
      }
    };

  // =========================================================
  // LOAD DRIVES
  // =========================================================

  const fetchDrives =
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        if (!token) {
          throw new Error(
            "Please login to view placement drives."
          );
        }

        const response =
          await fetch(
            `${API_URL}/api/drives`,
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
              "Failed to load placement drives"
          );
        }

        const fetchedDrives =
          data.drives || [];

        const drivesWithEligibility =
          await Promise.all(
            fetchedDrives.map(
              (drive) =>
                fetchEligibility(
                  drive
                )
            )
          );

        setDrives(
          drivesWithEligibility
        );
      } catch (error) {
        setError(
          error.message
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

  useEffect(() => {
    fetchDrives();

    window.scrollTo(0, 0);
  }, []);

  // =========================================================
  // LOCATIONS
  // =========================================================

  const locations =
    useMemo(() => {
      return [
        ...new Set(
          drives
            .map(
              (drive) =>
                drive.location
            )
            .filter(Boolean)
        )
      ];
    }, [drives]);

  // =========================================================
  // FILTERS
  // =========================================================

  const filteredDrives =
    useMemo(() => {
      return drives.filter(
        (drive) => {
          const matchesLocation =
            locationFilter ===
              "All" ||
            drive.location ===
              locationFilter;

          const matchesEligibility =
            eligibilityFilter ===
              "All" ||
            (
              eligibilityFilter ===
                "Eligible" &&
              drive.eligible
            ) ||
            (
              eligibilityFilter ===
                "Not Eligible" &&
              !drive.eligible
            );

          return (
            matchesLocation &&
            matchesEligibility
          );
        }
      );
    }, [
      drives,
      locationFilter,
      eligibilityFilter
    ]);

  // =========================================================
  // STATS
  // =========================================================

  const totalOpen =
    drives.filter(
      (drive) =>
        drive.status === "Open"
    ).length;

  const totalEligible =
    drives.filter(
      (drive) =>
        drive.eligible
    ).length;

  const highMatch =
    drives.filter(
      (drive) =>
        drive.matchScore >= 80
    ).length;

  // =========================================================
  // ELIGIBILITY DISPLAY
  // =========================================================

  const buildEligibilityList = (
    drive
  ) => {
    const eligibility =
      drive.eligibility || {};

    const list = [];

    if (
      eligibility.courses &&
      eligibility.courses.length >
        0
    ) {
      list.push(
        `Courses: ${eligibility.courses.join(
          ", "
        )}`
      );
    }

    if (
      eligibility.graduationYears &&
      eligibility.graduationYears
        .length > 0
    ) {
      list.push(
        `Graduation: ${eligibility.graduationYears.join(
          ", "
        )}`
      );
    }

    if (
      eligibility.minimumCgpa !==
      undefined
    ) {
      list.push(
        `Minimum CGPA: ${eligibility.minimumCgpa}`
      );
    }

    if (
      eligibility.maximumBacklogs !==
      undefined
    ) {
      list.push(
        `Maximum Backlogs: ${eligibility.maximumBacklogs}`
      );
    }

    return list;
  };

  // =========================================================
  // APPLY
  // =========================================================

  const handleApply = (
    drive
  ) => {
    if (!drive.eligible) {
      const reasons =
        drive.eligibilityReasons &&
        drive.eligibilityReasons
          .length > 0
          ? drive
              .eligibilityReasons
              .join("\n")
          : "You are currently not eligible for this placement drive.";

      alert(
        `Not Eligible\n\n${reasons}`
      );

      return;
    }

    if (
      drive.status === "Closed"
    ) {
      alert(
        "Applications for this placement drive are closed."
      );

      return;
    }

    if (drive.applicationLink) {
      window.open(
        drive.applicationLink,
        "_blank",
        "noopener,noreferrer"
      );

      return;
    }

    alert(
      `You are eligible for ${drive.company} - ${drive.role}, but no application link has been added yet.`
    );
  };

  // =========================================================
  // DETAILS
  // =========================================================

  const handleViewDetails = (
    drive
  ) => {
    const eligibilityReasons =
      drive.eligibilityReasons &&
      drive.eligibilityReasons
        .length > 0
        ? drive
            .eligibilityReasons
            .join("\n")
        : "All eligibility requirements satisfied.";

    alert(
`${drive.company} - ${drive.role}

Package: ${drive.package || "-"}
Location: ${drive.location || "-"}
Job Type: ${drive.jobType || "-"}
Status: ${drive.status || "-"}
Deadline: ${formatDate(
  drive.applicationDeadline
)}
Drive Date: ${formatDate(
  drive.driveDate
)}

Eligibility:
${drive.eligible
  ? "Eligible"
  : "Not Eligible"}

Match Score: ${drive.matchScore}%

${eligibilityReasons}

${drive.description || ""}`
    );
  };

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <PortalLayout
      title="Placement Drives"
      subtitle="Discover opportunities matched with your profile and eligibility."
    >
      <div className="drives-common-page">

        {/* HERO */}

        <section className="drives-hero">

          <div>
            <span className="drives-label">
              PLACEMENT OPPORTUNITIES
            </span>

            <h1>
              Placement Drives
            </h1>

            <p>
              Discover placement drives
              matched with your profile,
              academic eligibility and
              technical skills.
            </p>
          </div>

          <button
            type="button"
            className="drives-refresh-btn"
            disabled={refreshing}
            onClick={() =>
              fetchDrives(true)
            }
          >
            {refreshing
              ? "Refreshing..."
              : "Refresh Matches"}
          </button>

        </section>

        {/* ERROR */}

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        {/* SUMMARY */}

        <section className="drives-summary-grid">

          <div className="drives-summary-card">
            <span>
              Available Drives
            </span>

            <strong>
              {loading
                ? "..."
                : drives.length}
            </strong>

            <small>
              Total opportunities
            </small>
          </div>

          <div className="drives-summary-card">
            <span>
              Open Now
            </span>

            <strong>
              {loading
                ? "..."
                : totalOpen}
            </strong>

            <small>
              Applications currently open
            </small>
          </div>

          <div className="drives-summary-card">
            <span>
              Eligible
            </span>

            <strong>
              {loading
                ? "..."
                : totalEligible}
            </strong>

            <small>
              Matches your profile
            </small>
          </div>

          <div className="drives-summary-card">
            <span>
              High Match
            </span>

            <strong>
              {loading
                ? "..."
                : highMatch}
            </strong>

            <small>
              Match score 80% or above
            </small>
          </div>

        </section>

        {/* FILTERS */}

        <section className="drives-toolbar drives-toolbar-no-search">

          <div>
            <h2>
              Find Opportunities
            </h2>

            <p>
              Filter placement drives by
              location and your eligibility.
            </p>
          </div>

          <div className="drives-filter-group">

            <select
              value={
                locationFilter
              }
              onChange={(event) =>
                setLocationFilter(
                  event.target.value
                )
              }
            >
              <option value="All">
                All Locations
              </option>

              {locations.map(
                (location) => (
                  <option
                    key={location}
                    value={location}
                  >
                    {location}
                  </option>
                )
              )}
            </select>

            <select
              value={
                eligibilityFilter
              }
              onChange={(event) =>
                setEligibilityFilter(
                  event.target.value
                )
              }
            >
              <option value="All">
                All Eligibility
              </option>

              <option value="Eligible">
                Eligible
              </option>

              <option value="Not Eligible">
                Not Eligible
              </option>
            </select>

          </div>

        </section>

        {/* DRIVES */}

        <section className="drives-section">

          <div className="drives-section-heading">

            <div>
              <span className="drives-label">
                RECOMMENDED FOR YOU
              </span>

              <h2>
                Matching Placement Drives
              </h2>

              <p>
                Ranked using your profile,
                eligibility and skill
                match.
              </p>
            </div>

            <span className="drives-result-count">
              {filteredDrives.length}{" "}
              results
            </span>

          </div>

          {loading ? (

            <div className="drives-empty">
              <h3>
                Loading Placement Drives...
              </h3>

              <p>
                Checking your profile and
                eligibility.
              </p>
            </div>

          ) : filteredDrives.length >
            0 ? (

            <div className="drives-grid">

              {filteredDrives.map(
                (drive) => {

                  const requiredSkills =
                    drive.eligibility
                      ?.requiredSkills ||
                    [];

                  const eligibilityList =
                    buildEligibilityList(
                      drive
                    );

                  return (
                    <article
                      className="drive-card"
                      key={drive._id}
                    >

                      {/* COMPANY */}

                      <div className="drive-card-header">

                        <div className="drive-company">

                          <div className="drive-company-logo">
                            {drive.company
                              ?.charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <h3>
                              {drive.company}
                            </h3>

                            <p>
                              {drive.role}
                            </p>
                          </div>

                        </div>

                        <span
                          className={`drive-status ${(
                            drive.status ||
                            "Upcoming"
                          ).toLowerCase()}`}
                        >
                          {drive.status}
                        </span>

                      </div>

                      {/* MATCH */}

                      <div className="drive-match-row">

                        <div>
                          <span>
                            Profile Match
                          </span>

                          <strong>
                            {drive.matchScore}%
                          </strong>
                        </div>

                        <span
                          className={
                            drive.eligible
                              ? "drive-eligibility eligible"
                              : "drive-eligibility not-eligible"
                          }
                        >
                          {drive.eligible
                            ? "Eligible"
                            : "Not Eligible"}
                        </span>

                      </div>

                      <div className="drive-match-progress">
                        <span
                          style={{
                            width:
                              `${drive.matchScore}%`
                          }}
                        />
                      </div>

                      {/* INFO */}

                      <div className="drive-info-grid">

                        <div>
                          <span>
                            Package
                          </span>

                          <strong>
                            {drive.package ||
                              "-"}
                          </strong>
                        </div>

                        <div>
                          <span>
                            Location
                          </span>

                          <strong>
                            {drive.location ||
                              "-"}
                          </strong>
                        </div>

                        <div>
                          <span>
                            Job Type
                          </span>

                          <strong>
                            {drive.jobType ||
                              "-"}
                          </strong>
                        </div>

                        <div>
                          <span>
                            Deadline
                          </span>

                          <strong>
                            {formatDate(
                              drive.applicationDeadline
                            )}
                          </strong>
                        </div>

                      </div>

                      {/* SKILLS */}

                      <div className="drive-skill-section">

                        <span>
                          Required Skills
                        </span>

                        <div className="drive-skill-tags">

                          {requiredSkills.length >
                          0 ? (

                            requiredSkills.map(
                              (skill) => (
                                <span
                                  key={skill}
                                >
                                  {skill}
                                </span>
                              )
                            )

                          ) : (

                            <span>
                              No specific skills
                            </span>

                          )}

                        </div>

                      </div>

                      {/* ELIGIBILITY */}

                      <div className="drive-eligibility-section">

                        <span>
                          Eligibility
                        </span>

                        {eligibilityList.length >
                        0 ? (

                          <ul>
                            {eligibilityList.map(
                              (item) => (
                                <li
                                  key={item}
                                >
                                  {item}
                                </li>
                              )
                            )}
                          </ul>

                        ) : (

                          <p>
                            No specific academic
                            requirements.
                          </p>

                        )}

                      </div>

                      {/* NOT ELIGIBLE REASONS */}

                      {!drive.eligible &&
                        drive
                          .eligibilityReasons
                          ?.length > 0 && (

                          <div className="drive-eligibility-section drive-reason-section">

                            <span>
                              Why Not Eligible
                            </span>

                            <ul>
                              {drive.eligibilityReasons.map(
                                (
                                  reason,
                                  index
                                ) => (
                                  <li
                                    key={index}
                                  >
                                    {reason}
                                  </li>
                                )
                              )}
                            </ul>

                          </div>
                        )}

                      {/* DRIVE DATE */}

                      <div className="drive-date-panel">

                        <div>
                          <span>
                            Drive Date
                          </span>

                          <strong>
                            {formatDate(
                              drive.driveDate
                            )}
                          </strong>
                        </div>

                      </div>

                      {/* ACTIONS */}

                      <div className="drive-card-actions">

                        <button
                          type="button"
                          className="drive-details-btn"
                          onClick={() =>
                            handleViewDetails(
                              drive
                            )
                          }
                        >
                          View Details
                        </button>

                        <button
                          type="button"
                          className={
                            drive.eligible &&
                            drive.status !==
                              "Closed"
                              ? "drive-apply-btn"
                              : "drive-apply-btn disabled"
                          }
                          disabled={
                            !drive.eligible ||
                            drive.status ===
                              "Closed"
                          }
                          onClick={() =>
                            handleApply(
                              drive
                            )
                          }
                        >
                          {drive.status ===
                          "Closed"
                            ? "Closed"
                            : drive.eligible
                            ? "Apply Now"
                            : "Not Eligible"}
                        </button>

                      </div>

                    </article>
                  );
                }
              )}

            </div>

          ) : (

            <div className="drives-empty">

              <div>
                ↗
              </div>

              <h3>
                No matching drives found
              </h3>

              <p>
                Try changing your location
                or eligibility filters.
              </p>

              <button
                type="button"
                onClick={() => {
                  setLocationFilter(
                    "All"
                  );

                  setEligibilityFilter(
                    "All"
                  );
                }}
              >
                Clear Filters
              </button>

            </div>

          )}

        </section>

        {/* CAREER INSIGHT */}

        <section className="drives-ai-card">

          <div>
            <span className="drives-label">
              CAREER INSIGHT
            </span>

            <h2>
              Improve your placement
              matches
            </h2>

            <p>
              Add and improve your
              technical skills to increase
              eligibility for more
              placement drives.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              window.location.href =
                "/skills";
            }}
          >
            View Skill Gap
          </button>

        </section>

      </div>
    </PortalLayout>
  );
}

export default Drives;
