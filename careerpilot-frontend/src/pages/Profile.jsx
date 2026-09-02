import {
  useEffect,
  useMemo,
  useState
} from "react";

import { Link } from "react-router-dom";

import PortalLayout from "../components/PortalLayout";
import "../App.css";

const API_URL = "https://careerpilot-wxja.onrender.com";

function Profile() {
  const token =
    localStorage.getItem("token");

  const storedUser = JSON.parse(
    localStorage.getItem("user") ||
      "{}"
  );

  const [editing, setEditing] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [profile, setProfile] =
    useState({
      name:
        storedUser?.name ||
        "Student",

      email:
        storedUser?.email ||
        "",

      phone: "",
      course: "MCA",
      graduationYear: "2026",
      college: "",
      cgpa: "",
      backlogs: "0",
      location: "",

      targetRole:
        "Java Backend Developer",

      expectedPackage:
        "3 - 5 LPA",

      linkedin: "",
      github: "",
      bio: "",
      portfolio: ""
    });

  // =====================================================
  // FETCH PROFILE
  // =====================================================

  const fetchProfile =
    async () => {
      try {
        setLoading(true);
        setError("");

        if (!token) {
          throw new Error(
            "Login required to view profile."
          );
        }

        const response =
          await fetch(
            `${API_URL}/api/student/profile/me`,
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

        if (
          response.status === 404
        ) {
          setLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load profile"
          );
        }

        const mongoProfile =
          data.profile || {};

        setProfile(
          (previous) => ({
            ...previous,

            name:
              mongoProfile.user?.name ||
              storedUser?.name ||
              "Student",

            email:
              mongoProfile.user?.email ||
              storedUser?.email ||
              "",

            phone:
              mongoProfile.phone ||
              "",

            course:
              mongoProfile.course ||
              "MCA",

            graduationYear:
              mongoProfile.graduationYear
                ? String(
                    mongoProfile.graduationYear
                  )
                : "2026",

            college:
              mongoProfile.college ||
              "",

            cgpa:
              mongoProfile.cgpa !==
                undefined &&
              mongoProfile.cgpa !==
                null
                ? String(
                    mongoProfile.cgpa
                  )
                : "",

            backlogs:
              mongoProfile.backlogs !==
                undefined &&
              mongoProfile.backlogs !==
                null
                ? String(
                    mongoProfile.backlogs
                  )
                : "0",

            location:
              mongoProfile.city ||
              "",

            targetRole:
              mongoProfile.targetRole ||
              "Java Backend Developer",

            expectedPackage:
              mongoProfile.expectedPackage ||
              previous.expectedPackage,

            linkedin:
              mongoProfile.linkedin ||
              "",

            github:
              mongoProfile.github ||
              "",

            bio:
              mongoProfile.bio ||
              "",

            portfolio:
              mongoProfile.portfolio ||
              ""
          })
        );
      } catch (err) {
        setError(
          err.message ||
            "Unable to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchProfile();

    window.scrollTo(0, 0);
  }, []);

  // =====================================================
  // PROFILE COMPLETION
  // 10 SAVED PROFILE FIELDS = 10% EACH
  // =====================================================

  const profileCompletion =
    useMemo(() => {
      const fields = [
        profile.phone,
        profile.course,
        profile.college,
        profile.graduationYear,
        profile.cgpa,
        profile.location,
        profile.targetRole,
        profile.github,
        profile.linkedin,
        profile.portfolio
      ];

      const completed =
        fields.filter(
          (value) =>
            value !== "" &&
            value !== null &&
            value !== undefined
        ).length;

      return completed * 10;
    }, [profile]);

  // =====================================================
  // FIELD COMPLETION
  // =====================================================

  const basicComplete =
    Boolean(
      profile.phone &&
      profile.location
    );

  const educationComplete =
    Boolean(
      profile.course &&
      profile.college &&
      profile.graduationYear &&
      profile.cgpa
    );

  const careerComplete =
    Boolean(
      profile.targetRole
    );

  const linkedinComplete =
    Boolean(
      profile.linkedin
    );

  // =====================================================
  // CHANGE
  // =====================================================

  const handleChange = (
    event
  ) => {
    const {
      name,
      value
    } = event.target;

    setProfile(
      (previous) => ({
        ...previous,
        [name]: value
      })
    );

    setSaved(false);
    setError("");
  };

  // =====================================================
  // SAVE
  // =====================================================

  const handleSave =
    async (event) => {
      event.preventDefault();

      try {
        setSaving(true);
        setSaved(false);
        setError("");

        const payload = {
          phone:
            profile.phone,

          course:
            profile.course,

          college:
            profile.college,

          graduationYear:
            profile.graduationYear
              ? Number(
                  profile.graduationYear
                )
              : undefined,

          cgpa:
            profile.cgpa !== ""
              ? Number(
                  profile.cgpa
                )
              : undefined,

          backlogs:
            profile.backlogs !== ""
              ? Number(
                  profile.backlogs
                )
              : 0,

          city:
            profile.location,

          targetRole:
            profile.targetRole,

          linkedin:
            profile.linkedin,

          github:
            profile.github,

          bio:
            profile.bio,

          portfolio:
            profile.portfolio
        };

        const response =
          await fetch(
            `${API_URL}/api/student/profile/me`,
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`
              },

              body:
                JSON.stringify(
                  payload
                )
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to update profile"
          );
        }

        setEditing(false);
        setSaved(true);

        setTimeout(() => {
          setSaved(false);
        }, 2500);
      } catch (err) {
        setError(
          err.message ||
            "Unable to update profile."
        );
      } finally {
        setSaving(false);
      }
    };

  // =====================================================
  // CANCEL
  // =====================================================

  const handleCancel =
    async () => {
      setEditing(false);
      setSaved(false);
      setError("");

      await fetchProfile();
    };

  // =====================================================
  // UI
  // =====================================================

  return (
    <PortalLayout
      title="Profile"
      subtitle="Manage your academic, career and professional information."
    >
      <div className="profile-common-page">

        {loading ? (

          <div className="profile-loading">

            <h2>
              Loading Profile...
            </h2>

            <p>
              Loading your student
              information.
            </p>

          </div>

        ) : (

          <>
            {/* =============================================
                PROFILE HEADER
            ============================================= */}

            <section className="profile-header-card">

              <div className="profile-header-left">

                <div className="profile-avatar-large">
                  {profile.name
                    ? profile.name
                        .charAt(0)
                        .toUpperCase()
                    : "S"}
                </div>

                <div className="profile-header-info">

                  <span className="profile-label">
                    STUDENT PROFILE
                  </span>

                  <h1>
                    {profile.name}
                  </h1>

                  <p>
                    {profile.course} •
                    Class of{" "}
                    {
                      profile.graduationYear
                    }
                  </p>

                  <div className="profile-header-tags">

                    <span>
                      {
                        profile.targetRole
                      }
                    </span>

                    <span>
                      {profile.location ||
                        "Location not added"}
                    </span>

                  </div>

                </div>

              </div>

              <div className="profile-header-actions">

                <Link
                  to="/resume"
                  className="profile-resume-btn"
                >
                  Analyze Resume
                </Link>

                <button
                  type="button"
                  className="profile-edit-btn"
                  onClick={() => {
                    if (editing) {
                      handleCancel();
                    } else {
                      setEditing(true);
                    }
                  }}
                >
                  {editing
                    ? "Cancel Editing"
                    : "Edit Profile"}
                </button>

              </div>

            </section>

            {/* =============================================
                MESSAGES
            ============================================= */}

            {saved && (

              <div className="profile-success-message">
                Profile updated
                successfully.
              </div>

            )}

            {error && (

              <div className="profile-error-message">

                <span>
                  {error}
                </span>

                <button
                  type="button"
                  onClick={
                    fetchProfile
                  }
                >
                  Try Again
                </button>

              </div>

            )}

            {/* =============================================
                OVERVIEW
            ============================================= */}

            <section className="profile-overview-grid">

              {/* COMPLETION */}

              <div className="profile-completion-card">

                <div className="profile-card-heading">

                  <div>

                    <span className="profile-label">
                      PROFILE STRENGTH
                    </span>

                    <h2>
                      Profile Completion
                    </h2>

                  </div>

                  <strong>
                    {
                      profileCompletion
                    }%
                  </strong>

                </div>

                <div className="profile-progress-track">

                  <div
                    className="profile-progress-value"
                    style={{
                      width:
                        `${profileCompletion}%`
                    }}
                  />

                </div>

                <p>
                  Complete your
                  education, contact and
                  professional information
                  to improve placement
                  recommendations.
                </p>

                <div className="profile-completion-items">

                  <div
                    className={
                      basicComplete
                        ? "complete"
                        : ""
                    }
                  >
                    <span>
                      {basicComplete
                        ? "✓"
                        : "!"}
                    </span>

                    Basic Information
                  </div>

                  <div
                    className={
                      educationComplete
                        ? "complete"
                        : ""
                    }
                  >
                    <span>
                      {educationComplete
                        ? "✓"
                        : "!"}
                    </span>

                    Education
                  </div>

                  <div
                    className={
                      careerComplete
                        ? "complete"
                        : ""
                    }
                  >
                    <span>
                      {careerComplete
                        ? "✓"
                        : "!"}
                    </span>

                    Career Preference
                  </div>

                  <div
                    className={
                      linkedinComplete
                        ? "complete"
                        : ""
                    }
                  >
                    <span>
                      {linkedinComplete
                        ? "✓"
                        : "!"}
                    </span>

                    LinkedIn Profile
                  </div>

                </div>

              </div>

              {/* CAREER CARD */}

              <div className="profile-career-card">

                <span className="profile-label">
                  CAREER TARGET
                </span>

                <h2>
                  {
                    profile.targetRole
                  }
                </h2>

                <p>
                  Build the skills needed
                  for your target role
                  and track your
                  preparation.
                </p>

                <div className="profile-role-score">

                  <strong>
                    {
                      profileCompletion
                    }%
                  </strong>

                  <span>
                    Profile Strength
                  </span>

                </div>

                <Link
                  to="/skills"
                  className="profile-skill-link"
                >
                  View Skill Gap Analysis
                  →
                </Link>

              </div>

            </section>

            {/* =============================================
                PROFILE FORM
            ============================================= */}

            <form
              className="profile-form"
              onSubmit={
                handleSave
              }
            >

              {/* PERSONAL */}

              <section className="profile-section-card">

                <div className="profile-section-heading">

                  <div>

                    <span className="profile-label">
                      PERSONAL
                    </span>

                    <h2>
                      Personal Information
                    </h2>

                    <p>
                      Your basic contact
                      and location
                      information.
                    </p>

                  </div>

                </div>

                <div className="profile-form-grid">

                  <div className="profile-field">

                    <label>
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={
                        profile.name
                      }
                      disabled
                    />

                  </div>

                  <div className="profile-field">

                    <label>
                      Email Address
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={
                        profile.email
                      }
                      disabled
                    />

                  </div>

                  <div className="profile-field">

                    <label>
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={
                        profile.phone
                      }
                      onChange={
                        handleChange
                      }
                      disabled={
                        !editing
                      }
                      placeholder="Enter phone number"
                    />

                  </div>

                  <div className="profile-field">

                    <label>
                      Location
                    </label>

                    <input
                      type="text"
                      name="location"
                      value={
                        profile.location
                      }
                      onChange={
                        handleChange
                      }
                      disabled={
                        !editing
                      }
                      placeholder="Enter city"
                    />

                  </div>

                </div>

              </section>

              {/* ===========================================
                  EDUCATION
              =========================================== */}

              <section className="profile-section-card">

                <div className="profile-section-heading">

                  <div>

                    <span className="profile-label">
                      EDUCATION
                    </span>

                    <h2>
                      Academic Information
                    </h2>

                    <p>
                      Education information
                      used for placement
                      eligibility.
                    </p>

                  </div>

                </div>

                <div className="profile-form-grid">

                  <div className="profile-field">

                    <label>
                      Course
                    </label>

                    <select
                      name="course"
                      value={
                        profile.course
                      }
                      onChange={
                        handleChange
                      }
                      disabled={
                        !editing
                      }
                    >
                      <option value="MCA">
                        MCA
                      </option>

                      <option value="BCA">
                        BCA
                      </option>

                      <option value="B.Tech">
                        B.Tech
                      </option>

                      <option value="M.Tech">
                        M.Tech
                      </option>
                    </select>

                  </div>

                  <div className="profile-field">

                    <label>
                      Graduation Year
                    </label>

                    <select
                      name="graduationYear"
                      value={
                        profile.graduationYear
                      }
                      onChange={
                        handleChange
                      }
                      disabled={
                        !editing
                      }
                    >
                      <option value="2026">
                        2026
                      </option>

                      <option value="2027">
                        2027
                      </option>

                      <option value="2028">
                        2028
                      </option>
                    </select>

                  </div>

                  <div className="profile-field profile-field-full">

                    <label>
                      College / University
                    </label>

                    <input
                      type="text"
                      name="college"
                      value={
                        profile.college
                      }
                      onChange={
                        handleChange
                      }
                      disabled={
                        !editing
                      }
                      placeholder="Enter college name"
                    />

                  </div>

                  <div className="profile-field">

                    <label>
                      CGPA
                    </label>

                    <input
                      type="number"
                      name="cgpa"
                      value={
                        profile.cgpa
                      }
                      onChange={
                        handleChange
                      }
                      disabled={
                        !editing
                      }
                      placeholder="Example: 8.2"
                      min="0"
                      max="10"
                      step="0.01"
                    />

                  </div>

                  <div className="profile-field">

                    <label>
                      Active Backlogs
                    </label>

                    <input
                      type="number"
                      name="backlogs"
                      value={
                        profile.backlogs
                      }
                      onChange={
                        handleChange
                      }
                      disabled={
                        !editing
                      }
                      min="0"
                    />

                  </div>

                </div>

              </section>

              {/* ===========================================
                  CAREER
              =========================================== */}

              <section className="profile-section-card">

                <div className="profile-section-heading">

                  <div>

                    <span className="profile-label">
                      CAREER
                    </span>

                    <h2>
                      Career Preferences
                    </h2>

                    <p>
                      Used to personalize
                      placement and skill
                      recommendations.
                    </p>

                  </div>

                </div>

                <div className="profile-form-grid">

                  <div className="profile-field">

                    <label>
                      Target Role
                    </label>

                    <select
                      name="targetRole"
                      value={
                        profile.targetRole
                      }
                      onChange={
                        handleChange
                      }
                      disabled={
                        !editing
                      }
                    >
                      <option value="Java Backend Developer">
                        Java Backend Developer
                      </option>

                      <option value="Full Stack Developer">
                        Full Stack Developer
                      </option>

                      <option value="Software Developer">
                        Software Developer
                      </option>

                      <option value="QA Engineer">
                        QA Engineer
                      </option>

                      <option value="Data Analyst">
                        Data Analyst
                      </option>
                    </select>

                  </div>

                  <div className="profile-field">

                    <label>
                      Expected Package
                    </label>

                    <select
                      name="expectedPackage"
                      value={
                        profile.expectedPackage
                      }
                      onChange={
                        handleChange
                      }
                      disabled={
                        !editing
                      }
                    >
                      <option value="3 - 5 LPA">
                        3 - 5 LPA
                      </option>

                      <option value="5 - 7 LPA">
                        5 - 7 LPA
                      </option>

                      <option value="7 - 10 LPA">
                        7 - 10 LPA
                      </option>

                      <option value="10+ LPA">
                        10+ LPA
                      </option>
                    </select>

                  </div>

                </div>

              </section>

              {/* ===========================================
                  SKILLS
              =========================================== */}

              <section className="profile-section-card">

                <div className="profile-section-heading">

                  <div>

                    <span className="profile-label">
                      TECHNICAL PROFILE
                    </span>

                    <h2>
                      Skills
                    </h2>

                    <p>
                      Manage your technical
                      skills from the
                      dedicated Skills page.
                    </p>

                  </div>

                  <Link
                    to="/skills"
                    className="profile-manage-skills"
                  >
                    Manage Skills
                  </Link>

                </div>

                <div className="profile-skill-summary">

                  <div>

                    <strong>
                      Skill Profile
                    </strong>

                    <p>
                      Your skills,
                      proficiency levels
                      and skill scores are
                      managed separately.
                    </p>

                  </div>

                  <Link
                    to="/skills"
                  >
                    Open Skills →
                  </Link>

                </div>

              </section>

              {/* ===========================================
                  PROFESSIONAL LINKS
              =========================================== */}

              <section className="profile-section-card">

                <div className="profile-section-heading">

                  <div>

                    <span className="profile-label">
                      PROFESSIONAL LINKS
                    </span>

                    <h2>
                      Online Profiles
                    </h2>

                    <p>
                      Add professional
                      profiles for
                      recruiters and
                      placement preparation.
                    </p>

                  </div>

                </div>

                <div className="profile-form-grid">

                  <div className="profile-field">

                    <label>
                      LinkedIn
                    </label>

                    <input
                      type="url"
                      name="linkedin"
                      value={
                        profile.linkedin
                      }
                      onChange={
                        handleChange
                      }
                      disabled={
                        !editing
                      }
                      placeholder="LinkedIn profile URL"
                    />

                  </div>

                  <div className="profile-field">

                    <label>
                      GitHub
                    </label>

                    <input
                      type="url"
                      name="github"
                      value={
                        profile.github
                      }
                      onChange={
                        handleChange
                      }
                      disabled={
                        !editing
                      }
                      placeholder="GitHub profile URL"
                    />

                  </div>

                  <div className="profile-field profile-field-full">

                    <label>
                      Portfolio
                    </label>

                    <input
                      type="url"
                      name="portfolio"
                      value={
                        profile.portfolio
                      }
                      onChange={
                        handleChange
                      }
                      disabled={
                        !editing
                      }
                      placeholder="Portfolio URL"
                    />

                  </div>

                  <div className="profile-field profile-field-full">

                    <label>
                      Bio
                    </label>

                    <textarea
                      name="bio"
                      value={
                        profile.bio
                      }
                      onChange={
                        handleChange
                      }
                      disabled={
                        !editing
                      }
                      maxLength="500"
                      rows="5"
                      placeholder="Write a short career profile"
                    />

                  </div>

                </div>

              </section>

              {/* ===========================================
                  SAVE AREA
              =========================================== */}

              {editing && (

                <div className="profile-save-area">

                  <button
                    type="button"
                    className="profile-cancel-btn"
                    onClick={
                      handleCancel
                    }
                    disabled={
                      saving
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="profile-save-btn"
                    disabled={
                      saving
                    }
                  >
                    {saving
                      ? "Saving..."
                      : "Save Changes"}
                  </button>

                </div>

              )}

            </form>
          </>
        )}

      </div>
    </PortalLayout>
  );
}

export default Profile;
