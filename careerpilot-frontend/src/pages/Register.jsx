import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    course: "MCA",
    graduationYear: "2026"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password
    ) {
      setError("Please fill all required fields.");
      return;
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: "student"
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed"
        );
      }

      setSuccess(
        "Registration successful. Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      <div className="register-container">

        <div className="register-brand">

          <Link
            to="/"
            className="login-logo"
          >
            CareerPilot
          </Link>

          <h1>
            Start Your Placement Journey
          </h1>

          <p>
            Create your CareerPilot account
            and manage applications,
            interviews, skills and placement
            opportunities.
          </p>

          <div className="register-benefits">

            <div>
              ✓ Track job applications
            </div>

            <div>
              ✓ Analyze your resume
            </div>

            <div>
              ✓ Discover skill gaps
            </div>

            <div>
              ✓ Find placement drives
            </div>

          </div>

        </div>

        <form
          className="register-card"
          onSubmit={handleSubmit}
        >

          <h2>
            Create Student Account
          </h2>

          <p className="register-subtitle">
            Enter your details to register.
          </p>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          {success && (
            <div className="login-success">
              {success}
            </div>
          )}

          <div className="register-grid">

            <div className="register-form-group full-width">

              <label>
                Full Name
              </label>

              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />

            </div>

            <div className="register-form-group full-width">

              <label>
                Email Address
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />

            </div>

            <div className="register-form-group">

              <label>
                Course
              </label>

              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
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

            <div className="register-form-group">

              <label>
                Graduation Year
              </label>

              <select
                name="graduationYear"
                value={
                  formData.graduationYear
                }
                onChange={handleChange}
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

            <div className="register-form-group">

              <label>
                Password
              </label>

              <input
                type="password"
                name="password"
                placeholder="Create password"
                value={formData.password}
                onChange={handleChange}
                required
              />

            </div>

            <div className="register-form-group">

              <label>
                Confirm Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={
                  formData.confirmPassword
                }
                onChange={handleChange}
                required
              />

            </div>

          </div>

          <label className="terms">

            <input
              type="checkbox"
              required
            />

            I agree to the terms and privacy
            policy.

          </label>

          <button
            type="submit"
            className="register-submit"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

          <p className="register-login-text">

            Already have an account?

            <Link to="/login">
              Login
            </Link>

          </p>

        </form>

      </div>

    </div>
  );
}

export default Register;