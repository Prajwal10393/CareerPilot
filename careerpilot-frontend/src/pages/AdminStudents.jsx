import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PortalLayout from "../components/PortalLayout";
import "../App.css";

const API_URL = "http://localhost:5000";

function AdminStudents() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedStudent, setSelectedStudent] =
    useState(null);

  const [viewLoading, setViewLoading] =
    useState(false);

  // =========================================================
  // FETCH STUDENTS
  // =========================================================

  const loadStudents = async () => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      navigate("/admin-login");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/admin/students`,
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
            "Unable to load students."
        );
      }

      setStudents(
        data.students || []
      );
    } catch (err) {
      setError(
        err.message ||
          "Unable to load students."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();

    window.scrollTo(0, 0);
  }, []);

  // =========================================================
  // VIEW STUDENT
  // =========================================================

  const handleViewStudent =
    async (studentId) => {
      const token =
        localStorage.getItem("token");

      try {
        setViewLoading(true);
        setError("");

        const response =
          await fetch(
            `${API_URL}/api/admin/students/${studentId}`,
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
              "Unable to load student details."
          );
        }

        setSelectedStudent(data);

        setTimeout(() => {
          document
            .getElementById(
              "admin-student-details"
            )
            ?.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });
        }, 100);
      } catch (err) {
        setError(
          err.message ||
            "Unable to load student details."
        );
      } finally {
        setViewLoading(false);
      }
    };

  // =========================================================
  // DELETE STUDENT
  // =========================================================

  const handleDeleteStudent =
    async (student) => {
      const confirmed =
        window.confirm(
          `Delete ${student.name}? This will also delete the student's profile, skills, applications, interviews, offers and placement results.`
        );

      if (!confirmed) {
        return;
      }

      const token =
        localStorage.getItem("token");

      try {
        setError("");

        const response =
          await fetch(
            `${API_URL}/api/admin/students/${student._id}`,
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
              "Unable to delete student."
          );
        }

        setStudents(
          (currentStudents) =>
            currentStudents.filter(
              (item) =>
                item._id !==
                student._id
            )
        );

        if (
          selectedStudent?.student
            ?._id === student._id
        ) {
          setSelectedStudent(null);
        }
      } catch (err) {
        setError(
          err.message ||
            "Unable to delete student."
        );
      }
    };

  // =========================================================
  // UI
  // =========================================================

  return (
    <PortalLayout
      title="Students"
      subtitle="View registered students and their placement information."
    >
      <div className="admin-students-common">

        {/* SUMMARY */}

        <div className="admin-students-summary">

          <div className="admin-student-summary-card">

            <span>
              Total Students
            </span>

            <strong>
              {students.length}
            </strong>

            <p>
              Registered student accounts
            </p>

          </div>

          <div className="admin-student-summary-card">

            <span>
              Active Records
            </span>

            <strong>
              {students.length}
            </strong>

            <p>
              Available student records
            </p>

          </div>

        </div>

        {/* ERROR */}

        {error && (
          <div className="admin-error">
            {error}
          </div>
        )}

        {/* STUDENT LIST */}

        <section className="admin-dashboard-card">

          <div className="admin-card-heading">

            <div>
              <h2>
                Registered Students
              </h2>

              <p>
                Students registered with a
                CareerPilot student account.
              </p>
            </div>

            <span className="admin-record-count">
              {students.length}{" "}
              {students.length === 1
                ? "Student"
                : "Students"}
            </span>

          </div>

          {loading ? (

            <div className="admin-common-loading">
              Loading students...
            </div>

          ) : students.length === 0 ? (

            <div className="admin-students-empty">

              <div>👨‍🎓</div>

              <h3>
                No students found
              </h3>

              <p>
                Student accounts will appear
                here after registration.
              </p>

            </div>

          ) : (

            <div className="admin-table-wrapper">

              <table className="admin-table">

                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Registered</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {students.map(
                    (student) => (

                      <tr
                        key={
                          student._id
                        }
                      >

                        <td>

                          <div className="admin-student-name">

                            <div className="admin-student-avatar">
                              {student.name
                                ?.charAt(0)
                                ?.toUpperCase() ||
                                "S"}
                            </div>

                            <div>
                              <strong>
                                {
                                  student.name
                                }
                              </strong>

                              <small>
                                Student Account
                              </small>
                            </div>

                          </div>

                        </td>

                        <td>
                          {student.email}
                        </td>

                        <td>

                          <span className="admin-status-badge">
                            Student
                          </span>

                        </td>

                        <td>
                          {student.createdAt
                            ? new Date(
                                student.createdAt
                              ).toLocaleDateString()
                            : "-"}
                        </td>

                        <td>

                          <div className="admin-table-actions">

                            <button
                              type="button"
                              onClick={() =>
                                handleViewStudent(
                                  student._id
                                )
                              }
                            >
                              View
                            </button>

                            <button
                              type="button"
                              className="danger"
                              onClick={() =>
                                handleDeleteStudent(
                                  student
                                )
                              }
                            >
                              Delete
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>

        {/* =====================================================
            STUDENT DETAILS
        ====================================================== */}

        {selectedStudent && (

          <section
            id="admin-student-details"
            className="admin-dashboard-card admin-student-details-card"
          >

            <div className="admin-card-heading">

              <div>

                <span className="admin-detail-eyebrow">
                  STUDENT DETAILS
                </span>

                <h2>
                  {selectedStudent.student
                    ?.name ||
                    "Student"}
                </h2>

                <p>
                  {selectedStudent.student
                    ?.email}
                </p>

              </div>

              <button
                type="button"
                className="admin-close-details"
                onClick={() =>
                  setSelectedStudent(null)
                }
              >
                Close
              </button>

            </div>

            {viewLoading ? (

              <div className="admin-common-loading">
                Loading student details...
              </div>

            ) : (

              <>
                {/* PROFILE INFORMATION */}

                <div className="admin-detail-section">

                  <div className="admin-detail-section-heading">

                    <h3>
                      Academic & Career Profile
                    </h3>

                    <p>
                      Student eligibility and
                      career information.
                    </p>

                  </div>

                  <div className="admin-student-detail-grid">

                    <div className="admin-detail-stat">
                      <span>Course</span>

                      <strong>
                        {selectedStudent
                          .profile?.course ||
                          "-"}
                      </strong>
                    </div>

                    <div className="admin-detail-stat">
                      <span>CGPA</span>

                      <strong>
                        {selectedStudent
                          .profile?.cgpa ??
                          "-"}
                      </strong>
                    </div>

                    <div className="admin-detail-stat">
                      <span>Backlogs</span>

                      <strong>
                        {selectedStudent
                          .profile
                          ?.backlogs ??
                          "-"}
                      </strong>
                    </div>

                    <div className="admin-detail-stat">
                      <span>
                        Graduation Year
                      </span>

                      <strong>
                        {selectedStudent
                          .profile
                          ?.graduationYear ||
                          "-"}
                      </strong>
                    </div>

                    <div className="admin-detail-stat">
                      <span>City</span>

                      <strong>
                        {selectedStudent
                          .profile?.city ||
                          "-"}
                      </strong>
                    </div>

                    <div className="admin-detail-stat">
                      <span>
                        Target Role
                      </span>

                      <strong>
                        {selectedStudent
                          .profile
                          ?.targetRole ||
                          "-"}
                      </strong>
                    </div>

                  </div>

                </div>

                {/* ACTIVITY */}

                <div className="admin-detail-section">

                  <div className="admin-detail-section-heading">

                    <h3>
                      Placement Activity
                    </h3>

                    <p>
                      Student activity across
                      CareerPilot modules.
                    </p>

                  </div>

                  <div className="admin-student-activity-grid">

                    <div>
                      <span>Skills</span>

                      <strong>
                        {selectedStudent
                          .skills?.length ||
                          0}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Applications
                      </span>

                      <strong>
                        {selectedStudent
                          .applications
                          ?.length || 0}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Interviews
                      </span>

                      <strong>
                        {selectedStudent
                          .interviews
                          ?.length || 0}
                      </strong>
                    </div>

                    <div>
                      <span>Offers</span>

                      <strong>
                        {selectedStudent
                          .offers?.length ||
                          0}
                      </strong>
                    </div>

                    <div>
                      <span>Results</span>

                      <strong>
                        {selectedStudent
                          .results?.length ||
                          0}
                      </strong>
                    </div>

                  </div>

                </div>

                {/* SKILLS */}

                <div className="admin-detail-section">

                  <div className="admin-detail-section-heading">

                    <h3>
                      Student Skills
                    </h3>

                    <p>
                      Technical skills added
                      by the student.
                    </p>

                  </div>

                  {selectedStudent.skills
                    ?.length > 0 ? (

                    <div className="admin-student-skill-tags">

                      {selectedStudent.skills.map(
                        (skill) => (

                          <span
                            key={
                              skill._id
                            }
                          >
                            {skill.name}
                          </span>

                        )
                      )}

                    </div>

                  ) : (

                    <p className="admin-no-skills">
                      No skills added.
                    </p>

                  )}

                </div>

              </>

            )}

          </section>

        )}

      </div>
    </PortalLayout>
  );
}

export default AdminStudents;
