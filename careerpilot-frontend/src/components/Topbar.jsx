import { Link } from "react-router-dom";

function Topbar({
  title,
  subtitle
}) {
  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const storedRole =
    localStorage.getItem("role") ||
    user?.role ||
    "student";

  const role = String(storedRole).toLowerCase();

  const name =
    user?.name ||
    (role === "admin"
      ? "Administrator"
      : "Student");

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) =>
      part.charAt(0).toUpperCase()
    )
    .join("");

  const profilePath =
    role === "admin"
      ? "/admin/dashboard"
      : "/profile";

  return (
    <header className="portal-topbar">
      <div className="portal-topbar-heading">
        <h1>
          {title}
        </h1>

        {subtitle && (
          <p>
            {subtitle}
          </p>
        )}
      </div>

      <div className="portal-topbar-user">
        {role !== "admin" && (
          <Link
            to="/notifications"
            className="portal-notification-btn"
            title="Notifications"
            aria-label="Notifications"
          >
            🔔
          </Link>
        )}

        <Link
          to={profilePath}
          className="portal-user-profile"
        >
          <div className="portal-user-avatar">
            {initials || "CP"}
          </div>

          <div className="portal-user-details">
            <strong>
              {name}
            </strong>

            <span>
              {role === "admin"
                ? "Administrator"
                : "Student"}
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
}

export default Topbar;
