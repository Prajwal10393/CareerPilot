const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Database
const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const studentProfileRoutes = require("./routes/studentProfileRoutes");
const skillRoutes = require("./routes/skillRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const placementDriveRoutes = require("./routes/placementDriveRoutes");
const eligibilityRoutes = require("./routes/eligibilityRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const eventRoutes = require("./routes/eventRoutes");
const offerRoutes = require("./routes/offerRoutes");
const placementResultRoutes = require("./routes/placementResultRoutes");

const adminDashboardRoutes = require("./routes/adminDashboardRoutes");
const adminStudentRoutes = require("./routes/adminStudentRoutes");
const adminAnalyticsRoutes = require("./routes/adminAnalyticsRoutes");

const companyRoutes = require("./routes/companyRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const practiceRoutes = require("./routes/practiceRoutes");
const interviewQuestionRoutes =
  require("./routes/interviewQuestionRoutes");
// Connect MongoDB
connectDB();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// AUTH
// ===============================

app.use("/api/auth", authRoutes);

// ===============================
// STUDENT ROUTES
// ===============================

app.use(
  "/api/student/profile",
  studentProfileRoutes
);

app.use(
  "/api/student/skills",
  skillRoutes
);

app.use(
  "/api/student/applications",
  applicationRoutes
);

app.use(
  "/api/student/interviews",
  interviewRoutes
);

app.use(
  "/api/student/events",
  eventRoutes
);

app.use(
  "/api/student/offers",
  offerRoutes
);

app.use(
  "/api/student/resume",
  resumeRoutes
);

app.use(
  "/api/student/practice",
  practiceRoutes
);

app.use(
  "/api/student/interview-questions",
  interviewQuestionRoutes
);

// ===============================
// PLACEMENT ROUTES
// ===============================

app.use(
  "/api/drives",
  placementDriveRoutes
);

app.use(
  "/api/eligibility",
  eligibilityRoutes
);

app.use(
  "/api/results",
  placementResultRoutes
);

// ===============================
// ADMIN ROUTES
// ===============================

app.use(
  "/api/admin/dashboard",
  adminDashboardRoutes
);

app.use(
  "/api/admin/students",
  adminStudentRoutes
);

app.use(
  "/api/admin/analytics",
  adminAnalyticsRoutes
);

// ===============================
// OTHER ROUTES
// ===============================

app.use(
  "/api/companies",
  companyRoutes
);

app.use(
  "/api/notifications",
  notificationRoutes
);

app.use(
  "/api/analytics",
  analyticsRoutes
);

// ===============================
// TEST ROUTE
// ===============================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CareerPilot API is running"
  });
});

// ===============================
// 404 HANDLER
// ===============================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// ===============================
// SERVER
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `CareerPilot backend running on port ${PORT}`
  );
});
