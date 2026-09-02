import "../App.css";

import {
  Link,
  useNavigate
} from "react-router-dom";

import {
  useState
} from "react";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "https://careerpilot-wxja.onrender.com/api/auth/login",
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
            "Login failed"
        );
      }

      if (
        !data.user ||
        data.user.role !== "student"
      ) {
        throw new Error(
          "Please use Admin Login."
        );
      }

      // Clear any previous login session
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");

      // Save student session
      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // IMPORTANT
      localStorage.setItem(
        "role",
        "student"
      );

      navigate(
        "/dashboard",
        {
          replace: true
        }
      );

    } catch (error) {
      setError(
        error.message ||
          "Login failed"
      );

    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = () => {
    navigate("/admin-login");
  };

  return (
    <div className="login-page">

      <div className="login-container">

        <div className="login-brand">

          <Link
            to="/"
            className="login-logo"
          >
            CareerPilot
          </Link>

          <h1>
            Welcome Back
          </h1>

          <p>
            Continue your placement
            journey with CareerPilot.
          </p>

        </div>

        <form
          className="login-card"
          onSubmit={handleLogin}
        >

          <h2>
            Student Login
          </h2>

          <p className="login-subtitle">
            Sign in to access your
            placement dashboard.
          </p>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <div className="login-form-group">

            <label>
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              required
            />

          </div>

          <div className="login-form-group">

            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              required
            />

          </div>

          <div className="login-options">

            <label className="remember">

              <input
                type="checkbox"
              />

              Remember me

            </label>

            <Link
              to="/forgot-password"
              className="forgot-link"
            >
              Forgot Password?
            </Link>

          </div>

          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

          <div className="login-divider">

            <span>
              OR
            </span>

          </div>

          <button
            type="button"
            className="admin-login-btn"
            onClick={
              handleAdminLogin
            }
          >
            Admin Login
          </button>

          <p className="register-text">

            Don't have an account?{" "}

            <Link to="/register">
              Register
            </Link>

          </p>

        </form>

      </div>

    </div>
  );
}

export default Login;
