import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FileText, 
  Plus, 
  Search, 
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  Building,
  MessageSquare,
  ExternalLink,
  RefreshCw,
  Filter,
  AlertCircle
} from 'lucide-react';
import { applicationsService } from '../../services/applications';

// Simple notification hook
const useNotification = () => {
  const [notification, setNotification] = useState({
    isVisible: false,
    type: 'success',
    message: ''
  });

  const showSuccess = (message) => {
    setNotification({
      isVisible: true,
      type: 'success',
      message
    });
    setTimeout(() => hideNotification(), 4000);
  };

  const showError = (message) => {
    setNotification({
      isVisible: true,
      type: 'error',
      message
    });
    setTimeout(() => hideNotification(), 5000);
  };

  const hideNotification = () => {
    setNotification(prev => ({
      ...prev,
      isVisible: false
    }));
  };

  return { notification, showSuccess, showError, hideNotification };
};

// Simple Notification component
const Notification = ({ type, message, isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
      type === 'success' 
        ? 'bg-green-100 text-green-800 border border-green-200'
        : 'bg-red-100 text-red-800 border border-red-200'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{message}</span>
        </div>
        <button onClick={onClose} className="ml-4 text-gray-500 hover:text-gray-700">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const ApplicationList = () => {
  const { user, getUserId } = useAuth(); // ✅ Use getUserId helper
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const { notification, showSuccess, showError, hideNotification } = useNotification();

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      
      // ✅ Use the helper function to get user ID
      const userId = getUserId();
      
      if (!userId) {
        showError('Unable to identify user. Please log in again.');
        console.error('User ID not found:', { user, storedUser: localStorage.getItem('user') });
        return;
      }

      console.log('Loading applications for user ID:', userId);
      const data = await applicationsService.getUserApplications(userId);
      console.log('Loaded applications:', data);
      setApplications(data);
    } catch (error) {
      console.error('Error loading applications:', error);
      showError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    window.location.href = '/applicant/applications/new';
  };

  const handleRefresh = () => {
    loadApplications();
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'UNDER_REVIEW': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'APPROVED': return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING': return Clock;
      case 'UNDER_REVIEW': return Eye;
      case 'APPROVED': return CheckCircle;
      case 'REJECTED': return XCircle;
      default: return FileText;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const openDetailModal = (application) => {
    setSelectedApplication(application);
    setShowDetailModal(true);
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Your application is awaiting initial review';
      case 'UNDER_REVIEW':
        return 'Your application is currently being reviewed by our team';
      case 'APPROVED':
        return 'Congratulations! Your application has been approved';
      case 'REJECTED':
        return 'Your application was not approved at this time';
      default:
        return 'Status unknown';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white shadow-sm border-b border-gray-200 mb-8">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <FileText className="w-8 h-8 mr-3 text-purple-600" />
                My Applications
              </h1>
              <p className="text-gray-600 mt-2">
                Track your service provider applications
              </p>
              {/* ✅ Show user ID for debugging */}
              <p className="text-xs text-gray-400 mt-1">User ID: {getUserId() || 'Not found'}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={handleCreateNew}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>New Application</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Filters and Stats */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="ALL">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>
            
            {/* Status Stats */}
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span>Pending: {applications.filter(app => app.status === 'PENDING').length}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span>Approved: {applications.filter(app => app.status === 'APPROVED').length}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <span>Rejected: {applications.filter(app => app.status === 'REJECTED').length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Applications Grid */}
        {filteredApplications.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredApplications.map((application, index) => {
              const StatusIcon = getStatusIcon(application.status);
              return (
                <div
                  key={application.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                  onClick={() => openDetailModal(application)}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                        <Building className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{application.businessName}</h3>
                        <p className="text-sm text-gray-500">Application #{application.id}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusColor(application.status)}`}>
                      <StatusIcon className="w-3 h-3" />
                      <span>{application.status.replace('_', ' ')}</span>
                    </span>
                  </div>

                  {/* Status Message */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      {getStatusMessage(application.status)}
                    </p>
                  </div>

                  {/* Content */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Contact Person</span>
                      <span className="font-medium text-gray-900">{application.contactPerson}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Submitted</span>
                      <span className="text-gray-700 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(application.createdAt)}
                      </span>
                    </div>
                    {application.portfolioLink && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Portfolio</span>
                        <a 
                          href={application.portfolioLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          View <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Comments */}
                  {application.comments && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Reviewer Comments
                      </div>
                      <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg border border-blue-200">
                        {application.comments}
                      </p>
                    </div>
                  )}

                  {/* Action */}
                  <div className="mt-6 pt-4 border-t border-gray-100 flex justify-center">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm font-medium">View Details</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm || filterStatus !== 'ALL' ? 'No Applications Found' : 'No Applications Yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterStatus !== 'ALL' 
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by submitting your first service provider application'
              }
            </p>
            {!searchTerm && filterStatus === 'ALL' && (
              <button
                onClick={handleCreateNew}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 inline-flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Submit First Application</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <Building className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{selectedApplication.businessName}</h3>
                    <p className="text-gray-600">Application #{selectedApplication.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center justify-center">
                <span className={`px-4 py-2 rounded-full text-sm font-medium border flex items-center space-x-2 ${getStatusColor(selectedApplication.status)}`}>
                  {React.createElement(getStatusIcon(selectedApplication.status), { className: "w-4 h-4" })}
                  <span>{selectedApplication.status.replace('_', ' ')}</span>
                </span>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-gray-700">{getStatusMessage(selectedApplication.status)}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Business Name</label>
                  <p className="text-lg font-semibold text-gray-900">{selectedApplication.businessName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Contact Person</label>
                  <p className="text-lg font-semibold text-gray-900">{selectedApplication.contactPerson}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Submitted</label>
                  <p className="text-lg font-semibold text-gray-900">{formatDate(selectedApplication.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedApplication.status)}`}>
                    {selectedApplication.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {selectedApplication.portfolioLink && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Portfolio Link</label>
                  <a 
                    href={selectedApplication.portfolioLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center mt-1"
                  >
                    {selectedApplication.portfolioLink}
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </div>
              )}

              {selectedApplication.comments && (
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-2">Reviewer Comments</label>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-gray-700">{selectedApplication.comments}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Notification
        type={notification.type}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />
    </div>
  );
};

export default ApplicationList;