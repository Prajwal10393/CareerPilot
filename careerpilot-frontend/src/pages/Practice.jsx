import "../App.css";
import { useEffect, useState } from "react";
import PortalLayout from "../components/PortalLayout";

const API_URL = "https://careerpilot-wxja.onrender.com";

function Practice() {
  // =========================================================
  // PRACTICE CATEGORIES
  // =========================================================

  const categories = [
    {
      name: "Aptitude",
      questions: 20,
      difficulty: "Beginner"
    },
    {
      name: "Logical Reasoning",
      questions: 18,
      difficulty: "Intermediate"
    },
    {
      name: "Verbal Ability",
      questions: 15,
      difficulty: "Beginner"
    },
    {
      name: "Java",
      questions: 25,
      difficulty: "Intermediate"
    },
    {
      name: "SQL",
      questions: 20,
      difficulty: "Intermediate"
    },
    {
      name: "JavaScript",
      questions: 20,
      difficulty: "Intermediate"
    },
    {
      name: "React",
      questions: 18,
      difficulty: "Intermediate"
    },
    {
      name: "DBMS",
      questions: 22,
      difficulty: "Intermediate"
    },
    {
      name: "Operating Systems",
      questions: 20,
      difficulty: "Intermediate"
    },
    {
      name: "Computer Networks",
      questions: 18,
      difficulty: "Intermediate"
    },
    {
      name: "HR Questions",
      questions: 15,
      difficulty: "Beginner"
    }
  ];

  // =========================================================
  // DASHBOARD STATE
  // =========================================================

  const [
    dashboardData,
    setDashboardData
  ] = useState(null);

  const [
    loadingDashboard,
    setLoadingDashboard
  ] = useState(true);

  const [
    dashboardError,
    setDashboardError
  ] = useState("");

  // =========================================================
  // PRACTICE STATE
  // =========================================================

  const [
    selectedCategory,
    setSelectedCategory
  ] = useState(null);

  const [
    practiceQuestions,
    setPracticeQuestions
  ] = useState([]);

  const [
    selectedAnswers,
    setSelectedAnswers
  ] = useState({});

  const [
    loadingQuestions,
    setLoadingQuestions
  ] = useState(false);

  const [
    submitting,
    setSubmitting
  ] = useState(false);

  const [
    practiceResult,
    setPracticeResult
  ] = useState(null);

  const [
    practiceError,
    setPracticeError
  ] = useState("");

  // =========================================================
  // INTERVIEW GENERATOR
  // =========================================================

  const [aiForm, setAiForm] = useState({
    company: "Google",
    role: "Software Engineer",
    interviewType: "Technical",
    difficulty: "Medium"
  });

  const [
    aiQuestions,
    setAiQuestions
  ] = useState([]);

  const [
    aiLoading,
    setAiLoading
  ] = useState(false);

  const [
    aiError,
    setAiError
  ] = useState("");

  const [
    openAnswerId,
    setOpenAnswerId
  ] = useState(null);

  const companyRoles = {
    Google: ["Software Engineer"],
    Amazon: ["SDE"],
    Microsoft: ["Software Engineer"],
    TCS: ["Graduate Engineer"],
    Infosys: ["System Engineer"],
    Cognizant: ["GenC"],
    IBM: [
      "Associate Software Engineer"
    ],
    Capgemini: ["Software Engineer"],
    PhonePe: ["Backend Developer"],
    Flipkart: ["SDE"]
  };

  // =========================================================
  // TOKEN
  // =========================================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // =========================================================
  // LOAD PRACTICE DASHBOARD
  // =========================================================

  const loadPracticeDashboard =
    async () => {
      try {
        setLoadingDashboard(true);
        setDashboardError("");

        const token = getToken();

        if (!token) {
          setDashboardError(
            "Login session not found."
          );
          return;
        }

        const response = await fetch(
          `${API_URL}/api/student/practice/dashboard`,
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
              "Unable to load practice dashboard."
          );
        }

        setDashboardData(data);
      } catch (error) {
        console.error(
          "Practice dashboard error:",
          error
        );

        setDashboardError(
          error.message ||
            "Unable to load practice dashboard."
        );
      } finally {
        setLoadingDashboard(false);
      }
    };

  useEffect(() => {
    loadPracticeDashboard();
  }, []);

  // =========================================================
  // CATEGORY PERFORMANCE
  // =========================================================

  const getCategoryProgress = (
    categoryName
  ) => {
    const performance =
      dashboardData?.categoryPerformance?.find(
        (item) =>
          item.category === categoryName
      );

    if (!performance) {
      return 0;
    }

    return Math.round(
      Number(
        performance.accuracy || 0
      )
    );
  };

  // =========================================================
  // START PRACTICE
  // =========================================================

  const handleStartPractice =
    async (category) => {
      try {
        setPracticeError("");
        setPracticeResult(null);
        setSelectedAnswers({});
        setLoadingQuestions(true);

        const token = getToken();

        if (!token) {
          setPracticeError(
            "Login session not found."
          );
          return;
        }

        const response = await fetch(
          `${API_URL}/api/student/practice/questions?category=${encodeURIComponent(
            category.name
          )}`,
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
              "Unable to load questions."
          );
        }

        if (
          !data.questions ||
          data.questions.length === 0
        ) {
          throw new Error(
            `No questions available for ${category.name}.`
          );
        }

        setSelectedCategory(category);
        setPracticeQuestions(
          data.questions
        );

        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      } catch (error) {
        console.error(
          "Load questions error:",
          error
        );

        setPracticeError(
          error.message ||
            "Unable to load practice questions."
        );
      } finally {
        setLoadingQuestions(false);
      }
    };

  // =========================================================
  // ANSWER
  // =========================================================

  const handleAnswerChange = (
    questionId,
    optionIndex
  ) => {
    setSelectedAnswers(
      (previous) => ({
        ...previous,
        [questionId]: optionIndex
      })
    );
  };

  // =========================================================
  // SUBMIT PRACTICE
  // =========================================================

  const handleSubmitPractice =
    async () => {
      try {
        setPracticeError("");

        const answeredQuestions =
          Object.keys(
            selectedAnswers
          ).length;

        if (answeredQuestions === 0) {
          setPracticeError(
            "Please answer at least one question."
          );
          return;
        }

        const token = getToken();

        if (!token) {
          setPracticeError(
            "Login session not found."
          );
          return;
        }

        const answers =
          practiceQuestions
            .filter(
              (question) =>
                selectedAnswers[
                  question._id
                ] !== undefined
            )
            .map((question) => ({
              questionId:
                question._id,

              selectedAnswer:
                selectedAnswers[
                  question._id
                ]
            }));

        setSubmitting(true);

        const response = await fetch(
          `${API_URL}/api/student/practice/submit`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`
            },

            body: JSON.stringify({
              category:
                selectedCategory.name,

              difficulty:
                selectedCategory.difficulty,

              answers
            })
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to submit practice test."
          );
        }

        setPracticeResult(
          data.result
        );

        await loadPracticeDashboard();

        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      } catch (error) {
        console.error(
          "Practice submit error:",
          error
        );

        setPracticeError(
          error.message ||
            "Unable to submit practice test."
        );
      } finally {
        setSubmitting(false);
      }
    };

  // =========================================================
  // EXIT PRACTICE
  // =========================================================

  const handleExitPractice = () => {
    setSelectedCategory(null);
    setPracticeQuestions([]);
    setSelectedAnswers({});
    setPracticeResult(null);
    setPracticeError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // =========================================================
  // TRY AGAIN
  // =========================================================

  const handleTryAgain = () => {
    setSelectedAnswers({});
    setPracticeResult(null);
    setPracticeError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // =========================================================
  // INTERVIEW GENERATOR FORM
  // =========================================================

  const handleAiChange = (
    event
  ) => {
    const { name, value } =
      event.target;

    if (name === "company") {
      const roles =
        companyRoles[value] || [];

      setAiForm((previous) => ({
        ...previous,
        company: value,
        role:
          roles.length > 0
            ? roles[0]
            : ""
      }));

      return;
    }

    setAiForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  // =========================================================
  // GENERATE QUESTIONS
  // =========================================================

  const handleGenerate =
    async () => {
      try {
        setAiLoading(true);
        setAiError("");
        setAiQuestions([]);
        setOpenAnswerId(null);

        const token = getToken();

        if (!token) {
          throw new Error(
            "Login session not found."
          );
        }

        const response = await fetch(
          `${API_URL}/api/student/interview-questions/generate`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`
            },

            body:
              JSON.stringify(aiForm)
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to generate interview questions."
          );
        }

        setAiQuestions(
          data.questions || []
        );
      } catch (error) {
        console.error(
          "Interview generator error:",
          error
        );

        setAiError(
          error.message ||
            "Unable to generate interview questions."
        );
      } finally {
        setAiLoading(false);
      }
    };

  // =========================================================
  // SUMMARY
  // =========================================================

  const questionsAttempted =
    dashboardData?.summary
      ?.questionsAttempted ?? 0;

  const correctAnswers =
    dashboardData?.summary
      ?.correctAnswers ?? 0;

  const accuracy =
    dashboardData?.summary
      ?.accuracy ?? 0;

  const practiceStreak =
    dashboardData?.summary
      ?.practiceStreak ?? 0;

  // =========================================================
  // PRACTICE TEST SCREEN
  // =========================================================

  if (selectedCategory) {
    return (
      <PortalLayout
        title={`${selectedCategory.name} Practice`}
        subtitle="Answer the questions and submit your test to view your result."
      >
        <div className="practice-common-page">

          <div className="practice-heading">
            <div>
              <button
                type="button"
                className="practice-back-btn"
                onClick={
                  handleExitPractice
                }
              >
                ← Back to Practice
              </button>

              <h1>
                {selectedCategory.name}{" "}
                Practice
              </h1>

              <p>
                Complete the questions below
                and submit your answers.
              </p>
            </div>

            <div className="practice-answered-box">
              <strong>
                {
                  Object.keys(
                    selectedAnswers
                  ).length
                }
                {" / "}
                {
                  practiceQuestions.length
                }
              </strong>

              <span>
                Answered
              </span>
            </div>
          </div>

          {practiceError && (
            <div className="practice-error-message">
              {practiceError}
            </div>
          )}

          {practiceResult ? (
            <section className="practice-performance-card">
              <div className="practice-result-content">
                <h2>
                  Practice Completed 🎉
                </h2>

                <p>
                  {
                    practiceResult.category
                  }
                </p>

                <div className="practice-summary-grid practice-result-summary">
                  <div className="practice-summary-card">
                    <span>
                      Score
                    </span>

                    <strong>
                      {Number(
                        practiceResult.score
                      ).toFixed(1)}
                      %
                    </strong>
                  </div>

                  <div className="practice-summary-card">
                    <span>
                      Correct
                    </span>

                    <strong>
                      {
                        practiceResult.correctAnswers
                      }
                    </strong>
                  </div>

                  <div className="practice-summary-card">
                    <span>
                      Wrong
                    </span>

                    <strong>
                      {
                        practiceResult.wrongAnswers
                      }
                    </strong>
                  </div>

                  <div className="practice-summary-card">
                    <span>
                      Accuracy
                    </span>

                    <strong>
                      {Number(
                        practiceResult.accuracy
                      ).toFixed(1)}
                      %
                    </strong>
                  </div>
                </div>

                <div className="practice-result-actions">
                  <button
                    type="button"
                    className="practice-try-again-btn"
                    onClick={
                      handleTryAgain
                    }
                  >
                    Try Again
                  </button>

                  <button
                    type="button"
                    className="practice-dashboard-btn"
                    onClick={
                      handleExitPractice
                    }
                  >
                    Practice Dashboard
                  </button>
                </div>
              </div>
            </section>
          ) : (
            <>
              <div className="practice-question-list">
                {practiceQuestions.map(
                  (
                    question,
                    questionIndex
                  ) => (
                    <div
                      className="practice-question-card"
                      key={
                        question._id
                      }
                    >
                      <span>
                        Question{" "}
                        {questionIndex +
                          1}
                      </span>

                      <h3>
                        {
                          question.question
                        }
                      </h3>

                      <p>
                        {
                          question.difficulty
                        }
                      </p>

                      <div className="practice-options">
                        {question.options.map(
                          (
                            option,
                            optionIndex
                          ) => {
                            const selected =
                              selectedAnswers[
                                question
                                  ._id
                              ] ===
                              optionIndex;

                            return (
                              <label
                                key={
                                  optionIndex
                                }
                                className={`practice-option ${
                                  selected
                                    ? "selected"
                                    : ""
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={
                                    question._id
                                  }
                                  checked={
                                    selected
                                  }
                                  onChange={() =>
                                    handleAnswerChange(
                                      question._id,
                                      optionIndex
                                    )
                                  }
                                />

                                <span>
                                  {
                                    option
                                  }
                                </span>
                              </label>
                            );
                          }
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>

              <div className="practice-submit-container">
                <button
                  type="button"
                  className="practice-submit-btn"
                  onClick={
                    handleSubmitPractice
                  }
                  disabled={
                    submitting
                  }
                >
                  {submitting
                    ? "Submitting..."
                    : "Submit Practice Test"}
                </button>
              </div>
            </>
          )}
        </div>
      </PortalLayout>
    );
  }

  // =========================================================
  // MAIN PRACTICE DASHBOARD
  // =========================================================

  return (
    <PortalLayout
      title="Practice"
      subtitle="Prepare for aptitude, technical, coding and HR recruitment rounds."
    >
      <div className="practice-common-page">

        <div className="practice-heading">
          <div>
            <span className="dashboard-section-label">
              PLACEMENT PREPARATION
            </span>

            <h1>
              Placement Practice
            </h1>

            <p>
              Practice aptitude,
              technical, coding and HR
              recruitment questions.
            </p>
          </div>
        </div>

        {dashboardError && (
          <div className="practice-error-message">
            {dashboardError}
          </div>
        )}

        {/* SUMMARY */}

        <div className="practice-summary-grid">
          <div className="practice-summary-card">
            <span>
              Questions Attempted
            </span>

            <strong>
              {loadingDashboard
                ? "..."
                : questionsAttempted}
            </strong>
          </div>

          <div className="practice-summary-card">
            <span>
              Correct Answers
            </span>

            <strong>
              {loadingDashboard
                ? "..."
                : correctAnswers}
            </strong>
          </div>

          <div className="practice-summary-card">
            <span>
              Accuracy
            </span>

            <strong>
              {loadingDashboard
                ? "..."
                : `${Number(
                    accuracy
                  ).toFixed(1)}%`}
            </strong>
          </div>

          <div className="practice-summary-card">
            <span>
              Practice Streak
            </span>

            <strong>
              {loadingDashboard
                ? "..."
                : `${practiceStreak} ${
                    practiceStreak === 1
                      ? "Day"
                      : "Days"
                  }`}
            </strong>
          </div>
        </div>

        {/* =====================================================
            CATEGORIES
        ====================================================== */}

        <section className="practice-section">
          <div className="practice-section-heading">
            <div>
              <h2>
                Practice Categories
              </h2>

              <p>
                Choose a topic and start
                practicing.
              </p>
            </div>
          </div>

          <div className="practice-category-grid">
            {categories.map(
              (category) => {
                const progress =
                  getCategoryProgress(
                    category.name
                  );

                return (
                  <div
                    className="practice-category-card"
                    key={
                      category.name
                    }
                  >
                    <div className="practice-category-top">
                      <div>
                        <h3>
                          {
                            category.name
                          }
                        </h3>

                        <p>
                          {
                            category.questions
                          }{" "}
                          Questions
                        </p>
                      </div>

                      <span
                        className={`practice-difficulty ${category.difficulty.toLowerCase()}`}
                      >
                        {
                          category.difficulty
                        }
                      </span>
                    </div>

                    <div className="practice-progress-row">
                      <span>
                        Performance
                      </span>

                      <strong>
                        {progress}%
                      </strong>
                    </div>

                    <div className="practice-progress">
                      <span
                        style={{
                          width:
                            `${progress}%`
                        }}
                      />
                    </div>

                    <button
                      type="button"
                      disabled={
                        loadingQuestions
                      }
                      onClick={() =>
                        handleStartPractice(
                          category
                        )
                      }
                    >
                      {loadingQuestions
                        ? "Loading..."
                        : "Start Practice"}
                    </button>
                  </div>
                );
              }
            )}
          </div>
        </section>

        {/* =====================================================
            INTERVIEW GENERATOR
        ====================================================== */}

        <section className="practice-ai-section">
          <div className="practice-ai-heading">
            <div>
              <span className="practice-ai-badge">
                INTERVIEW QUESTION GENERATOR
              </span>

              <h2>
                Generate Interview
                Questions
              </h2>

              <p>
                Select a company, role,
                interview type and
                difficulty to get relevant
                interview questions.
              </p>
            </div>
          </div>

          <div className="practice-ai-form">

            <div className="practice-form-group">
              <label>
                Company
              </label>

              <select
                name="company"
                value={
                  aiForm.company
                }
                onChange={
                  handleAiChange
                }
              >
                {Object.keys(
                  companyRoles
                ).map((company) => (
                  <option
                    key={company}
                    value={company}
                  >
                    {company}
                  </option>
                ))}
              </select>
            </div>

            <div className="practice-form-group">
              <label>
                Job Role
              </label>

              <select
                name="role"
                value={aiForm.role}
                onChange={
                  handleAiChange
                }
              >
                {(
                  companyRoles[
                    aiForm.company
                  ] || []
                ).map((role) => (
                  <option
                    key={role}
                    value={role}
                  >
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div className="practice-form-group">
              <label>
                Interview Type
              </label>

              <select
                name="interviewType"
                value={
                  aiForm.interviewType
                }
                onChange={
                  handleAiChange
                }
              >
                <option value="Technical">
                  Technical
                </option>

                <option value="Coding">
                  Coding
                </option>

                <option value="HR">
                  HR
                </option>

                <option value="Managerial">
                  Managerial
                </option>
              </select>
            </div>

            <div className="practice-form-group">
              <label>
                Difficulty
              </label>

              <select
                name="difficulty"
                value={
                  aiForm.difficulty
                }
                onChange={
                  handleAiChange
                }
              >
                <option value="Easy">
                  Easy
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="Hard">
                  Hard
                </option>
              </select>
            </div>

            <button
              type="button"
              onClick={
                handleGenerate
              }
              disabled={
                aiLoading
              }
            >
              {aiLoading
                ? "Generating..."
                : "Generate Questions"}
            </button>
          </div>

          {aiError && (
            <div className="practice-error-message practice-ai-error">
              {aiError}
            </div>
          )}

          {/* GENERATED QUESTIONS */}

          {aiQuestions.length > 0 && (
            <div className="practice-generated">
              <div className="practice-generated-header">
                <div>
                  <span className="practice-ai-badge">
                    GENERATED QUESTIONS
                  </span>

                  <h2>
                    {aiForm.company}
                    {" — "}
                    {aiForm.role}
                  </h2>

                  <p>
                    {
                      aiForm.interviewType
                    }
                    {" • "}
                    {
                      aiForm.difficulty
                    }
                  </p>
                </div>
              </div>

              <div className="practice-question-list">
                {aiQuestions.map(
                  (item, index) => (
                    <div
                      className="practice-question-card"
                      key={
                        item._id ||
                        index
                      }
                    >
                      <span>
                        Question{" "}
                        {index + 1}
                      </span>

                      <h3>
                        {item.question}
                      </h3>

                      {item.skills
                        ?.length >
                        0 && (
                        <p>
                          Skills:{" "}
                          {item.skills.join(
                            ", "
                          )}
                        </p>
                      )}

                      <button
                        type="button"
                        className="practice-answer-btn"
                        onClick={() =>
                          setOpenAnswerId(
                            openAnswerId ===
                              item._id
                              ? null
                              : item._id
                          )
                        }
                      >
                        {openAnswerId ===
                        item._id
                          ? "Hide Suggested Answer"
                          : "View Suggested Answer"}
                      </button>

                      {openAnswerId ===
                        item._id && (
                        <div className="practice-suggested-answer">
                          <strong>
                            Suggested
                            Answer
                          </strong>

                          <p>
                            {
                              item.suggestedAnswer
                            }
                          </p>
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </section>

        {/* =====================================================
            RECENT PERFORMANCE
        ====================================================== */}

        <section className="practice-performance-card">
          <div className="practice-section-heading">
            <div>
              <h2>
                Recent Practice
                Performance
              </h2>

              <p>
                Your latest practice
                test results.
              </p>
            </div>
          </div>

          {dashboardData
            ?.recentResults?.length >
          0 ? (
            <div className="practice-result-grid">
              {dashboardData.recentResults
                .slice(0, 4)
                .map((result) => (
                  <div
                    key={
                      result._id
                    }
                  >
                    <span>
                      {
                        result.category
                      }
                    </span>

                    <strong>
                      {
                        result.correctAnswers
                      }
                      {" / "}
                      {
                        result.attemptedQuestions
                      }
                    </strong>

                    <p>
                      {Number(
                        result.accuracy ||
                          0
                      ).toFixed(1)}
                      %
                    </p>
                  </div>
                ))}
            </div>
          ) : (
            <p>
              No practice results yet.
              Complete a practice test
              to see your performance.
            </p>
          )}
        </section>

        {/* =====================================================
            RECOMMENDATION
        ====================================================== */}

        <section className="practice-ai-recommendation">
          <div>
            <span className="practice-ai-badge">
              PRACTICE RECOMMENDATION
            </span>

            <h2>
              Continue improving your
              placement preparation
            </h2>

            <p>
              Practice technical,
              aptitude and interview
              questions regularly to
              improve your placement
              readiness.
            </p>
          </div>
        </section>

      </div>
    </PortalLayout>
  );
}

export default Practice;
