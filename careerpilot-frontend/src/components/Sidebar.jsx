import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const storedRole =
    localStorage.getItem("role") ||
    user?.role ||
    "student";

  const role = String(storedRole).toLowerCase();

  const studentMenu = [
    {
      label: "Dashboard",
      path: "/dashboard"
    },
    {
      label: "My Applications",
      path: "/applications"
    },
    {
      label: "Placement Drives",
      path: "/drives"
    },
    {
      label: "AI Resume Analyzer",
      path: "/resume"
    },
    {
      label: "Skills",
      path: "/skills"
    },
    {
      label: "Interviews",
      path: "/interviews"
    },
    {
      label: "Offers",
      path: "/offers"
    },
    {
      label: "Calendar",
      path: "/calendar"
    },
    {
      label: "Results",
      path: "/results"
    },
    {
      label: "Analytics",
      path: "/analytics"
    },
    {
      label: "Practice",
      path: "/practice"
    },
    {
      label: "Notifications",
      path: "/notifications"
    },
    {
      label: "Profile",
      path: "/profile"
    }
  ];

  const adminMenu = [
    {
      label: "Dashboard",
      path: "/admin/dashboard"
    },
    {
      label: "Students",
      path: "/admin/students"
    },
    {
      label: "Companies",
      path: "/admin/companies"
    },
    {
      label: "Placement Drives",
      path: "/admin/drives"
    },
    {
      label: "Placement Results",
      path: "/admin/results"
    },
    {
      label: "Reports",
      path: "/admin/reports"
    },
    {
      label: "Analytics",
      path: "/admin/analytics"
    }
  ];

  const menu =
    role === "admin"
      ? adminMenu
      : studentMenu;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    if (role === "admin") {
      navigate("/admin-login");
    } else {
      navigate("/login");
    }
  };

  return (
    <aside className="portal-sidebar">
      <div className="portal-brand">
        <div className="portal-brand-logo">
          CP
        </div>

        <div>
          <strong>
            CareerPilot
          </strong>

          <span>
            {role === "admin"
              ? "Admin Portal"
              : "Student Portal"}
          </span>
        </div>
      </div>

      <nav className="portal-menu">
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive
                ? "portal-menu-link active"
                : "portal-menu-link"
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="portal-sidebar-footer">
        <button
          type="button"
          className="portal-logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
