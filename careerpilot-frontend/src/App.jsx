import {
  Routes,
  Route
} from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

import Skills from "./pages/Skills";
import AddSkill from "./pages/AddSkill";

import Applications from "./pages/Applications";
import AddApplication from "./pages/AddApplication";
import ApplicationDetails from "./pages/ApplicationDetails";
import EditApplication from "./pages/EditApplication";

import Drives from "./pages/Drives";
import DriveDetails from "./pages/DriveDetails";

import Resume from "./pages/Resume";

import Interviews from "./pages/Interviews";
import AddInterview from "./pages/AddInterview";
import EditInterview from "./pages/EditInterview";
import InterviewDetails from "./pages/InterviewDetails";

import Offers from "./pages/Offers";
import AddOffer from "./pages/AddOffer";
import OfferDetails from "./pages/OfferDetails";
import EditOffer from "./pages/EditOffer";

import Calendar from "./pages/Calendar";
import AddEvent from "./pages/AddEvent";

import Analytics from "./pages/Analytics";
import Practice from "./pages/Practice";
import Notifications from "./pages/Notifications";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminStudents from "./pages/AdminStudents";
import AdminCompanies from "./pages/AdminCompanies";
import AdminDrives from "./pages/AdminDrives";
import AdminResults from "./pages/AdminResults";
import AdminReports from "./pages/AdminReports";
import AdminAnalytics from "./pages/AdminAnalytics";
import Results from "./pages/Results";

function App() {
  return (
    <Routes>

      <Route
        path="/"
        element={<Landing />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      <Route
        path="/profile"
        element={<Profile />}
      />

      <Route
        path="/skills"
        element={<Skills />}
      />

      <Route
        path="/skills/add"
        element={<AddSkill />}
      />

      <Route
        path="/applications"
        element={<Applications />}
      />

      <Route
        path="/applications/add"
        element={<AddApplication />}
      />

      <Route
        path="/applications/:id"
        element={<ApplicationDetails />}
      />

      <Route
        path="/applications/:id/edit"
        element={<EditApplication />}
      />

      <Route
        path="/drives"
        element={<Drives />}
      />

      <Route
        path="/drives/:id"
        element={<DriveDetails />}
      />

      <Route
        path="/resume"
        element={<Resume />}
      />

      <Route
        path="/interviews"
        element={<Interviews />}
      />

      <Route
        path="/interviews/add"
        element={<AddInterview />}
      />

      <Route
        path="/interviews/edit"
        element={<EditInterview />}
      />

      <Route
        path="/interviews/details"
        element={<InterviewDetails />}
      />

      <Route
        path="/offers"
        element={<Offers />}
      />

      <Route
        path="/offers/add"
        element={<AddOffer />}
      />

      <Route
        path="/offers/details"
        element={<OfferDetails />}
      />

      <Route
        path="/offers/edit"
        element={<EditOffer />}
      />

      <Route
        path="/calendar"
        element={<Calendar />}
      />

      <Route
        path="/calendar/add"
        element={<AddEvent />}
      />

      <Route
        path="/analytics"
        element={<Analytics />}
      />

      <Route
        path="/practice"
        element={<Practice />}
      />

      <Route
        path="/notifications"
        element={<Notifications />}
      />

      <Route
  path="/results"
  element={<Results />}
/>

      <Route
        path="/admin-login"
        element={<AdminLogin />}
      />

      <Route
        path="/admin/dashboard"
        element={<AdminDashboard />}
      />

      <Route
        path="/admin/students"
        element={<AdminStudents />}
      />

      <Route
        path="/admin/companies"
        element={<AdminCompanies />}
      />

      <Route
        path="/admin/drives"
        element={<AdminDrives />}
      />

      <Route
        path="/admin/results"
        element={<AdminResults />}
      />

      <Route
        path="/admin/reports"
        element={<AdminReports />}
      />

      <Route
        path="/admin/analytics"
        element={<AdminAnalytics />}
      />

    </Routes>
  );
}

export default App;

