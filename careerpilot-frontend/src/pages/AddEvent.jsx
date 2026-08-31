import "../App.css";
import { Link, useNavigate } from "react-router-dom";

function AddEvent() {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    alert("Event added successfully!");
    navigate("/calendar");
  };

  return (
    <div className="dashboard-page">

      <aside className="dashboard-sidebar">

        <div className="dashboard-logo">
          CareerPilot
        </div>

        <nav className="dashboard-menu">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/applications">My Applications</Link>
          <Link to="/drives">Placement Drives</Link>
          <Link to="/resume">AI Resume Analyzer</Link>
          <Link to="/skills">Skills</Link>
          <Link to="/interviews">Interviews</Link>
          <Link to="/offers">Offers</Link>

          <Link
            to="/calendar"
            className="active"
          >
            Calendar
          </Link>

          <Link to="/analytics">Analytics</Link>
          <Link to="/practice">Practice</Link>
          <Link to="/profile">Profile</Link>
        </nav>

        <Link
          to="/login"
          className="dashboard-logout"
        >
          Logout
        </Link>

      </aside>

      <div className="dashboard-main">

        <header className="dashboard-topbar">

          <div className="dashboard-search">
            <input
              type="text"
              placeholder="Search CareerPilot..."
            />
          </div>

          <div className="dashboard-user">

            <div className="notification-icon">
              🔔
            </div>

            <div className="dashboard-avatar">
              PN
            </div>

            <span>
              Prajwal
            </span>

          </div>

        </header>

        <main className="dashboard-content">

          <div className="add-event-heading">

            <div>
              <h1>Add Event</h1>

              <p>
                Add interviews, placement drives, tests,
                deadlines and other career events.
              </p>
            </div>

            <Link
              to="/calendar"
              className="add-event-back"
            >
              ← Back to Calendar
            </Link>

          </div>

          <form
            className="add-event-form"
            onSubmit={handleSubmit}
          >

            <section className="add-event-section">

              <h2>Event Information</h2>

              <div className="add-event-grid">

                <div className="add-event-group">

                  <label>
                    Event Title
                  </label>

                  <input
                    type="text"
                    placeholder="Example: Google Technical Interview"
                    required
                  />

                </div>

                <div className="add-event-group">

                  <label>
                    Event Type
                  </label>

                  <select
                    defaultValue=""
                    required
                  >

                    <option
                      value=""
                      disabled
                    >
                      Select event type
                    </option>

                    <option>
                      Interview
                    </option>

                    <option>
                      Placement Drive
                    </option>

                    <option>
                      Online Test
                    </option>

                    <option>
                      Application Deadline
                    </option>

                    <option>
                      Offer Deadline
                    </option>

                    <option>
                      Joining Date
                    </option>

                    <option>
                      Career Task
                    </option>

                    <option>
                      Other
                    </option>

                  </select>

                </div>

                <div className="add-event-group">

                  <label>
                    Company
                  </label>

                  <input
                    type="text"
                    placeholder="Example: Google"
                  />

                </div>

                <div className="add-event-group">

                  <label>
                    Related To
                  </label>

                  <select defaultValue="General">

                    <option>
                      General
                    </option>

                    <option>
                      Application
                    </option>

                    <option>
                      Placement Drive
                    </option>

                    <option>
                      Interview
                    </option>

                    <option>
                      Offer
                    </option>

                  </select>

                </div>

              </div>

            </section>

            <section className="add-event-section">

              <h2>Date & Time</h2>

              <div className="add-event-grid">

                <div className="add-event-group">

                  <label>
                    Start Date
                  </label>

                  <input
                    type="date"
                    required
                  />

                </div>

                <div className="add-event-group">

                  <label>
                    Start Time
                  </label>

                  <input
                    type="time"
                    required
                  />

                </div>

                <div className="add-event-group">

                  <label>
                    End Date
                  </label>

                  <input
                    type="date"
                  />

                </div>

                <div className="add-event-group">

                  <label>
                    End Time
                  </label>

                  <input
                    type="time"
                  />

                </div>

              </div>

            </section>

            <section className="add-event-section">

              <h2>Location / Meeting</h2>

              <div className="add-event-grid">

                <div className="add-event-group">

                  <label>
                    Mode
                  </label>

                  <select defaultValue="Online">

                    <option>
                      Online
                    </option>

                    <option>
                      Offline
                    </option>

                    <option>
                      Hybrid
                    </option>

                  </select>

                </div>

                <div className="add-event-group">

                  <label>
                    Location
                  </label>

                  <input
                    type="text"
                    placeholder="Office / College / Venue"
                  />

                </div>

                <div className="add-event-group full">

                  <label>
                    Meeting Link
                  </label>

                  <input
                    type="url"
                    placeholder="https://meet.google.com/..."
                  />

                </div>

              </div>

            </section>

            <section className="add-event-section">

              <h2>Reminder</h2>

              <div className="add-event-grid">

                <div className="add-event-group">

                  <label>
                    Reminder
                  </label>

                  <select defaultValue="1 Day Before">

                    <option>
                      No Reminder
                    </option>

                    <option>
                      10 Minutes Before
                    </option>

                    <option>
                      30 Minutes Before
                    </option>

                    <option>
                      1 Hour Before
                    </option>

                    <option>
                      1 Day Before
                    </option>

                    <option>
                      2 Days Before
                    </option>

                    <option>
                      1 Week Before
                    </option>

                  </select>

                </div>

                <div className="add-event-group">

                  <label>
                    Priority
                  </label>

                  <select defaultValue="Medium">

                    <option>
                      Low
                    </option>

                    <option>
                      Medium
                    </option>

                    <option>
                      High
                    </option>

                  </select>

                </div>

              </div>

              <div className="event-reminder-options">

                <label>
                  <input
                    type="checkbox"
                    defaultChecked
                  />

                  In-App Notification
                </label>

                <label>
                  <input
                    type="checkbox"
                  />

                  Email Reminder
                </label>

              </div>

            </section>

            <section className="add-event-section">

              <h2>Additional Details</h2>

              <div className="add-event-group">

                <label>
                  Description / Notes
                </label>

                <textarea
                  rows="6"
                  placeholder="Add preparation notes, instructions, documents required or other details..."
                />

              </div>

            </section>

            <div className="add-event-actions">

              <button
                type="submit"
                className="save-event-btn"
              >
                Save Event
              </button>

              <button
                type="reset"
                className="clear-event-btn"
              >
                Clear
              </button>

              <Link
                to="/calendar"
                className="cancel-event-btn"
              >
                Cancel
              </Link>

            </div>

          </form>

        </main>

      </div>

    </div>
  );
}

export default AddEvent;
