import "../App.css";
import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="landing-page">

      <header className="navbar">
        <div className="logo">CareerPilot</div>

        <nav className="nav-links">
          <a href="#features">Features</a>
          <a href="#ai">AI Tools</a>
          <a href="#about">About</a>

          <Link to="/login">
            <button className="login-btn">
              Login
            </button>
          </Link>

          <Link to="/register">
            <button className="get-started-btn">
              Get Started
            </button>
          </Link>
        </nav>
      </header>

      <section className="hero">

        <div className="hero-left">

          <span className="badge">
            AI + Cloud Placement Platform
          </span>

          <h1>
            Your Placement Journey,
            <span> Powered by Intelligence.</span>
          </h1>

          <p>
            Track applications, analyze your resume,
            discover opportunities, prepare for interviews
            and turn placement preparation into a
            data-driven career journey.
          </p>

          <div className="hero-buttons">

            <Link to="/register">
              <button className="primary-btn">
                Get Started
              </button>
            </Link>

            <a href="#features">
              <button className="secondary-btn">
                Explore Features
              </button>
            </a>

          </div>

        </div>

        <div className="hero-right">

          <div className="dashboard-preview">

            <h3>AI Career Insights</h3>

            <div className="preview-card">
              <span>ATS Resume Score</span>
              <strong>82/100</strong>
            </div>

            <div className="preview-card">
              <span>Job Match Score</span>
              <strong>84%</strong>
            </div>

            <div className="preview-card">
              <span>Placement Readiness</span>
              <strong>78%</strong>
            </div>

            <div className="preview-card">
              <span>Recommended Jobs</span>
              <strong>6</strong>
            </div>

          </div>

        </div>

      </section>

      <section className="stats">

        <div>
          <h2>10K+</h2>
          <p>Students</p>
        </div>

        <div>
          <h2>500+</h2>
          <p>Companies</p>
        </div>

        <div>
          <h2>2K+</h2>
          <p>Placement Drives</p>
        </div>

        <div>
          <h2>95%</h2>
          <p>Success Rate</p>
        </div>

      </section>

      <section
        className="features"
        id="features"
      >

        <h2>
          Everything You Need for Placements
        </h2>

        <p className="section-subtitle">
          One intelligent platform for your complete placement journey.
        </p>

        <div className="feature-grid">

          {[
            "Application Tracking",
            "AI Resume Analyzer",
            "ATS Resume Score",
            "Job Match Analysis",
            "Eligibility Checker",
            "Skill Gap Analyzer",
            "Interview Preparation",
            "Placement Analytics"
          ].map((feature) => (
            <div
              className="feature-card"
              key={feature}
            >
              <h3>{feature}</h3>
              <p>
                Smart tools designed to improve
                your placement preparation.
              </p>
            </div>
          ))}

        </div>

      </section>

      <footer>

        <div className="footer-logo">
          CareerPilot
        </div>

        <p>
          AI-Powered Cloud-Based Placement &
          Career Intelligence Platform
        </p>

        <p>
          © 2026 CareerPilot
        </p>

      </footer>

    </div>
  );
}

export default Landing;