import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import { AuthLayout } from './components/layout/AuthLayout';
import { MainLayout } from './components/layout/MainLayout';

// Home Component
import HomePage from './components/home/HomePage';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Admin Components
import AdminDashboard from './components/admin/AdminDashboard';
import UserManagement from './components/admin/UserManagement';
import ApplicationManagement from './components/admin/ApplicationManagement';
import ProviderManagement from './components/admin/ProviderManagement';

// Reviewer Components
import ReviewerDashboard from './components/reviewer/ReviewerDashboard';
import ApplicationReview from './components/reviewer/ApplicationReview';

// Applicant Components
import ApplicantDashboard from './components/applicant/ApplicantDashboard';
import ApplicationList from './components/applicant/ApplicationList';
import ApplicationForm from './components/applicant/ApplicationForm';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            
            <Route path="/login" element={
              <AuthLayout>
                <Login />
              </AuthLayout>
            } />
            <Route path="/register" element={
              <AuthLayout>
                <Register />
              </AuthLayout>
            } />

            {/* Protected Routes */}
            <Route path="/admin/*" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <MainLayout>
                  <Routes>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="applications" element={<ApplicationManagement />} />
                    <Route path="providers" element={<ProviderManagement />} />
                  </Routes>
                </MainLayout>
              </ProtectedRoute>
            } />

            <Route path="/reviewer/*" element={
              <ProtectedRoute allowedRoles={['REVIEWER']}>
                <MainLayout>
                  <Routes>
                    <Route path="dashboard" element={<ReviewerDashboard />} />
                    <Route path="applications" element={<ApplicationReview />} />
                  </Routes>
                </MainLayout>
              </ProtectedRoute>
            } />

            <Route path="/applicant/*" element={
              <ProtectedRoute allowedRoles={['APPLICANT']}>
                <MainLayout>
                  <Routes>
                    <Route path="dashboard" element={<ApplicantDashboard />} />
                    <Route path="applications" element={<ApplicationList />} />
                    <Route path="applications/new" element={<ApplicationForm />} />
                  </Routes>
                </MainLayout>
              </ProtectedRoute>
            } />

            {/* Dashboard redirect - now goes to appropriate dashboard if logged in */}
            <Route path="/dashboard" element={<Navigate to="/" replace />} />
            
            {/* 404 Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;