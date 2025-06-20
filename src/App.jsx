import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import Layout from "./components/Layout";
import LayoutDashboard from "./components/LayoutDashboard";

//Authorize
import Login from "./pages/Login";
import Register from "./pages/Register";

//Landing
import Homepage from "./pages/Homepage";
import Course from "./pages/Course";
import Assessment from "./pages/Assessment";
import Booking from "./pages/Booking";
import Blog from "./pages/Blog";

//Admin Dashboard
import UserManagement from "./pages/UserManagement";
import ConsultantManagement from "./pages/ConsultantManagement";
import SurveyManagement from "./pages/SurveyManagement";
import MyCampaign from "./pages/MyCampaign";

//Detail
import SurveyDetail from "./pages/SurveyDetail";
import QuestionDetail from "./pages/QuestionDetail";
import CourseDetail from "./pages/CourseDetail";
import MyCourseDetail from "./pages/MyCourseDetail";
import CertificateDetail from "./pages/CertificateDetail";
import AppointmentDetail from "./pages/AppointmentDetail";
import AssessmentDetail from "./pages/AssessmentDetail";
import AssessmentResult from "./pages/AssessmentResult";

//User Dashboard
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import MyCourse from "./pages/MyCourse";
import MyAppointment from "./pages/MyAppointment";
import MyAssessment from "./pages/MyAssessment";



function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Toaster />
        <Routes>
          <Route
            path="/login"
            element={
              <Layout>
                <Login />
              </Layout>
            }
          />
          <Route
            path="/register"
            element={
              <Layout>
                <Register />
              </Layout>
            }
          />
          <Route
            path="/home"
            element={
              <Layout>
                <Homepage />
              </Layout>
            }
          />
          <Route
            path="/assessments"
            element={
              <Layout>
                <Assessment />
              </Layout>
            }
          />
          <Route
            path="/assessmentdetail/:surveyId"
            element={
              <Layout>
                <AssessmentDetail />
              </Layout>
            }
          />
          <Route
            path="/assessment-result/:responseId"
            element={
              <Layout>
                <AssessmentResult />
              </Layout>
            }
          />
          <Route
            path="/courses"
            element={
              <Layout>
                <Course />
              </Layout>
            }
          />
          <Route
            path="/coursedetail/:courseId"
            element={
              <Layout>
                <CourseDetail />
              </Layout>
            }
          />
          <Route
            path="/booking"
            element={
              <Layout>
                <Booking />
              </Layout>
            }
          />
          <Route
            path="/blog"
            element={
              <Layout>
                <Blog />
              </Layout>
            }
          />
          <Route
            path="/dashboard"
            element={
              <LayoutDashboard activeMenuItem="overview">
                <Dashboard />
              </LayoutDashboard>
            }
          />
          <Route
            path="/mycampaign"
            element={
              <LayoutDashboard activeMenuItem="mycampaign">
                <MyCampaign />
              </LayoutDashboard>
            }
          />
          <Route
            path="/profile"
            element={
              <LayoutDashboard activeMenuItem="profile">
                <Profile />
              </LayoutDashboard>
            }
          />
          <Route
            path="/myappointment"
            element={
              <LayoutDashboard activeMenuItem="myappointment">
                <MyAppointment />
              </LayoutDashboard>
            }
          />
          <Route
            path="/appointmentdetail"
            element={
              <LayoutDashboard activeMenuItem="myappointment">
                <AppointmentDetail />
              </LayoutDashboard>
            }
          />
          <Route
            path="/myassessment"
            element={
              <LayoutDashboard activeMenuItem="myassessment">
                <MyAssessment />
              </LayoutDashboard>
            }
          />
          <Route
            path="/usermanagement"
            element={
              <LayoutDashboard activeMenuItem="usermanagement">
                <UserManagement />
              </LayoutDashboard>
            }
          />
          <Route
            path="/consultantmanagement"
            element={
              <LayoutDashboard activeMenuItem="consultantmanagement">
                <ConsultantManagement />
              </LayoutDashboard>
            }
          />
          <Route
            path="/surveymanagement"
            element={
              <LayoutDashboard activeMenuItem="surveymanagement">
                <SurveyManagement />
              </LayoutDashboard>
            }
          />
          <Route
            path="/surveydetail/:surveyId"
            element={
              <LayoutDashboard activeMenuItem="surveymanagement">
                <SurveyDetail />
              </LayoutDashboard>
            }
          />
          <Route
            path="/surveydetail/:surveyId/questiondetail/:questionId"
            element={
              <LayoutDashboard activeMenuItem="surveymanagement">
                <QuestionDetail />
              </LayoutDashboard>
            }
          />
          <Route
            path="/mycourse"
            element={
              <LayoutDashboard activeMenuItem="mycourse">
                <MyCourse />
              </LayoutDashboard>
            }
          />
          <Route
            path="/mycoursedetail"
            element={
              <LayoutDashboard activeMenuItem="mycourse">
                <MyCourseDetail />
              </LayoutDashboard>
            }
          />
          <Route
            path="/certificate"
            element={
              <LayoutDashboard activeMenuItem="mycourse">
                <CertificateDetail />
              </LayoutDashboard>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
