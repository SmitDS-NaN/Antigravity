import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { AddFarmPage } from './pages/AddFarmPage';
import { AdvisoryRequestPage } from './pages/AdvisoryRequestPage';
import { AdvisoryReportPage } from './pages/AdvisoryReportPage';
import { HistoryPage } from './pages/HistoryPage';

export const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/farms/new"
        element={
          <ProtectedRoute>
            <AddFarmPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/advisory/request/:farmId"
        element={
          <ProtectedRoute>
            <AdvisoryRequestPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/advisory/:reportId"
        element={
          <ProtectedRoute>
            <AdvisoryReportPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
