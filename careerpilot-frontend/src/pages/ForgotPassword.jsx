import "../App.css";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const handleSubmit = (event) => {
    event.preventDefault();

    alert("Password reset link sent successfully!");
  };

  return (
    <div className="forgot-page">

      <div className="forgot-card">

        <Link
          to="/"
          className="login-logo"
        >
          CareerPilot
        </Link>

        <h1>
          Forgot Password?
        </h1>

        <p>
          Enter your registered email address and
          we'll send you a password reset link.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="forgot-form-group">

            <label>
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              required
            />

          </div>

          <button
            type="submit"
            className="forgot-submit"
          >
            Send Reset Link
          </button>

        </form>

        <div className="forgot-back">

          <Link to="/login">
            ← Back to Login
          </Link>

        </div>

      </div>

    </div>
  );
}

export default ForgotPassword;
