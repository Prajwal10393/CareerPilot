import {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import PortalLayout from "../components/PortalLayout";
import "../App.css";

const API_URL =
  "http://localhost:5000";

function Skills() {
  const navigate =
    useNavigate();

  const [skills, setSkills] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const token =
    localStorage.getItem("token");

  // =========================================================
  // FETCH SKILLS
  // =========================================================

  const fetchSkills = async () => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        navigate("/login");
        return;
      }

      const response =
        await fetch(
          `${API_URL}/api/student/skills`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      const data =
        await response.json();

      if (
        response.status === 401
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

        navigate("/login");

        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load skills"
        );
      }

      setSkills(
        data.skills ||
          data.data ||
          []
      );
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Unable to load skills"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();

    window.scrollTo(0, 0);
  }, []);

  // =========================================================
  // SKILL SCORE
  // =========================================================

  const getScore = (skill) => {
    if (
      typeof skill.score ===
      "number"
    ) {
      return skill.score;
    }

    if (
      typeof skill.proficiency ===
      "number"
    ) {
      return skill.proficiency;
    }

    const level = String(
      skill.level || ""
    ).toLowerCase();

    if (level === "advanced") {
      return 90;
    }

    if (
      level === "intermediate"
    ) {
      return 70;
    }

    if (level === "beginner") {
      return 40;
    }

    return 0;
  };

  // =========================================================
  // SKILL GROUPS
  // =========================================================

  const strongSkills =
    useMemo(
      () =>
        skills.filter(
          (skill) =>
            getScore(skill) >= 70
        ),
      [skills]
    );

  const improveSkills =
    useMemo(
      () =>
        skills.filter(
          (skill) => {
            const score =
              getScore(skill);

            return (
              score >= 40 &&
              score < 70
            );
          }
        ),
      [skills]
    );

  const beginnerSkills =
    useMemo(
      () =>
        skills.filter(
          (skill) =>
            getScore(skill) < 40
        ),
      [skills]
    );

  // =========================================================
  // OVERALL SCORE
  // =========================================================

  const overallScore =
    useMemo(() => {
      if (
        skills.length === 0
      ) {
        return 0;
      }

      const total =
        skills.reduce(
          (sum, skill) =>
            sum +
            getScore(skill),
          0
        );

      return Math.round(
        total /
          skills.length
      );
    }, [skills]);

  // =========================================================
  // DELETE SKILL
  // =========================================================

  const handleDelete =
    async (id) => {
      const confirmed =
        window.confirm(
          "Are you sure you want to delete this skill?"
        );

      if (!confirmed) {
        return;
      }

      try {
        const response =
          await fetch(
            `${API_URL}/api/student/skills/${id}`,
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
              "Unable to delete skill"
          );
        }

        await fetchSkills();
      } catch (err) {
        alert(
          err.message ||
            "Unable to delete skill"
        );
      }
    };

  // =========================================================
  // UI
  // =========================================================

  return (
    <PortalLayout
      title="Skills"
      subtitle="Track your technical skills and improve your placement readiness."
    >
      <div className="skills-common-page">

        {loading ? (

          <div className="skills-loading">
            <h2>
              Loading skills...
            </h2>

            <p>
              Preparing your skill
              analysis.
            </p>
          </div>

        ) : (

          <>
            {/* ===============================================
                HERO
            =============================================== */}

            <section className="skills-hero">

              <div className="skills-hero-top">

                <div>
                  <span className="skills-badge">
                    SKILL INSIGHTS
                  </span>

                  <h1>
                    Skill Gap Analysis
                  </h1>

                  <p>
                    Add and manage your
                    technical skills to
                    improve placement
                    readiness.
                  </p>
                </div>

                <Link
                  to="/skills/add"
                  className="skills-add-btn"
                >
                  + Add Skill
                </Link>

              </div>

              {/* =============================================
                  SKILL GROUPS
              ============================================= */}

              <div className="skills-summary-grid">

                <div className="skills-summary-card">

                  <h3>
                    Strong Skills
                  </h3>

                  <div className="skills-tag-list">

                    {strongSkills.length >
                    0 ? (

                      strongSkills.map(
                        (skill) => (
                          <span
                            key={
                              skill._id
                            }
                            className="skill-tag strong"
                          >
                            {skill.name}
                          </span>
                        )
                      )

                    ) : (

                      <p>
                        No strong skills yet
                      </p>

                    )}

                  </div>

                </div>

                <div className="skills-summary-card">

                  <h3>
                    Skills to Improve
                  </h3>

                  <div className="skills-tag-list">

                    {improveSkills.length >
                    0 ? (

                      improveSkills.map(
                        (skill) => (
                          <span
                            key={
                              skill._id
                            }
                            className="skill-tag improve"
                          >
                            {skill.name}
                          </span>
                        )
                      )

                    ) : (

                      <p>
                        No skills in this
                        range
                      </p>

                    )}

                  </div>

                </div>

                <div className="skills-summary-card">

                  <h3>
                    Beginner Skills
                  </h3>

                  <div className="skills-tag-list">

                    {beginnerSkills.length >
                    0 ? (

                      beginnerSkills.map(
                        (skill) => (
                          <span
                            key={
                              skill._id
                            }
                            className="skill-tag beginner"
                          >
                            {skill.name}
                          </span>
                        )
                      )

                    ) : (

                      <p>
                        No beginner skills
                      </p>

                    )}

                  </div>

                </div>

              </div>

              {/* =============================================
                  OVERALL SCORE
              ============================================= */}

              <div className="skills-overall-score">

                <div className="skills-score-header">

                  <span>
                    Overall Skill Score
                  </span>

                  <strong>
                    {overallScore}%
                  </strong>

                </div>

                <div className="skills-score-track">

                  <div
                    className="skills-score-fill"
                    style={{
                      width:
                        `${Math.min(
                          overallScore,
                          100
                        )}%`
                    }}
                  />

                </div>

              </div>

            </section>

            {/* ===============================================
                SKILLS ADDED
            =============================================== */}

            <section className="skills-added-section">

              <div className="skills-section-heading">

                <span>
                  MY SKILLS
                </span>

                <h2>
                  Skills Added
                </h2>

                <p>
                  These skills are stored
                  in your CareerPilot
                  profile.
                </p>

              </div>

              {/* ERROR */}

              {error && (
                <div className="skills-error">

                  <h3>
                    Unable to load skills
                  </h3>

                  <p>
                    {error}
                  </p>

                  <button
                    type="button"
                    className="skills-retry-btn"
                    onClick={
                      fetchSkills
                    }
                  >
                    Try Again
                  </button>

                </div>
              )}

              {/* EMPTY */}

              {!error &&
                skills.length === 0 && (

                  <div className="skills-empty">

                    <div className="skills-empty-icon">
                      ✦
                    </div>

                    <h3>
                      No skills added yet
                    </h3>

                    <p>
                      Add your first
                      technical skill to
                      start your skill-gap
                      analysis.
                    </p>

                    <Link
                      to="/skills/add"
                      className="skills-empty-btn"
                    >
                      + Add Skill
                    </Link>

                  </div>
                )}

              {/* =============================================
                  SKILL CARDS
              ============================================= */}

              {!error &&
                skills.length > 0 && (

                  <div className="skills-added-grid">

                    {skills.map(
                      (skill) => {
                        const score =
                          getScore(
                            skill
                          );

                        return (
                          <article
                            className="skill-added-card"
                            key={
                              skill._id
                            }
                          >

                            <div className="skill-card-header">

                              <span className="skill-category">
                                {skill.category ||
                                  "Technical"}
                              </span>

                              <span className="skill-score-badge">
                                {score}%
                              </span>

                            </div>

                            <h3>
                              {skill.name}
                            </h3>

                            <p className="skill-level">
                              Level:{" "}
                              <strong>
                                {skill.level ||
                                  "Not specified"}
                              </strong>
                            </p>

                            <div className="skill-score-row">

                              <span>
                                Proficiency
                              </span>

                              <strong>
                                {score}%
                              </strong>

                            </div>

                            <div className="skill-card-progress">

                              <div
                                className="skill-card-progress-fill"
                                style={{
                                  width:
                                    `${Math.min(
                                      score,
                                      100
                                    )}%`
                                }}
                              />

                            </div>

                            <div className="skill-card-actions">

                              <Link
                                to={`/skills/add?edit=${skill._id}`}
                                className="skill-edit-btn"
                              >
                                Edit
                              </Link>

                              <button
                                type="button"
                                className="skill-delete-btn"
                                onClick={() =>
                                  handleDelete(
                                    skill._id
                                  )
                                }
                              >
                                Delete
                              </button>

                            </div>

                          </article>
                        );
                      }
                    )}

                  </div>
                )}

            </section>
          </>
        )}

      </div>
    </PortalLayout>
  );
}

export default Skills;
