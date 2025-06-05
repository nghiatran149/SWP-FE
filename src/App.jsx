import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout"
import LayoutDashboard from "./components/LayoutDashboard"
import Homepage from "./pages/Homepage"
import Dashboard from "./pages/Dashboard"
import UserManagement from "./pages/UserManagement"

function App() {

  return (
     <BrowserRouter>
          <Routes>
              <Route path="/home" element={<Layout><Homepage /></Layout>} />
              <Route path="/dashboard" element={<LayoutDashboard activeMenuItem="overview"><Dashboard /></LayoutDashboard>} />
              <Route path="/usermanagement" element={<LayoutDashboard activeMenuItem="usermanagement"><UserManagement /></LayoutDashboard>} />
          </Routes>
      </BrowserRouter>
  );
}

export default App;
