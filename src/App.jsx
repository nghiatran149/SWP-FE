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
import Campaign from "./pages/Campaign";

//Admin Dashboard
import UserManagement from "./pages/UserManagement";
import ConsultantManagement from "./pages/ConsultantManagement";
import SurveyManagement from "./pages/SurveyManagement";
import SurveyDetailManagement from "./pages/SurveyDetailManagement";
import CourseManagement from "./pages/CourseManagement";
import CourseDetailManagement from "./pages/CourseDetailManagement";
import LessonDetailManagement from "./pages/LessonDetailManagement";
import CampaignManagement from "./pages/CampaignManagement";
import BlogManagement from "./pages/BlogManagement";

//Detail
import QuestionDetail from "./pages/QuestionDetail";
import CourseDetail from "./pages/CourseDetail";
import MyCourseDetail from "./pages/MyCourseDetail";
import MyLessonDetail from "./pages/MyLessonDetail";
import CertificateDetail from "./pages/CertificateDetail";
import MyAppointmentDetail from "./pages/MyAppointmentDetail";
import AssessmentDetail from "./pages/AssessmentDetail";
import AssessmentResult from "./pages/AssessmentResult";
import BlogDetail from "./pages/BlogDetail";

//User Dashboard
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import MyCourse from "./pages/MyCourse";
import MyAppointment from "./pages/MyAppointment";
import MyAssessment from "./pages/MyAssessment";
import MyAssessmentResult from "./pages/MyAssessmentResult";
import MyCampaign from "./pages/MyCampaign";
import MyCampaignDetail from "./pages/MyCampaignDetail";


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
            path="/blog/:id"
            element={
              <Layout>
                <BlogDetail />
              </Layout>
            }
          />
          <Route
            path="/campaigns"
            element={
              <Layout>
                <Campaign />
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
            path="/my-campaigns/:id"
            element={
              <LayoutDashboard activeMenuItem="mycampaign">
                <MyCampaignDetail />
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
            path="/myappointmentdetail"
            element={
              <LayoutDashboard activeMenuItem="myappointment">
                <MyAppointmentDetail />
              </LayoutDashboard>
            }
          />
          <Route
            path="/campaignmanagement"
            element={
              <LayoutDashboard activeMenuItem="campaignmanagement">
                <CampaignManagement />
              </LayoutDashboard>
            }
          />
          <Route
            path="/blogmanagement"
            element={
              <LayoutDashboard activeMenuItem="blogmanagement">
                <BlogManagement />
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
            path="/my-assessment-result/:responseId"
            element={
              <LayoutDashboard activeMenuItem="myassessment">
                <MyAssessmentResult />
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
            path="/surveydetailmanagement/:surveyId"
            element={
              <LayoutDashboard activeMenuItem="surveymanagement">
                <SurveyDetailManagement />
              </LayoutDashboard>
            }
          />
          <Route
            path="/surveydetailmanagement/:surveyId/questiondetail/:questionId"
            element={
              <LayoutDashboard activeMenuItem="surveymanagement">
                <QuestionDetail />
              </LayoutDashboard>
            }
          />
          <Route
            path="/coursemanagement"
            element={
              <LayoutDashboard activeMenuItem="coursemanagement">
                <CourseManagement />
              </LayoutDashboard>
            }
          />
          <Route
            path="/coursemanagementdetail/:courseId"
            element={
              <LayoutDashboard activeMenuItem="coursemanagement">
                <CourseDetailManagement />
              </LayoutDashboard>
            }
          />
          <Route
            path="/lessondetailmanagement/:lessonId"
            element={
              <LayoutDashboard activeMenuItem="coursemanagement">
                <LessonDetailManagement />
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
            path="/mylessondetail"
            element={
              <LayoutDashboard activeMenuItem="mycourse">
                <MyLessonDetail />
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