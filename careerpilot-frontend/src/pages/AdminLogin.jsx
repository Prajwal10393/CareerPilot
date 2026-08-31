import { useState } from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import "../App.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleAdminLogin = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Admin login failed"
        );
      }

      const user =
        data.user ||
        data.admin ||
        {};

      // ADMIN ROLE CHECK
      if (
        !user.role ||
        user.role !== "admin"
      ) {
        throw new Error(
          "This account does not have admin access."
        );
      }

      // TOKEN CHECK
      if (!data.token) {
        throw new Error(
          "Login token not received."
        );
      }

      // CLEAR PREVIOUS SESSION
      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "user"
      );

      localStorage.removeItem(
        "role"
      );

      // SAVE ADMIN SESSION
      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      localStorage.setItem(
        "role",
        "admin"
      );

      // ADMIN DASHBOARD
      navigate(
        "/admin/dashboard",
        {
          replace: true
        }
      );

    } catch (error) {
      setError(
        error.message ||
          "Admin login failed"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">

      <div className="admin-login-container">

        {/* LEFT SIDE */}

        <div className="admin-login-brand">

          <Link
            to="/"
            className="admin-login-logo"
          >
            CareerPilot
          </Link>

          <span className="admin-login-badge">
            ADMIN PORTAL
          </span>

          <h1>
            Placement Administration
          </h1>

          <p>
            Manage students, companies,
            placement drives, results and
            CareerPilot analytics from one
            secure dashboard.
          </p>

          <div className="admin-login-features">

            <div>
              <span>✓</span>
              Manage students
            </div>

            <div>
              <span>✓</span>
              Create placement drives
            </div>

            <div>
              <span>✓</span>
              Publish results
            </div>

            <div>
              <span>✓</span>
              View placement analytics
            </div>

          </div>

        </div>

        {/* LOGIN FORM */}

        <form
          className="admin-login-card"
          onSubmit={handleAdminLogin}
        >

          <div className="admin-login-card-header">

            <span className="admin-login-card-icon">
              A
            </span>

            <div>

              <h2>
                Admin Login
              </h2>

              <p>
                Sign in with your
                administrator account.
              </p>

            </div>

          </div>

          {/* ERROR */}

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          {/* EMAIL */}

          <div className="admin-login-form-group">

            <label>
              Admin Email
            </label>

            <input
              type="email"
              placeholder="Enter admin email"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              autoComplete="email"
              required
            />

          </div>

          {/* PASSWORD */}

          <div className="admin-login-form-group">

            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              autoComplete="current-password"
              required
            />

          </div>

          {/* OPTIONS */}

          <div className="admin-login-options">

            <label>

              <input
                type="checkbox"
              />

              Remember me

            </label>

            <Link to="/forgot-password">
              Forgot Password?
            </Link>

          </div>

          {/* LOGIN */}

          <button
            type="submit"
            className="admin-login-submit"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Login as Admin"}
          </button>

          <div className="admin-login-divider">

            <span>
              OR
            </span>

          </div>

          {/* STUDENT LOGIN */}

          <Link
            to="/login"
            className="admin-student-login-btn"
          >
            Student Login
          </Link>

        </form>

      </div>

    </div>
  );
}

export default AdminLogin;
