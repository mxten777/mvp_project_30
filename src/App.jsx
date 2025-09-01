import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import ReportPage from "./pages/ReportPage";
import ReportsList from "./pages/ReportsList";
import ReportDetail from "./pages/ReportDetail";
import AdminPage from "./pages/AdminPage";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/report" element={<ReportPage />} />
  <Route path="/reports" element={<ReportsList />} />
  <Route path="/reports/:id" element={<ReportDetail />} />
  <Route path="/admin" element={<AdminPage />} />
  <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
