import {
  useEffect,
  useMemo,
  useState
} from "react";

import { Link } from "react-router-dom";

import PortalLayout from "../components/PortalLayout";
import "../App.css";

const API_URL = "http://localhost:5000";

function Notifications() {
  const token =
    localStorage.getItem("token");

  const [filter, setFilter] =
    useState("All");

  const [
    notifications,
    setNotifications
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  // =====================================================
  // LOAD NOTIFICATIONS
  // =====================================================

  const fetchNotifications =
    async () => {
      try {
        setLoading(true);
        setError("");

        if (!token) {
          throw new Error(
            "Please login to view notifications."
          );
        }

        const response =
          await fetch(
            `${API_URL}/api/notifications`,
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
              "Failed to load notifications"
          );
        }

        setNotifications(
          data.notifications ||
            data.data ||
            []
        );
      } catch (err) {
        setError(
          err.message ||
            "Unable to load notifications."
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchNotifications();
    window.scrollTo(0, 0);
  }, []);

  // =====================================================
  // FILTER
  // =====================================================

  const filteredNotifications =
    useMemo(() => {
      if (filter === "All") {
        return notifications;
      }

      if (filter === "Unread") {
        return notifications.filter(
          (notification) =>
            !notification.isRead
        );
      }

      return notifications.filter(
        (notification) =>
          notification.type === filter
      );
    }, [
      filter,
      notifications
    ]);

  // =====================================================
  // COUNTS
  // =====================================================

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.isRead
    ).length;

  const interviewCount =
    notifications.filter(
      (notification) =>
        notification.type ===
        "Interview"
    ).length;

  const opportunityCount =
    notifications.filter(
      (notification) =>
        notification.type ===
          "Drive" ||
        notification.type ===
          "Application"
    ).length;

  // =====================================================
  // MARK ONE AS READ
  // =====================================================

  const markAsRead =
    async (id) => {
      try {
        setError("");
        setMessage("");

        const response =
          await fetch(
            `${API_URL}/api/notifications/${id}/read`,
            {
              method: "PATCH",

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
              "Failed to mark notification as read"
          );
        }

        setNotifications(
          (previous) =>
            previous.map(
              (notification) =>
                notification._id === id
                  ? {
                      ...notification,
                      isRead: true
                    }
                  : notification
            )
        );
      } catch (err) {
        setError(
          err.message ||
            "Unable to mark notification as read."
        );
      }
    };

  // =====================================================
  // MARK ALL AS READ
  // =====================================================

  const markAllAsRead =
    async () => {
      if (unreadCount === 0) {
        return;
      }

      try {
        setError("");
        setMessage("");

        const response =
          await fetch(
            `${API_URL}/api/notifications/read-all`,
            {
              method: "PATCH",

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
              "Failed to mark all as read"
          );
        }

        setNotifications(
          (previous) =>
            previous.map(
              (notification) => ({
                ...notification,
                isRead: true
              })
            )
        );

        setMessage(
          "All notifications marked as read."
        );
      } catch (err) {
        setError(
          err.message ||
            "Unable to mark all notifications as read."
        );
      }
    };

  // =====================================================
  // DELETE ONE
  // =====================================================

  const deleteNotification =
    async (id) => {
      const confirmed =
        window.confirm(
          "Delete this notification?"
        );

      if (!confirmed) {
        return;
      }

      try {
        setError("");
        setMessage("");

        const response =
          await fetch(
            `${API_URL}/api/notifications/${id}`,
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
              "Failed to delete notification"
          );
        }

        setNotifications(
          (previous) =>
            previous.filter(
              (notification) =>
                notification._id !==
                id
            )
        );

        setMessage(
          "Notification deleted successfully."
        );
      } catch (err) {
        setError(
          err.message ||
            "Unable to delete notification."
        );
      }
    };

  // =====================================================
  // CLEAR READ NOTIFICATIONS
  // =====================================================

  const clearReadNotifications =
    async () => {
      const readNotifications =
        notifications.filter(
          (notification) =>
            notification.isRead
        );

      if (
        readNotifications.length ===
        0
      ) {
        setMessage(
          "There are no read notifications to clear."
        );

        return;
      }

      const confirmed =
        window.confirm(
          `Delete ${readNotifications.length} read notification(s)?`
        );

      if (!confirmed) {
        return;
      }

      try {
        setError("");
        setMessage("");

        for (
          const notification
          of readNotifications
        ) {
          const response =
            await fetch(
              `${API_URL}/api/notifications/${notification._id}`,
              {
                method: "DELETE",

                headers: {
                  Authorization:
                    `Bearer ${token}`
                }
              }
            );

          if (!response.ok) {
            const data =
              await response.json();

            throw new Error(
              data.message ||
                "Failed to clear notifications"
            );
          }
        }

        setNotifications(
          (previous) =>
            previous.filter(
              (notification) =>
                !notification.isRead
            )
        );

        setMessage(
          "Read notifications cleared successfully."
        );
      } catch (err) {
        setError(
          err.message ||
            "Unable to clear read notifications."
        );
      }
    };

  // =====================================================
  // TIME
  // =====================================================

  const formatTime = (
    date
  ) => {
    if (!date) {
      return "";
    }

    const created =
      new Date(date);

    const now =
      new Date();

    const difference =
      now.getTime() -
      created.getTime();

    const minutes =
      Math.floor(
        difference / 60000
      );

    const hours =
      Math.floor(
        difference / 3600000
      );

    const days =
      Math.floor(
        difference / 86400000
      );

    if (minutes < 1) {
      return "Just now";
    }

    if (minutes < 60) {
      return `${minutes} minute${
        minutes === 1 ? "" : "s"
      } ago`;
    }

    if (hours < 24) {
      return `${hours} hour${
        hours === 1 ? "" : "s"
      } ago`;
    }

    if (days === 1) {
      return "Yesterday";
    }

    if (days < 7) {
      return `${days} days ago`;
    }

    return created.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );
  };

  // =====================================================
  // ICON
  // =====================================================

  const getNotificationIcon = (
    type
  ) => {
    switch (type) {
      case "Interview":
        return "◉";

      case "Application":
        return "↗";

      case "Result":
        return "✓";

      case "Deadline":
        return "!";

      case "Resume":
        return "✦";

      case "Drive":
        return "★";

      case "Offer":
        return "◆";

      case "System":
        return "●";

      default:
        return "•";
    }
  };

  // =====================================================
  // RELATED PAGE
  // =====================================================

  const getRelatedPage = (
    notification
  ) => {
    switch (
      notification.type
    ) {
      case "Interview":
        return {
          path: "/interviews",
          label: "View Interview"
        };

      case "Drive":
        return {
          path: "/drives",
          label: "View Drive"
        };

      case "Application":
        return {
          path: "/applications",
          label: "View Application"
        };

      case "Resume":
        return {
          path: "/resume",
          label: "View ATS Analysis"
        };

      case "Offer":
        return {
          path: "/offers",
          label: "View Offer"
        };

      case "Result":
        return {
          path: "/results",
          label: "View Result"
        };

      case "Deadline":
        return {
          path: "/calendar",
          label: "Open Calendar"
        };

      default:
        return null;
    }
  };

  const filterOptions = [
    "All",
    "Unread",
    "Application",
    "Interview",
    "Drive",
    "Offer",
    "Result",
    "Deadline",
    "Resume",
    "System",
    "Other"
  ];

  // =====================================================
  // UI
  // =====================================================

  return (
    <PortalLayout
      title="Notifications"
      subtitle="Stay updated with placement activities, deadlines and opportunities."
    >
      <div className="notifications-common-page">

        {loading ? (

          <div className="notifications-loading">

            <h2>
              Loading Notifications...
            </h2>

            <p>
              Checking your latest
              career updates.
            </p>

          </div>

        ) : (

          <>
            {/* =============================================
                HERO
            ============================================= */}

            <section className="notifications-hero">

              <div>

                <span className="notifications-label">
                  NOTIFICATION CENTER
                </span>

                <h1>
                  Notifications
                </h1>

                <p>
                  Stay updated with
                  applications,
                  interviews, placement
                  drives, results and
                  important deadlines.
                </p>

              </div>

              <button
                type="button"
                className="notifications-read-all-btn"
                onClick={
                  markAllAsRead
                }
                disabled={
                  unreadCount === 0
                }
              >
                Mark All as Read
              </button>

            </section>

            {/* =============================================
                MESSAGES
            ============================================= */}

            {message && (

              <div className="notifications-success-message">
                {message}
              </div>

            )}

            {error && (

              <div className="notifications-error-message">

                <span>
                  {error}
                </span>

                <button
                  type="button"
                  onClick={
                    fetchNotifications
                  }
                >
                  Try Again
                </button>

              </div>

            )}

            {/* =============================================
                STATS
            ============================================= */}

            <section className="notifications-stats-grid">

              <div className="notification-stat-card">

                <span>
                  Total
                </span>

                <strong>
                  {
                    notifications.length
                  }
                </strong>

                <small>
                  All notifications
                </small>

              </div>

              <div className="notification-stat-card">

                <span>
                  Unread
                </span>

                <strong>
                  {unreadCount}
                </strong>

                <small>
                  Require attention
                </small>

              </div>

              <div className="notification-stat-card">

                <span>
                  Interviews
                </span>

                <strong>
                  {interviewCount}
                </strong>

                <small>
                  Interview alerts
                </small>

              </div>

              <div className="notification-stat-card">

                <span>
                  Opportunities
                </span>

                <strong>
                  {opportunityCount}
                </strong>

                <small>
                  Placement updates
                </small>

              </div>

            </section>

            {/* =============================================
                MAIN LAYOUT
            ============================================= */}

            <section className="notifications-layout">

              {/* FILTER PANEL */}

              <aside className="notifications-sidebar">

                <div className="notifications-sidebar-card">

                  <span className="notifications-label">
                    FILTERS
                  </span>

                  <h2>
                    Notification Types
                  </h2>

                  <div className="notification-filter-list">

                    {filterOptions.map(
                      (option) => (

                        <button
                          type="button"
                          key={
                            option
                          }
                          className={
                            filter ===
                            option
                              ? "active"
                              : ""
                          }
                          onClick={() =>
                            setFilter(
                              option
                            )
                          }
                        >

                          <span>
                            {option}
                          </span>

                          {option ===
                            "Unread" && (

                            <strong>
                              {
                                unreadCount
                              }
                            </strong>

                          )}

                        </button>

                      )
                    )}

                  </div>

                </div>

                {/* QUICK ACTIONS */}

                <div className="notifications-sidebar-card">

                  <span className="notifications-label">
                    QUICK ACTIONS
                  </span>

                  <h2>
                    Manage Updates
                  </h2>

                  <button
                    type="button"
                    className="notification-sidebar-action"
                    onClick={
                      markAllAsRead
                    }
                    disabled={
                      unreadCount === 0
                    }
                  >
                    Mark all as read
                  </button>

                  <button
                    type="button"
                    className="notification-sidebar-action danger"
                    onClick={
                      clearReadNotifications
                    }
                  >
                    Clear read notifications
                  </button>

                </div>

              </aside>

              {/* ===========================================
                  NOTIFICATION LIST
              =========================================== */}

              <main className="notifications-main">

                <div className="notifications-section-heading">

                  <div>

                    <span className="notifications-label">
                      {
                        filter.toUpperCase()
                      }
                    </span>

                    <h2>
                      {filter === "All"
                        ? "Recent Notifications"
                        : `${filter} Notifications`}
                    </h2>

                    <p>
                      {
                        filteredNotifications.length
                      }{" "}
                      notification
                      {filteredNotifications.length ===
                      1
                        ? ""
                        : "s"}
                    </p>

                  </div>

                </div>

                {filteredNotifications.length >
                0 ? (

                  <div className="notifications-list">

                    {filteredNotifications.map(
                      (
                        notification
                      ) => {
                        const relatedPage =
                          getRelatedPage(
                            notification
                          );

                        const typeClass =
                          String(
                            notification.type ||
                              "other"
                          ).toLowerCase();

                        return (

                          <article
                            className={`notification-card ${
                              notification.isRead
                                ? "read"
                                : "unread"
                            }`}
                            key={
                              notification._id
                            }
                          >

                            <div
                              className={`notification-type-icon ${typeClass}`}
                            >
                              {getNotificationIcon(
                                notification.type
                              )}
                            </div>

                            <div className="notification-content">

                              <div className="notification-heading">

                                <div className="notification-badge-group">

                                  <span
                                    className={`notification-type-badge ${typeClass}`}
                                  >
                                    {notification.type ||
                                      "Other"}
                                  </span>

                                  {!notification.isRead && (

                                    <span className="notification-new-badge">
                                      NEW
                                    </span>

                                  )}

                                </div>

                                <span className="notification-time">
                                  {formatTime(
                                    notification.createdAt
                                  )}
                                </span>

                              </div>

                              <h3>
                                {
                                  notification.title
                                }
                              </h3>

                              <p>
                                {
                                  notification.message
                                }
                              </p>

                              <div className="notification-actions">

                                {!notification.isRead && (

                                  <button
                                    type="button"
                                    className="notification-read-btn"
                                    onClick={() =>
                                      markAsRead(
                                        notification._id
                                      )
                                    }
                                  >
                                    Mark as Read
                                  </button>

                                )}

                                {relatedPage && (

                                  <Link
                                    to={
                                      relatedPage.path
                                    }
                                    onClick={() => {
                                      if (
                                        !notification.isRead
                                      ) {
                                        markAsRead(
                                          notification._id
                                        );
                                      }
                                    }}
                                  >
                                    {
                                      relatedPage.label
                                    }
                                  </Link>

                                )}

                                <button
                                  type="button"
                                  className="notification-delete-btn"
                                  onClick={() =>
                                    deleteNotification(
                                      notification._id
                                    )
                                  }
                                >
                                  Delete
                                </button>

                              </div>

                            </div>

                          </article>

                        );
                      }
                    )}

                  </div>

                ) : (

                  <div className="notifications-empty">

                    <div className="notifications-empty-icon">
                      ✓
                    </div>

                    <h3>
                      You're all caught up
                    </h3>

                    <p>
                      There are no
                      notifications matching
                      this filter.
                    </p>

                    {filter !== "All" && (

                      <button
                        type="button"
                        className="notification-view-all-btn"
                        onClick={() =>
                          setFilter(
                            "All"
                          )
                        }
                      >
                        View All
                      </button>

                    )}

                  </div>

                )}

              </main>

            </section>

            {/* =============================================
                SMART ALERTS
            ============================================= */}

            <section className="notifications-smart-card">

              <div>

                <span className="notifications-label">
                  SMART ALERTS
                </span>

                <h2>
                  CareerPilot keeps you
                  prepared
                </h2>

                <p>
                  Important interviews,
                  deadlines, placement
                  results and new
                  opportunities will
                  appear in your
                  notification center.
                </p>

              </div>

              <Link
                to="/calendar"
                className="notifications-calendar-btn"
              >
                Open Calendar
              </Link>

            </section>

          </>
        )}

      </div>
    </PortalLayout>
  );
}

export default Notifications;
