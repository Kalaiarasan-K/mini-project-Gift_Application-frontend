import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  Calendar,
  AlertCircle,
  Eye,
  MessageSquare,
  Activity,
  BarChart3
} from 'lucide-react';
import { applicationsService } from '../../services/applications';

const ReviewerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingReviews: 0,
    reviewedToday: 0,
    approvedThisMonth: 0,
    rejectedThisMonth: 0
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const applications = await applicationsService.getAllApplications();
      
      const pending = applications.filter(app => app.status === 'PENDING');
      const approved = applications.filter(app => app.status === 'APPROVED');
      const rejected = applications.filter(app => app.status === 'REJECTED');
      
      // Get today's date for filtering
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      
      // Filter applications for this month
      const thisMonth = applications.filter(app => {
        const appDate = new Date(app.createdAt);
        return appDate.getMonth() === today.getMonth() && 
               appDate.getFullYear() === today.getFullYear();
      });

      const approvedThisMonth = approved.filter(app => {
        const appDate = new Date(app.createdAt);
        return appDate.getMonth() === today.getMonth() && 
               appDate.getFullYear() === today.getFullYear();
      });

      const rejectedThisMonth = rejected.filter(app => {
        const appDate = new Date(app.createdAt);
        return appDate.getMonth() === today.getMonth() && 
               appDate.getFullYear() === today.getFullYear();
      });

      setStats({
        totalApplications: applications.length,
        pendingReviews: pending.length,
        reviewedToday: Math.floor(Math.random() * 5) + 1, // Mock data - you can implement actual logic
        approvedThisMonth: approvedThisMonth.length,
        rejectedThisMonth: rejectedThisMonth.length
      });

      // Get recent pending applications for review (last 6)
      const sortedApps = applications
        .filter(app => app.status === 'PENDING')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6);
      setRecentApplications(sortedApps);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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
      title: 'Pending Reviews',
      value: stats.pendingReviews,
      icon: Clock,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      change: 'Requires attention',
      changeColor: 'text-orange-600'
    },
    {
      title: 'Reviewed Today',
      value: stats.reviewedToday,
      icon: Eye,
      color: 'from-blue-500 to-purple-500',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      change: 'Great progress!',
      changeColor: 'text-green-600'
    },
    {
      title: 'Approved This Month',
      value: stats.approvedThisMonth,
      icon: CheckCircle,
      color: 'from-green-500 to-teal-500',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      change: `+${stats.approvedThisMonth > 0 ? '23' : '0'}% vs last month`,
      changeColor: 'text-green-600'
    },
    {
      title: 'Total Applications',
      value: stats.totalApplications,
      icon: FileText,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      change: 'All time',
      changeColor: 'text-gray-600'
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
                Welcome back, {user?.name || 'Reviewer'}!
              </h1>
              <p className="text-gray-600 mt-2">
                You have {stats.pendingReviews} applications waiting for review
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
                      <span className={`text-sm font-medium ${stat.changeColor}`}>
                        {stat.change}
                      </span>
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
          {/* Review Performance */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Review Performance
              </h3>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">Approved This Month</span>
                </div>
                <span className="text-2xl font-bold text-green-600">
                  {stats.approvedThisMonth}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200">
                <div className="flex items-center space-x-3">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span className="font-medium text-red-800">Rejected This Month</span>
                </div>
                <span className="text-2xl font-bold text-red-600">
                  {stats.rejectedThisMonth}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-center space-x-3">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-800">Average Review Time</span>
                </div>
                <span className="text-2xl font-bold text-blue-600">
                  2.4h
                </span>
              </div>
            </div>
          </div>

          {/* Pending Applications */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Applications Awaiting Review
              </h3>
              <FileText className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {recentApplications.length > 0 ? (
                recentApplications.map((application, index) => (
                  <div
                    key={application.id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors duration-200 cursor-pointer"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {application.businessName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {application.contactPerson}
                      </p>
                      <p className="text-xs text-gray-400 mt-1 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDate(application.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                        PENDING
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>All caught up! No pending reviews.</p>
                </div>
              )}
            </div>
            {recentApplications.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <button className="w-full text-center text-purple-600 hover:text-purple-700 font-medium py-2 hover:bg-purple-50 rounded-lg transition-colors">
                  View All Pending Applications
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
            <button className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <FileText className="w-6 h-6 mb-2" />
              <span className="block font-medium">Review Applications</span>
            </button>
            <button className="p-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <CheckCircle className="w-6 h-6 mb-2" />
              <span className="block font-medium">Approve Pending</span>
            </button>
            <button className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <BarChart3 className="w-6 h-6 mb-2" />
              <span className="block font-medium">View Analytics</span>
            </button>
            <button className="p-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <MessageSquare className="w-6 h-6 mb-2" />
              <span className="block font-medium">Send Feedback</span>
            </button>
          </div>
        </div>

        {/* Today's Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Today's Activity
            </h3>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Approved "TechCorp Solutions" application</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Reviewed "Digital Marketing Pro" application</p>
                <p className="text-xs text-gray-500">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-3 bg-red-50 rounded-lg">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Rejected "Quick Services" application</p>
                <p className="text-xs text-gray-500">6 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewerDashboard;