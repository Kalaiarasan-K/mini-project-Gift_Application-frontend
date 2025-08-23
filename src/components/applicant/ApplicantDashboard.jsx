import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FileText, 
  Plus,
  Clock, 
  CheckCircle, 
  XCircle,
  Calendar,
  AlertCircle,
  Activity,
  Building,
  User,
  Eye
} from 'lucide-react';
import { applicationsService } from '../../services/applications';

const ApplicantDashboard = () => {
  const { user, getUserId } = useAuth(); // ✅ Use getUserId helper
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setError(null);
      
      // ✅ Use the helper function to get user ID
      const userId = getUserId();

      if (!userId) {
        console.error('Unable to identify user - no user ID found');
        setError('Unable to identify user. Please log in again.');
        return;
      }

      console.log('Loading dashboard data for user ID:', userId);
      const applications = await applicationsService.getUserApplications(userId);
      
      const pending = applications.filter(app => app.status === 'PENDING');
      const approved = applications.filter(app => app.status === 'APPROVED');
      const rejected = applications.filter(app => app.status === 'REJECTED');
      
      setStats({
        totalApplications: applications.length,
        pendingApplications: pending.length,
        approvedApplications: approved.length,
        rejectedApplications: rejected.length
      });

      // Get recent applications (last 5)
      const sortedApps = applications
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentApplications(sortedApps);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'UNDER_REVIEW': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'APPROVED': return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleCreateNew = () => {
    window.location.href = '/applicant/applications/new';
  };

  const handleViewApplications = () => {
    window.location.href = '/applicant/applications';
  };

  const handleRetry = () => {
    setLoading(true);
    loadDashboardData();
  };

  // ✅ Enhanced loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // ✅ Enhanced error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-red-200 max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Dashboard</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-2">
            <button 
              onClick={handleRetry}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Try Again
            </button>
            <button 
              onClick={() => window.location.href = '/login'}
              className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Applications',
      value: stats.totalApplications,
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      description: 'All applications submitted'
    },
    {
      title: 'Pending Review',
      value: stats.pendingApplications,
      icon: Clock,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      description: 'Awaiting review'
    },
    {
      title: 'Approved',
      value: stats.approvedApplications,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      description: 'Successfully approved'
    },
    {
      title: 'Rejected',
      value: stats.rejectedApplications,
      icon: XCircle,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      description: 'Need improvement'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Welcome Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 mb-8">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome, {user?.name || user?.email || 'Applicant'}!
              </h1>
              <p className="text-gray-600 mt-2">
                {stats.pendingApplications > 0 
                  ? `You have ${stats.pendingApplications} application${stats.pendingApplications > 1 ? 's' : ''} pending review`
                  : 'Track your service provider applications here'
                }
              </p>
              {/* ✅ Show user ID for debugging */}
              <p className="text-xs text-gray-400 mt-1">User ID: {getUserId() || 'Not found'}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg">
                <Calendar className="w-4 h-4 inline mr-2" />
                {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      {stat.description}
                    </p>
                  </div>
                  <div className={`${stat.bgColor} rounded-2xl p-4`}>
                    <Icon className={`w-8 h-8 ${stat.iconColor}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Application Status Overview */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Application Status
              </h3>
              <Activity className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Pending Review</span>
                </div>
                <span className="text-2xl font-bold text-yellow-600">
                  {stats.pendingApplications}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">Approved</span>
                </div>
                <span className="text-2xl font-bold text-green-600">
                  {stats.approvedApplications}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200">
                <div className="flex items-center space-x-3">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span className="font-medium text-red-800">Rejected</span>
                </div>
                <span className="text-2xl font-bold text-red-600">
                  {stats.rejectedApplications}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Applications */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Recent Applications
              </h3>
              <FileText className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {recentApplications.length > 0 ? (
                recentApplications.map((application) => (
                  <div
                    key={application.id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors duration-200"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                          <Building className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {application.businessName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {application.contactPerson}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDate(application.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(application.status)}`}>
                      {application.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No applications submitted yet</p>
                </div>
              )}
            </div>
            {recentApplications.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <button 
                  onClick={handleViewApplications}
                  className="w-full text-center text-purple-600 hover:text-purple-700 font-medium py-2 hover:bg-purple-50 rounded-lg transition-colors"
                >
                  View All Applications
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              onClick={handleCreateNew}
              className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <Plus className="w-6 h-6 mb-2" />
              <span className="block font-medium">New Application</span>
            </button>
            <button 
              onClick={handleViewApplications}
              className="p-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <Eye className="w-6 h-6 mb-2" />
              <span className="block font-medium">View Applications</span>
            </button>
            <button className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <User className="w-6 h-6 mb-2" />
              <span className="block font-medium">Update Profile</span>
            </button>
            <button 
              onClick={handleRetry}
              className="p-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <Activity className="w-6 h-6 mb-2" />
              <span className="block font-medium">Refresh Data</span>
            </button>
          </div>
        </div>

        {/* Getting Started Guide */}
        {stats.totalApplications === 0 && (
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-sm p-8 text-white mb-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">Ready to become a service provider?</h3>
                <p className="text-purple-100 mb-6">
                  Submit your first application and join our network of trusted service providers.
                </p>
                <button 
                  onClick={handleCreateNew}
                  className="bg-white text-purple-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors inline-flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Submit Your First Application</span>
                </button>
              </div>
              <div className="hidden lg:block">
                <div className="w-48 h-48 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
                  <Building className="w-24 h-24 text-white opacity-50" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Application Tips */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Application Tips
            </h3>
            <AlertCircle className="w-5 h-5 text-gray-400" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Complete Your Profile</h4>
              <p className="text-sm text-gray-600">
                Provide detailed business information and contact details for better chances of approval.
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Building className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Showcase Your Work</h4>
              <p className="text-sm text-gray-600">
                Include a portfolio link to demonstrate your expertise and previous projects.
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Follow Guidelines</h4>
              <p className="text-sm text-gray-600">
                Review our service provider guidelines to ensure your application meets all requirements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDashboard;