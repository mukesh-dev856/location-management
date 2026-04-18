import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout
import AdminLayout from './components/layout/AdminLayout';

// Auth pages (full-page, no sidebar)
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Admin pages
import Dashboard from './pages/Dashboard';
import States from './pages/States';
import Cities from './pages/Cities';

import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <ToastProvider>
      <Router>
      <Routes>
        {/* Auth routes — full-page layout (no sidebar/navbar) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin routes — wrapped in AdminLayout */}
        <Route
          path="/dashboard"
          element={
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          }
        />
        <Route
          path="/states"
          element={
            <AdminLayout>
              <States />
            </AdminLayout>
          }
        />
        <Route
          path="/cities"
          element={
            <AdminLayout>
              <Cities />
            </AdminLayout>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
    </ToastProvider>
  );
}

export default App;
