import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Shield, Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading...</h2>
          <p className="text-gray-500">Please wait while we verify your access</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="mb-6">
            <Shield className="w-16 h-16 text-red-500 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-red-700 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page. Please contact your administrator if you believe this is an error.
          </p>
          <div className="bg-white rounded-lg p-4 border border-red-200">
            <p className="text-sm text-gray-500">
              Your role: <span className="font-semibold text-red-600">{user.role}</span>
            </p>
            <p className="text-sm text-gray-500">
              Required: <span className="font-semibold text-red-600">{allowedRoles.join(', ')}</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;