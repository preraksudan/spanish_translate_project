import { Routes, Route } from "react-router-dom";
import RecordsPage from "./pages/RecordsPage";
import Login from "./pages/Login";
import Navbar from "./pages/Navbar";
import Dashboard from "./pages/Dashboard";
import MainLayout from "./layouts/MainLayout";


function App() {
  return (
    <Routes>

      <Route path="/" element={<Login />} />

      <Route element={<MainLayout />}>
        <Route path="/recordsPage" element={<RecordsPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      <Route path="/navbar" element={<Navbar />} />

    </Routes>
  );
}

export default App;