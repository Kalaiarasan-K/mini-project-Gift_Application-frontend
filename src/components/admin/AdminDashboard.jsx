import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Users, 
  FileText, 
  Building, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Activity,
  Calendar,
  DollarSign
} from 'lucide-react';
import { usersService } from '../../services/users';
import { applicationsService } from '../../services/applications';
import { providersService } from '../../services/providers';

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalApplications: 0,
    totalProviders: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentApplications, setRecentApplications] = useState([]);

  useEffect(() => {
    if (user && isAdmin()) {
      loadDashboardData();
    } else {
      setError('Access denied. Admin privileges required.');
      setLoading(false);
    }
  }, [user, isAdmin]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load data with proper error handling for each service
      const [usersResult, applicationsResult, providersResult] = await Promise.allSettled([
        usersService.getAllUsers(),
        applicationsService.getAllApplications(),
        providersService.getAllProviders()
      ]);

      let users = [], applications = [], providers = [];

      if (usersResult.status === 'fulfilled') {
        users = usersResult.value;
      } else {
        console.error('Failed to load users:', usersResult.reason);
      }

      if (applicationsResult.status === 'fulfilled') {
        applications = applicationsResult.value;
      } else {
        console.error('Failed to load applications:', applicationsResult.reason);
      }

      if (providersResult.status === 'fulfilled') {
        providers = providersResult.value;
      } else {
        console.error('Failed to load providers:', providersResult.reason);
      }

      // Calculate application statistics
      const pendingApps = applications.filter(app => app.status === 'PENDING');
      const approvedApps = applications.filter(app => app.status === 'APPROVED');
      const rejectedApps = applications.filter(app => app.status === 'REJECTED');

      setStats({
        totalUsers: users.length,
        totalApplications: applications.length,
        totalProviders: providers.length,
        pendingApplications: pendingApps.length,
        approvedApplications: approvedApps.length,
        rejectedApplications: rejectedApps.length
      });

      // Get recent applications (last 5)
      const sortedApps = applications
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentApplications(sortedApps);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'APPROVED': return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Show access denied if not admin
  if (!user || !isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center bg-white rounded-2xl p-8 shadow-lg">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={loadDashboardData}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      change: '+12%',
      changeColor: 'text-green-600'
    },
    {
      title: 'Total Applications',
      value: stats.totalApplications,
      icon: FileText,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      change: '+8%',
      changeColor: 'text-green-600'
    },
    {
      title: 'Providers',
      value: stats.totalProviders,
      icon: Building,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      change: '+15%',
      changeColor: 'text-green-600'
    },
    {
      title: 'Pending Reviews',
      value: stats.pendingApplications,
      icon: Clock,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      change: '-3%',
      changeColor: 'text-red-600'
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
                Welcome back, {user?.name || 'Admin'}!
              </h1>
              <p className="text-gray-600 mt-2">
                Here's what's happening with your platform today
              </p>
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
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span className={`text-sm font-medium ${stat.changeColor}`}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">vs last month</span>
                    </div>
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
                  <span className="font-medium text-yellow-800">Pending</span>
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
                recentApplications.map((application, index) => (
                  <div
                    key={application.id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors duration-200"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {application.businessName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {application.contactPerson || 'No contact person'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(application.createdAt)}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(application.status)}`}>
                      {application.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No recent applications</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <Users className="w-6 h-6 mb-2" />
              <span className="block font-medium">Manage Users</span>
            </button>
            <button className="p-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <FileText className="w-6 h-6 mb-2" />
              <span className="block font-medium">Review Applications</span>
            </button>
            <button className="p-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <Building className="w-6 h-6 mb-2" />
              <span className="block font-medium">Manage Providers</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;