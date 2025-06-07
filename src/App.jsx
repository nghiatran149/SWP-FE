import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import LayoutDashboard from "./components/LayoutDashboard";
import Homepage from "./pages/Homepage";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import ConsultantManagement from "./pages/ConsultantManagement";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/home"
          element={
            <Layout>
              <Homepage />
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
          path="/profile"
          element={
            <LayoutDashboard activeMenuItem="profile">
              <Profile />
            </LayoutDashboard>
          }
        />
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
