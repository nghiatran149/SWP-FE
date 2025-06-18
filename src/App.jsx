import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import Layout from "./components/Layout";
import LayoutDashboard from "./components/LayoutDashboard";
import Homepage from "./pages/Homepage";
import Assessment from "./pages/Assessment";
import Course from "./pages/Course";
import Booking from "./pages/Booking";
import Blog from "./pages/Blog";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import ConsultantManagement from "./pages/ConsultantManagement";
import SurveyManagement from "./pages/SurveyManagement";
import SurveyDetail from "./pages/SurveyDetail";
import QuestionDetail from "./pages/QuestionDetail";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyCourse from "./pages/MyCourse";
import CourseDetail from "./pages/CourseDetail";
import CertificateDetail from "./pages/CertificateDetail";
import MyBooking from "./pages/MyBooking";
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
            path="/booking"
            element={
              <Layout>
                <Booking />
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
            path="/courses"
            element={
              <Layout>
                <Course />
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
            path="/profile"
            element={
              <LayoutDashboard activeMenuItem="profile">
                <Profile />
              </LayoutDashboard>
            }
          />
          <Route
            path="/schedule"
            element={
              <LayoutDashboard activeMenuItem="myBooking">
                <MyBooking />
              </LayoutDashboard>
            }
          />
                    <Route
            path="/pricing"
            element={
              <LayoutDashboard activeMenuItem="myAssessment">
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
            path="/mycourses"
            element={
              <LayoutDashboard activeMenuItem="courses">
                <MyCourse />
              </LayoutDashboard>
            }
          />
          <Route
            path="/coursedetail"
            element={
              <LayoutDashboard activeMenuItem="courses">
                <CourseDetail />
              </LayoutDashboard>
            }
          />
          <Route
            path="/certificate"
            element={
              <LayoutDashboard activeMenuItem="courses">
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
