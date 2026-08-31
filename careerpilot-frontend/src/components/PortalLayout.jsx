import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function PortalLayout({
  title,
  subtitle,
  children
}) {
  return (
    <div className="portal-layout">
      <Sidebar />

      <div className="portal-main">
        <Topbar
          title={title}
          subtitle={subtitle}
        />

        <main className="portal-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default PortalLayout;
