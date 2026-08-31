import {
  useEffect,
  useRef,
  useState
} from "react";

import PortalLayout from "../components/PortalLayout";
import "./Resume.css";
import "../App.css";

const API_URL = "http://localhost:5000";

// =========================================================
// COMPANY + ROLE OPTIONS
// Must match backend companyProfiles.js
// =========================================================

const companyRoles = {
  Amazon: [
    "Software Development Engineer",
    "Cloud Engineer"
  ],

  Google: [
    "Software Engineer",
    "Backend Engineer"
  ],

  Microsoft: [
    "Software Engineer"
  ],

  TCS: [
    "Graduate Engineer"
  ],

  Infosys: [
    "System Engineer"
  ],

  Cognizant: [
    "GenC"
  ],

  IBM: [
    "Associate Software Engineer"
  ],

  Capgemini: [
    "Software Engineer"
  ],

  PhonePe: [
    "Backend Developer"
  ],

  Flipkart: [
    "Software Development Engineer"
  ]
};

function Resume() {
  const [resumeFile, setResumeFile] =
    useState(null);

  const [analysis, setAnalysis] =
    useState(null);

  const [uploading, setUploading] =
    useState(false);

  const [scanComplete, setScanComplete] =
    useState(false);

  const [scanStage, setScanStage] =
    useState("Preparing scanner...");

  const [progress, setProgress] =
    useState(0);

  const [error, setError] =
    useState("");

  // =========================================================
  // COMPANY SELECTION
  // =========================================================

  const [targetCompany, setTargetCompany] =
    useState("");

  const [targetRole, setTargetRole] =
    useState("");

  const fileInputRef = useRef(null);

  const stageIntervalRef =
    useRef(null);

  const progressIntervalRef =
    useRef(null);

  // =========================================================
  // SCANNER STAGES
  // =========================================================

  const scanStages = [
    {
      progress: 8,
      text: "Initializing resume scanner..."
    },
    {
      progress: 18,
      text: "Detecting resume layout..."
    },
    {
      progress: 30,
      text: "Extracting resume text..."
    },
    {
      progress: 42,
      text: "Identifying education and experience..."
    },
    {
      progress: 55,
      text: "Scanning technical skills..."
    },
    {
      progress: 68,
      text: "Matching role keywords..."
    },
    {
      progress: 78,
      text: "Checking resume structure..."
    },
    {
      progress: 88,
      text: "Comparing target company profile..."
    },
    {
      progress: 95,
      text: "Calculating final match scores..."
    }
  ];

  // =========================================================
  // TOKEN
  // =========================================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // =========================================================
  // STOP ANIMATIONS
  // =========================================================

  const stopAnimations = () => {
    if (stageIntervalRef.current) {
      clearInterval(
        stageIntervalRef.current
      );

      stageIntervalRef.current = null;
    }

    if (progressIntervalRef.current) {
      clearInterval(
        progressIntervalRef.current
      );

      progressIntervalRef.current = null;
    }
  };

  // =========================================================
  // START SCANNER
  // =========================================================

  const startScannerAnimation = () => {
    stopAnimations();

    let stageIndex = 0;

    setProgress(
      scanStages[0].progress
    );

    setScanStage(
      scanStages[0].text
    );

    stageIntervalRef.current =
      setInterval(() => {
        stageIndex += 1;

        if (
          stageIndex >=
          scanStages.length
        ) {
          clearInterval(
            stageIntervalRef.current
          );

          stageIntervalRef.current = null;

          return;
        }

        setProgress(
          scanStages[stageIndex].progress
        );

        setScanStage(
          scanStages[stageIndex].text
        );
      }, 650);
  };

  // =========================================================
  // FINISH SCANNER
  // =========================================================

  const finishScannerAnimation =
    async () => {
      stopAnimations();

      setScanStage(
        "Finalizing resume analysis..."
      );

      let current = progress;

      await new Promise((resolve) => {
        progressIntervalRef.current =
          setInterval(() => {
            current += 2;

            if (current >= 100) {
              current = 100;

              setProgress(100);

              clearInterval(
                progressIntervalRef.current
              );

              progressIntervalRef.current =
                null;

              resolve();
            } else {
              setProgress(current);
            }
          }, 25);
      });

      setScanStage(
        "Resume scan completed"
      );

      setScanComplete(true);

      await new Promise((resolve) =>
        setTimeout(resolve, 700)
      );
    };

  // =========================================================
  // COMPANY CHANGE
  // =========================================================

  const handleCompanyChange = (
    event
  ) => {
    const company =
      event.target.value;

    setTargetCompany(company);
    setTargetRole("");
    setError("");
  };

  // =========================================================
  // FILE SELECT
  // =========================================================

  const handleFileSelect = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      file.type !==
      "application/pdf"
    ) {
      setResumeFile(null);

      setError(
        "Only PDF resumes are supported."
      );

      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      setResumeFile(null);

      setError(
        "Resume must be smaller than 5 MB."
      );

      return;
    }

    setResumeFile(file);
    setAnalysis(null);
    setScanComplete(false);
    setProgress(0);
    setError("");
  };

  // =========================================================
  // UPLOAD + ANALYZE
  // =========================================================

  const handleUpload = async () => {
    if (!targetCompany) {
      setError(
        "Please select your target company."
      );

      return;
    }

    if (!targetRole) {
      setError(
        "Please select your target role."
      );

      return;
    }

    if (!resumeFile) {
      setError(
        "Please select your resume."
      );

      return;
    }

    const token = getToken();

    if (!token) {
      setError(
        "Login session not found. Please login again."
      );

      return;
    }

    try {
      setUploading(true);
      setScanComplete(false);
      setAnalysis(null);
      setError("");

      startScannerAnimation();

      const formData =
        new FormData();

      formData.append(
        "resume",
        resumeFile
      );

      formData.append(
        "targetCompany",
        targetCompany
      );

      formData.append(
        "targetRole",
        targetRole
      );

      const response = await fetch(
        `${API_URL}/api/student/resume/upload`,
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${token}`
          },

          body: formData
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Resume upload and analysis failed."
        );
      }

      await finishScannerAnimation();

      setAnalysis(
        data.resume
      );

      setTargetCompany(
        data.resume.targetCompany ||
          targetCompany
      );

      setTargetRole(
        data.resume.targetRole ||
          targetRole
      );
    } catch (err) {
      stopAnimations();

      setUploading(false);
      setScanComplete(false);
      setProgress(0);

      setError(
        err.message ||
          "Something went wrong while analyzing the resume."
      );

      return;
    }

    setUploading(false);
  };

  // =========================================================
  // LOAD EXISTING ANALYSIS
  // =========================================================

  const loadExistingAnalysis =
    async () => {
      const token = getToken();

      if (!token) {
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/student/resume/analysis`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

        if (response.status === 404) {
          return;
        }

        const data =
          await response.json();

        if (response.ok) {
          setAnalysis(
            data.resume
          );

          setTargetCompany(
            data.resume.targetCompany ||
              ""
          );

          setTargetRole(
            data.resume.targetRole ||
              ""
          );

          setScanComplete(true);
          setProgress(100);
        }
      } catch (err) {
        console.error(
          "Unable to load resume analysis:",
          err
        );
      }
    };

  // =========================================================
  // SCAN ANOTHER
  // =========================================================

  const handleChooseAnother = () => {
    stopAnimations();

    setResumeFile(null);
    setAnalysis(null);
    setScanComplete(false);
    setProgress(0);

    setScanStage(
      "Preparing scanner..."
    );

    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // =========================================================
  // LOAD
  // =========================================================

  useEffect(() => {
    loadExistingAnalysis();

    return () => {
      stopAnimations();
    };
  }, []);

  // =========================================================
  // ANALYSIS VALUES
  // =========================================================

  const matchedSkills =
    analysis?.matchedSkills || [];

  const suggestions =
    analysis?.suggestions || [];

  const companyMatchedSkills =
    analysis?.companyMatchedSkills ||
    [];

  const companyMissingSkills =
    analysis?.companyMissingSkills ||
    [];

  const companySuggestions =
    analysis?.companySuggestions ||
    [];

  const atsScore = Number(
    analysis?.atsScore ?? 0
  );

  const companyMatchScore = Number(
    analysis?.companyMatchScore ?? 0
  );

  // =========================================================
  // SCORE LABEL
  // =========================================================

  const getScoreLabel = (
    score
  ) => {
    if (score >= 9) {
      return "Excellent";
    }

    if (score >= 7.5) {
      return "Good";
    }

    if (score >= 5) {
      return "Needs Improvement";
    }

    return "Needs Attention";
  };

  // =========================================================
  // SCORE PERCENTAGES
  // =========================================================

  const atsPercentage =
    Math.min(
      Math.max(
        atsScore * 10,
        0
      ),
      100
    );

  const companyPercentage =
    Math.min(
      Math.max(
        companyMatchScore * 10,
        0
      ),
      100
    );

  // =========================================================
  // UI
  // =========================================================

  return (
    <PortalLayout
      title="AI Resume Analyzer"
      subtitle="Analyze your resume and compare it with your target company and role."
    >
      <div className="resume-common-page">

        {/* =====================================================
            PAGE INTRO
        ====================================================== */}

        <div className="resume-page-header">

          <div>
            <span className="resume-eyebrow">
              AI RESUME ANALYSIS
            </span>

            <h1>
              Company Resume Analyzer
            </h1>

            <p>
              Analyze your resume and
              compare your skills with
              the selected company and
              target role.
            </p>
          </div>

          <div className="scanner-status">
            <span className="status-dot" />

            {scanComplete
              ? "Latest Scan Ready"
              : "Resume Scanner Ready"}
          </div>

        </div>

        {/* =====================================================
            HIDDEN FILE INPUT
        ====================================================== */}

        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={
            handleFileSelect
          }
          className="hidden-file-input"
        />

        {/* =====================================================
            UPLOAD
        ====================================================== */}

        {!uploading &&
          !analysis && (

            <section className="upload-card">

              <div className="upload-icon">
                ↑
              </div>

              <h2>
                Analyze your resume
              </h2>

              <p>
                Select your target company
                and role, then upload your
                resume for analysis.
              </p>

              <div className="company-selection-grid">

                <div className="company-field">

                  <label>
                    Target Company
                  </label>

                  <select
                    value={
                      targetCompany
                    }
                    onChange={
                      handleCompanyChange
                    }
                  >
                    <option value="">
                      Select Company
                    </option>

                    {Object.keys(
                      companyRoles
                    ).map(
                      (company) => (
                        <option
                          key={company}
                          value={company}
                        >
                          {company}
                        </option>
                      )
                    )}
                  </select>

                </div>

                <div className="company-field">

                  <label>
                    Target Role
                  </label>

                  <select
                    value={
                      targetRole
                    }
                    onChange={(event) => {
                      setTargetRole(
                        event.target.value
                      );

                      setError("");
                    }}
                    disabled={
                      !targetCompany
                    }
                  >
                    <option value="">
                      Select Role
                    </option>

                    {targetCompany &&
                      companyRoles[
                        targetCompany
                      ]?.map(
                        (role) => (
                          <option
                            key={role}
                            value={role}
                          >
                            {role}
                          </option>
                        )
                      )}
                  </select>

                </div>

              </div>

              <div
                className="upload-drop-zone"
                onClick={() =>
                  fileInputRef.current?.click()
                }
              >
                <div className="pdf-icon">
                  PDF
                </div>

                {resumeFile ? (
                  <>
                    <strong>
                      {resumeFile.name}
                    </strong>

                    <span>
                      {(
                        resumeFile.size /
                        1024 /
                        1024
                      ).toFixed(2)}{" "}
                      MB
                    </span>
                  </>
                ) : (
                  <>
                    <strong>
                      Choose Resume
                    </strong>

                    <span>
                      PDF only • Maximum
                      5 MB
                    </span>
                  </>
                )}
              </div>

              {resumeFile && (
                <button
                  type="button"
                  className="analyze-button"
                  onClick={
                    handleUpload
                  }
                >
                  <span>
                    ✦
                  </span>

                  Analyze for{" "}
                  {targetCompany ||
                    "Target Company"}
                </button>
              )}

              {error && (
                <div className="resume-error">
                  {error}
                </div>
              )}

            </section>
          )}

        {/* =====================================================
            SCANNER
        ====================================================== */}

        {uploading && (

          <section className="scanner-container">

            <div className="scanner-top">

              <div>
                <span className="live-badge">
                  ● LIVE SCAN
                </span>

                <h2>
                  Resume Analysis
                </h2>
              </div>

              <strong className="scan-percentage">
                {progress}%
              </strong>

            </div>

            <div className="scanner-content">

              <div className="document-scanner">

                <span className="corner corner-tl" />
                <span className="corner corner-tr" />
                <span className="corner corner-bl" />
                <span className="corner corner-br" />

                <div className="resume-document">

                  <div className="document-avatar" />
                  <div className="document-title-line" />
                  <div className="document-small-line" />

                  <div className="document-section">
                    EDUCATION
                  </div>

                  <div className="document-line long" />
                  <div className="document-line medium" />

                  <div className="document-section">
                    TECHNICAL SKILLS
                  </div>

                  <div className="detected-row">
                    <span className="detected-skill">
                      Java
                    </span>

                    <span className="detected-check">
                      ✓
                    </span>
                  </div>

                  <div className="detected-row">
                    <span className="detected-skill">
                      SQL
                    </span>

                    <span className="detected-check">
                      ✓
                    </span>
                  </div>

                  <div className="document-section">
                    PROJECTS
                  </div>

                  <div className="document-line long" />
                  <div className="document-line medium" />
                  <div className="document-line short" />

                </div>

                <div className="advanced-scan-beam">
                  <span />
                </div>

                <div className="scan-grid" />

                <div className="floating-detection detection-one">
                  PDF ✓
                </div>

                <div className="floating-detection detection-two">
                  SKILLS ✓
                </div>

                <div className="floating-detection detection-three">
                  MATCH
                </div>

              </div>

              <div className="scan-details">

                <div className="ai-orb">
                  <div className="ai-orb-inner">
                    CP
                  </div>
                </div>

                <span className="scan-stage-number">
                  COMPANY MATCH IN PROGRESS
                </span>

                <h3>
                  {scanStage}
                </h3>

                <p>
                  Comparing your resume
                  with the configured
                  profile for{" "}
                  <strong>
                    {targetCompany}
                  </strong>{" "}
                  — {targetRole}.
                </p>

                <div className="scan-progress-track">
                  <div
                    className="scan-progress-value"
                    style={{
                      width:
                        `${progress}%`
                    }}
                  />
                </div>

                <div className="scanner-checks">

                  <div
                    className={
                      progress >= 30
                        ? "scanner-check active"
                        : "scanner-check"
                    }
                  >
                    <span>✓</span>
                    Text extraction
                  </div>

                  <div
                    className={
                      progress >= 55
                        ? "scanner-check active"
                        : "scanner-check"
                    }
                  >
                    <span>✓</span>
                    Skill detection
                  </div>

                  <div
                    className={
                      progress >= 68
                        ? "scanner-check active"
                        : "scanner-check"
                    }
                  >
                    <span>✓</span>
                    Role keywords
                  </div>

                  <div
                    className={
                      progress >= 88
                        ? "scanner-check active"
                        : "scanner-check"
                    }
                  >
                    <span>✓</span>
                    Company matching
                  </div>

                </div>

              </div>

            </div>

          </section>
        )}

        {/* =====================================================
            RESULTS
        ====================================================== */}

        {analysis &&
          !uploading && (

            <section className="analysis-results">

              <div className="scan-complete-banner">

                <div className="complete-check">
                  ✓
                </div>

                <div>
                  <span>
                    ANALYSIS COMPLETE
                  </span>

                  <h2>
                    Resume analysis completed
                  </h2>

                  <p>
                    Your CareerPilot resume
                    report is ready.
                  </p>
                </div>

                <button
                  type="button"
                  className="new-scan-button"
                  onClick={
                    handleChooseAnother
                  }
                >
                  Scan Another Resume
                </button>

              </div>

              {/* =================================================
                  SCORES
              ================================================= */}

              <div className="ats-overview-grid">

                <div className="ats-score-panel">

                  <span className="card-label">
                    GENERAL ATS SCORE
                  </span>

                  <div
                    className="score-circle"
                    style={{
                      background: `conic-gradient(
                        #5b3df5 0% ${atsPercentage}%,
                        #e8ebf2 ${atsPercentage}% 100%
                      )`
                    }}
                  >
                    <div className="score-circle-inner">
                      <strong>
                        {atsScore.toFixed(1)}
                      </strong>

                      <span>
                        /10
                      </span>
                    </div>
                  </div>

                  <h3>
                    {getScoreLabel(
                      atsScore
                    )}
                  </h3>

                  <p>
                    CareerPilot ATS-style
                    score based on resume
                    structure, skills and
                    keyword checks.
                  </p>

                </div>

                <div className="ats-score-panel company-score-panel">

                  <span className="card-label">
                    {analysis.targetCompany ||
                      targetCompany}{" "}
                    MATCH SCORE
                  </span>

                  <div
                    className="score-circle"
                    style={{
                      background: `conic-gradient(
                        #3155d9 0% ${companyPercentage}%,
                        #e8ebf2 ${companyPercentage}% 100%
                      )`
                    }}
                  >
                    <div className="score-circle-inner">
                      <strong>
                        {companyMatchScore.toFixed(
                          1
                        )}
                      </strong>

                      <span>
                        /10
                      </span>
                    </div>
                  </div>

                  <h3>
                    {getScoreLabel(
                      companyMatchScore
                    )}
                  </h3>

                  <p>
                    Match for{" "}
                    <strong>
                      {analysis.targetRole ||
                        targetRole}
                    </strong>
                  </p>

                </div>

                <div className="analysis-summary">

                  <div className="summary-card">
                    <div className="summary-icon">
                      ✓
                    </div>

                    <div>
                      <span>
                        Company Skills Matched
                      </span>

                      <strong>
                        {
                          companyMatchedSkills.length
                        }
                      </strong>
                    </div>
                  </div>

                  <div className="summary-card">
                    <div className="summary-icon">
                      !
                    </div>

                    <div>
                      <span>
                        Skills To Improve
                      </span>

                      <strong>
                        {
                          companyMissingSkills.length
                        }
                      </strong>
                    </div>
                  </div>

                  <div className="summary-card">
                    <div className="summary-icon">
                      ✦
                    </div>

                    <div>
                      <span>
                        Recommendations
                      </span>

                      <strong>
                        {
                          companySuggestions.length
                        }
                      </strong>
                    </div>
                  </div>

                </div>

              </div>

              {/* =================================================
                  TARGET
              ================================================= */}

              <div className="target-company-result">

                <span>
                  TARGET PROFILE
                </span>

                <h2>
                  {analysis.targetCompany ||
                    targetCompany}
                </h2>

                <p>
                  {analysis.targetRole ||
                    targetRole}
                </p>

                <small>
                  This is a CareerPilot
                  company-role match based
                  on configured skills and
                  resume content. It is not
                  the company's private ATS
                  score.
                </small>

              </div>

              {/* =================================================
                  COMPANY SKILLS
              ================================================= */}

              <div className="result-grid">

                <div className="result-card">

                  <div className="result-card-header">

                    <div>
                      <span className="result-icon">
                        ✓
                      </span>

                      <h3>
                        Company Skills Matched
                      </h3>
                    </div>

                    <span className="result-count">
                      {
                        companyMatchedSkills.length
                      }
                    </span>

                  </div>

                  {companyMatchedSkills.length >
                  0 ? (

                    <div className="skill-tags">
                      {companyMatchedSkills.map(
                        (skill) => (
                          <span
                            className="skill-tag matched"
                            key={skill}
                          >
                            ✓ {skill}
                          </span>
                        )
                      )}
                    </div>

                  ) : (

                    <p className="empty-result">
                      No target-company
                      skills were detected
                      in this resume.
                    </p>

                  )}

                </div>

                <div className="result-card">

                  <div className="result-card-header">

                    <div>
                      <span className="result-icon warning">
                        !
                      </span>

                      <h3>
                        Recommended Skills
                      </h3>
                    </div>

                    <span className="result-count">
                      {
                        companyMissingSkills.length
                      }
                    </span>

                  </div>

                  {companyMissingSkills.length >
                  0 ? (

                    <div className="skill-tags">
                      {companyMissingSkills.map(
                        (skill) => (
                          <span
                            className="skill-tag missing"
                            key={skill}
                          >
                            + {skill}
                          </span>
                        )
                      )}
                    </div>

                  ) : (

                    <p className="empty-result">
                      Excellent. All
                      configured role skills
                      were detected.
                    </p>

                  )}

                </div>

              </div>

              {/* =================================================
                  COMPANY RECOMMENDATIONS
              ================================================= */}

              <div className="recommendation-card">

                <div className="recommendation-heading">

                  <div className="recommendation-icon">
                    ✦
                  </div>

                  <div>
                    <span>
                      COMPANY MATCH INSIGHTS
                    </span>

                    <h3>
                      {analysis.targetCompany ||
                        targetCompany}{" "}
                      Recommendations
                    </h3>
                  </div>

                </div>

                {companySuggestions.length >
                0 ? (

                  <div className="suggestion-list">

                    {companySuggestions.map(
                      (
                        suggestion,
                        index
                      ) => (
                        <div
                          className="suggestion-item"
                          key={index}
                        >
                          <span>
                            {index + 1}
                          </span>

                          <p>
                            {suggestion}
                          </p>
                        </div>
                      )
                    )}

                  </div>

                ) : (

                  <div className="excellent-resume">
                    ✓ Strong match for the
                    selected company and
                    role.
                  </div>

                )}

              </div>

              {/* =================================================
                  GENERAL ATS
              ================================================= */}

              <div className="result-grid general-analysis-grid">

                <div className="result-card">

                  <div className="result-card-header">

                    <div>
                      <span className="result-icon">
                        ✓
                      </span>

                      <h3>
                        Resume Skills Detected
                      </h3>
                    </div>

                    <span className="result-count">
                      {matchedSkills.length}
                    </span>

                  </div>

                  {matchedSkills.length >
                  0 ? (

                    <div className="skill-tags">
                      {matchedSkills.map(
                        (skill) => (
                          <span
                            className="skill-tag matched"
                            key={skill}
                          >
                            ✓ {skill}
                          </span>
                        )
                      )}
                    </div>

                  ) : (

                    <p className="empty-result">
                      No saved CareerPilot
                      skills were detected.
                    </p>

                  )}

                </div>

                <div className="result-card">

                  <div className="result-card-header">

                    <div>
                      <span className="result-icon warning">
                        !
                      </span>

                      <h3>
                        General ATS Suggestions
                      </h3>
                    </div>

                    <span className="result-count">
                      {suggestions.length}
                    </span>

                  </div>

                  {suggestions.length > 0 ? (

                    <div className="suggestion-list">

                      {suggestions.map(
                        (
                          suggestion,
                          index
                        ) => (
                          <div
                            className="suggestion-item"
                            key={index}
                          >
                            <span>
                              {index + 1}
                            </span>

                            <p>
                              {suggestion}
                            </p>
                          </div>
                        )
                      )}

                    </div>

                  ) : (

                    <p className="empty-result">
                      No additional ATS
                      suggestions.
                    </p>

                  )}

                </div>

              </div>

            </section>
          )}

        {!uploading &&
          analysis &&
          error && (
            <div className="resume-error">
              {error}
            </div>
          )}

      </div>
    </PortalLayout>
  );
}

export default Resume;
