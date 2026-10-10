import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from './Page/HomePage';
import LoginPage from './Page/LoginPage';
import RegistrationPage from './Page/RegistrationPage';
import AdminLoginPage from './Page/AdminLoginPage';
import UserDashboard from './Page/UserDashboard';
import AdminDashboard from "./Page/AdminDashboard";

import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Home Page */}
          <Route
            path="/"
            element={<HomePage />}
          />

          {/* User Login */}
          <Route
            path="/login/user"
            element={<LoginPage />}
          />

          {/* Admin Login */}
          <Route
            path="/login/admin"
            element={<AdminLoginPage />}
          />

          {/* Registration */}
          <Route
            path="/register"
            element={<RegistrationPage />}
          />

          {/* User Dashboard */}
          <Route
            path="/user-dashboard"
            element={<UserDashboard />}
          />
          <Route
  path="/admin-dashboard"
  element={<AdminDashboard />}
/>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;