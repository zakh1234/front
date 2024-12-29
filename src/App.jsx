import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Use Routes instead of Switch
import LoginPage from './pages/LoginPage';  // Import the LoginPage
import AdminDashboard from './pages/AdminDashboard';  // Import Admin Dashboard
import StaffDashboard from './pages/StaffDashboard';  // Import Staff Dashboard

const App = () => {
  return (
    <Router>
      <Routes> {/* Use Routes instead of Switch */}
        <Route path="/" element={<LoginPage />} /> {/* Use element prop instead of component */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/staff-dashboard" element={<StaffDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
