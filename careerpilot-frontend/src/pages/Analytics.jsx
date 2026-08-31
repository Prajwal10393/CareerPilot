import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PortalLayout from "../components/PortalLayout";
import "../App.css";

const API_URL = "http://localhost:5000";

function Analytics() {
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // LOAD REAL ANALYTICS
  // =========================================================

  useEffect(() => {
    const loadAnalytics = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const [
          analyticsResponse,
          resumeResponse
        ] = await Promise.all([
          fetch(
            `${API_URL}/api/analytics/student`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          ),

          fetch(
            `${API_URL}/api/student/resume/analysis`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
        ]);

        const analyticsData =
          await analyticsResponse.json();

        if (!analyticsResponse.ok) {
          if (
            analyticsResponse.status === 401 ||
            analyticsResponse.status === 403
          ) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("role");

            navigate("/login");
            return;
          }

          throw new Error(
            analyticsData.message ||
              "Unable to load analytics."
          );
        }

        setAnalytics(analyticsData);

        if (resumeResponse.ok) {
          const resumeData =
            await resumeResponse.json();

          setResume(
            resumeData.resume ||
              resumeData.analysis ||
              resumeData.data ||
              resumeData ||
              null
          );
        } else {
          setResume(null);
        }
      } catch (err) {
        setError(
          err.message ||
            "Unable to load placement analytics."
        );
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [navigate]);

  // =========================================================
  // SAFE VALUES
  // =========================================================

  const summary =
    analytics?.summary || {
      totalApplications: 0,
      totalInterviews: 0,
      totalOffers: 0,
      totalSkills: 0
    };

  const applicationStatus =
    analytics?.applicationStatus || {
      applied: 0,
      shortlisted: 0,
      interview: 0,
      selected: 0,
      rejected: 0
    };

  const placementResults =
    analytics?.placementResults || {
      selected: 0,
      shortlisted: 0,
      rejected: 0
    };

  const performance =
    analytics?.performance || {
      interviewRate: 0,
      offerRate: 0
    };

  const atsScore = Number(
    resume?.atsScore || 0
  );

  const companyMatchScore = Number(
    resume?.companyMatchScore || 0
  );

  const atsPercentage = Math.min(
    Math.max(atsScore * 10, 0),
    100
  );

  const companyPercentage = Math.min(
    Math.max(companyMatchScore * 10, 0),
    100
  );

  // =========================================================
  // DERIVED VALUES
  // =========================================================

  const shortlistRate =
    summary.totalApplications > 0
      ? Math.round(
          (applicationStatus.shortlisted /
            summary.totalApplications) *
            100
        )
      : 0;

  const selectedRate =
    summary.totalApplications > 0
      ? Math.round(
          (placementResults.selected /
            summary.totalApplications) *
            100
        )
      : 0;

  const statusData = useMemo(
    () => [
      {
        label: "Applied",
        value: applicationStatus.applied,
        className: "applied"
      },
      {
        label: "Shortlisted",
        value:
          applicationStatus.shortlisted,
        className: "shortlisted"
      },
      {
        label: "Interview",
        value:
          applicationStatus.interview,
        className: "interview"
      },
      {
        label: "Selected",
        value:
          applicationStatus.selected,
        className: "offer"
      },
      {
        label: "Rejected",
        value:
          applicationStatus.rejected,
        className: "rejected"
      }
    ],
    [applicationStatus]
  );

  const maxStatusValue = Math.max(
    ...statusData.map(
      (item) => item.value
    ),
    1
  );

  // =========================================================
  // NEXT ACTION
  // =========================================================

  const nextAction = useMemo(() => {
    if (!resume) {
      return {
        title: "Analyze your resume",
        description:
          "Upload your resume to receive ATS and company-role match insights.",
        link: "/resume",
        button: "Analyze Resume"
      };
    }

    if (atsScore < 7) {
      return {
        title: "Improve your resume",
        description:
          "Your ATS score can be improved by strengthening keywords, projects, skills and resume structure.",
        link: "/resume",
        button: "Improve Resume"
      };
    }

    if (summary.totalSkills < 5) {
      return {
        title: "Build your skill profile",
        description:
          "Add more technical skills so CareerPilot can improve eligibility and resume matching.",
        link: "/skills",
        button: "Manage Skills"
      };
    }

    if (
      summary.totalApplications === 0
    ) {
      return {
        title:
          "Start applying for opportunities",
        description:
          "Your profile is ready. Explore placement drives and start tracking applications.",
        link: "/drives",
        button: "View Drives"
      };
    }

    if (summary.totalInterviews === 0) {
      return {
        title:
          "Prepare for interview opportunities",
        description:
          "Continue applying and practice technical interview questions while waiting for shortlists.",
        link: "/practice",
        button: "Start Practice"
      };
    }

    return {
      title:
        "Keep improving your placement readiness",
      description:
        "Continue practicing interviews, improving skills and tracking active applications.",
      link: "/practice",
      button: "Continue Practice"
    };
  }, [
    resume,
    atsScore,
    summary.totalSkills,
    summary.totalApplications,
    summary.totalInterviews
  ]);

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <PortalLayout
      title="Analytics"
      subtitle="Real-time overview of your placement performance and career readiness."
    >
      <div className="analytics-common-page">

        <div className="analytics-heading">
          <div>
            <span className="dashboard-section-label">
              PLACEMENT INSIGHTS
            </span>

            <h1>
              Placement Analytics
            </h1>

            <p>
              Real-time overview of your
              applications, interviews,
              offers, skills and resume
              readiness.
            </p>
          </div>
        </div>

        {error && (
          <div className="resume-error">
            {error}
          </div>
        )}

        {loading && (
          <div className="analytics-loading">
            Loading placement analytics...
          </div>
        )}

        {!loading && (
          <>
            {/* SUMMARY */}

            <div className="analytics-summary-grid">

              <div className="analytics-summary-card">
                <span>
                  Total Applications
                </span>

                <strong>
                  {
                    summary.totalApplications
                  }
                </strong>

                <p>
                  Applications currently
                  tracked
                </p>
              </div>

              <div className="analytics-summary-card">
                <span>
                  Shortlisted
                </span>

                <strong>
                  {
                    applicationStatus.shortlisted
                  }
                </strong>

                <p>
                  {shortlistRate}% shortlist
                  rate
                </p>
              </div>

              <div className="analytics-summary-card">
                <span>
                  Interviews
                </span>

                <strong>
                  {
                    summary.totalInterviews
                  }
                </strong>

                <p>
                  {
                    performance.interviewRate
                  }
                  % interview rate
                </p>
              </div>

              <div className="analytics-summary-card">
                <span>
                  Offers
                </span>

                <strong>
                  {summary.totalOffers}
                </strong>

                <p>
                  {performance.offerRate}% offer
                  rate
                </p>
              </div>

            </div>

            {/* SCORE CARDS */}

            <div className="analytics-score-grid">

              <section className="analytics-score-card">
                <div className="analytics-score-heading">
                  <div>
                    <span>
                      RESUME READINESS
                    </span>

                    <h2>
                      ATS Resume Score
                    </h2>
                  </div>

                  <strong>
                    {resume
                      ? `${atsScore.toFixed(
                          1
                        )}/10`
                      : "--"}
                  </strong>
                </div>

                <div className="analytics-progress">
                  <span
                    style={{
                      width:
                        `${atsPercentage}%`
                    }}
                  />
                </div>

                <p>
                  {resume
                    ? "Based on your latest resume analysis."
                    : "Upload a resume to calculate your ATS score."}
                </p>

                <Link to="/resume">
                  View Resume Analysis →
                </Link>
              </section>

              <section className="analytics-score-card">
                <div className="analytics-score-heading">
                  <div>
                    <span>
                      COMPANY READINESS
                    </span>

                    <h2>
                      {resume?.targetCompany
                        ? `${resume.targetCompany} Match`
                        : "Company Match"}
                    </h2>
                  </div>

                  <strong>
                    {resume?.targetCompany
                      ? `${companyMatchScore.toFixed(
                          1
                        )}/10`
                      : "--"}
                  </strong>
                </div>

                <div className="analytics-progress">
                  <span
                    style={{
                      width:
                        `${companyPercentage}%`
                    }}
                  />
                </div>

                <p>
                  {resume?.targetRole
                    ? `Target role: ${resume.targetRole}`
                    : "Select a company and role in Resume Analyzer."}
                </p>

                <Link to="/resume">
                  Company Analysis →
                </Link>
              </section>

              <section className="analytics-score-card">
                <div className="analytics-score-heading">
                  <div>
                    <span>
                      SKILL PROFILE
                    </span>

                    <h2>
                      Skills Added
                    </h2>
                  </div>

                  <strong>
                    {summary.totalSkills}
                  </strong>
                </div>

                <p>
                  Technical skills currently
                  stored in your CareerPilot
                  profile.
                </p>

                <Link to="/skills">
                  Manage Skills →
                </Link>
              </section>

            </div>

            {/* MAIN ANALYTICS */}

            <div className="analytics-main-grid">

              <section className="analytics-card">
                <div className="analytics-card-heading">
                  <div>
                    <h2>
                      Application Status
                    </h2>

                    <p>
                      Current distribution of
                      your application stages.
                    </p>
                  </div>
                </div>

                <div className="analytics-performance-list">
                  {statusData.map(
                    (item) => {
                      const percentage =
                        Math.round(
                          (item.value /
                            maxStatusValue) *
                            100
                        );

                      return (
                        <div
                          key={
                            item.label
                          }
                        >
                          <div>
                            <span>
                              {
                                item.label
                              }
                            </span>

                            <strong>
                              {
                                item.value
                              }
                            </strong>
                          </div>

                          <div className="analytics-progress">
                            <span
                              style={{
                                width:
                                  `${percentage}%`
                              }}
                            />
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </section>

              <section className="analytics-card">
                <div className="analytics-card-heading">
                  <div>
                    <h2>
                      Placement Performance
                    </h2>

                    <p>
                      Conversion rates
                      calculated from your
                      real placement activity.
                    </p>
                  </div>
                </div>

                <div className="analytics-performance-list">

                  <div>
                    <div>
                      <span>
                        Interview Rate
                      </span>

                      <strong>
                        {
                          performance.interviewRate
                        }
                        %
                      </strong>
                    </div>

                    <div className="analytics-progress">
                      <span
                        style={{
                          width:
                            `${Math.min(
                              performance.interviewRate,
                              100
                            )}%`
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div>
                      <span>
                        Offer Rate
                      </span>

                      <strong>
                        {
                          performance.offerRate
                        }
                        %
                      </strong>
                    </div>

                    <div className="analytics-progress">
                      <span
                        style={{
                          width:
                            `${Math.min(
                              performance.offerRate,
                              100
                            )}%`
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div>
                      <span>
                        Shortlist Rate
                      </span>

                      <strong>
                        {shortlistRate}%
                      </strong>
                    </div>

                    <div className="analytics-progress">
                      <span
                        style={{
                          width:
                            `${Math.min(
                              shortlistRate,
                              100
                            )}%`
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div>
                      <span>
                        Selection Rate
                      </span>

                      <strong>
                        {selectedRate}%
                      </strong>
                    </div>

                    <div className="analytics-progress">
                      <span
                        style={{
                          width:
                            `${Math.min(
                              selectedRate,
                              100
                            )}%`
                        }}
                      />
                    </div>
                  </div>

                </div>
              </section>

            </div>

            {/* PLACEMENT RESULTS */}

            <section className="analytics-card">
              <div className="analytics-card-heading">
                <div>
                  <h2>
                    Placement Results
                  </h2>

                  <p>
                    Results published by the
                    placement administrator.
                  </p>
                </div>

                <Link to="/results">
                  View Results →
                </Link>
              </div>

              <div className="analytics-summary-grid">

                <div className="analytics-summary-card">
                  <span>
                    Selected
                  </span>

                  <strong>
                    {
                      placementResults.selected
                    }
                  </strong>

                  <p>
                    Successful selections
                  </p>
                </div>

                <div className="analytics-summary-card">
                  <span>
                    Shortlisted
                  </span>

                  <strong>
                    {
                      placementResults.shortlisted
                    }
                  </strong>

                  <p>
                    Results awaiting next
                    stage
                  </p>
                </div>

                <div className="analytics-summary-card">
                  <span>
                    Rejected
                  </span>

                  <strong>
                    {
                      placementResults.rejected
                    }
                  </strong>

                  <p>
                    Completed unsuccessful
                    results
                  </p>
                </div>

              </div>
            </section>

            {/* RESUME INSIGHTS */}

            {resume && (
              <section className="analytics-ai-section">

                <div className="analytics-ai-header">
                  <div>
                    <span className="analytics-ai-badge">
                      RESUME INSIGHTS
                    </span>

                    <h2>
                      Current skill gap
                    </h2>

                    <p>
                      These values come from
                      your latest CareerPilot
                      resume analysis.
                    </p>
                  </div>
                </div>

                <div className="analytics-ai-grid">

                  <div className="analytics-ai-card">
                    <span className="analytics-priority medium">
                      MATCHED
                    </span>

                    <h3>
                      Resume Skills
                    </h3>

                    <p>
                      {resume.matchedSkills
                        ?.length || 0}{" "}
                      saved skills were
                      detected in your
                      resume.
                    </p>

                    <Link to="/resume">
                      View Resume →
                    </Link>
                  </div>

                  <div className="analytics-ai-card">
                    <span className="analytics-priority high">
                      SKILL GAP
                    </span>

                    <h3>
                      Missing Resume Skills
                    </h3>

                    <p>
                      {resume.missingSkills
                        ?.length || 0}{" "}
                      CareerPilot skills were
                      not detected in your
                      resume.
                    </p>

                    <Link to="/skills">
                      View Skills →
                    </Link>
                  </div>

                  <div className="analytics-ai-card">
                    <span className="analytics-priority medium">
                      COMPANY MATCH
                    </span>

                    <h3>
                      {resume.targetCompany ||
                        "Target Company"}
                    </h3>

                    <p>
                      {resume
                        .companyMissingSkills
                        ?.length || 0}{" "}
                      target-role skills are
                      currently missing.
                    </p>

                    <Link to="/resume">
                      View Company Match →
                    </Link>
                  </div>

                </div>
              </section>
            )}

            {/* NEXT ACTION */}

            <section className="analytics-next-action">
              <div>
                <span className="analytics-ai-badge">
                  NEXT BEST ACTION
                </span>

                <h2>
                  {nextAction.title}
                </h2>

                <p>
                  {
                    nextAction.description
                  }
                </p>
              </div>

              <Link to={nextAction.link}>
                {nextAction.button}
              </Link>
            </section>
          </>
        )}

      </div>
    </PortalLayout>
  );
}

export default Analytics;
