import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout"
import Homepage from "./pages/Homepage"

function App() {

  return (
     <BrowserRouter>
          <Routes>
              <Route path="/home" element={<Layout><Homepage /></Layout>} />
          </Routes>
      </BrowserRouter>
  );
}

export default App;
