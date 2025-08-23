import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
  Calendar,
  User,
  Building,
  ExternalLink,
  MoreVertical,
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
    setNotification({ isVisible: true, type: 'success', message });
    setTimeout(() => setNotification(prev => ({ ...prev, isVisible: false })), 5000);
  };

  const showError = (message) => {
    setNotification({ isVisible: true, type: 'error', message });
    setTimeout(() => setNotification(prev => ({ ...prev, isVisible: false })), 5000);
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  return { notification, showSuccess, showError, hideNotification };
};

// Simple Notification Component
const Notification = ({ type, message, isVisible, onClose }) => {
  if (!isVisible) return null;

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2`}>
        <span>{message}</span>
        <button onClick={onClose} className="ml-2 text-white hover:text-gray-200">
          ×
        </button>
      </div>
    </div>
  );
};

const ApplicationManagement = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewAction, setReviewAction] = useState(null);
  const [error, setError] = useState(null);
  const { notification, showSuccess, showError, hideNotification } = useNotification();

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await applicationsService.getAllApplications();
      setApplications(data);
    } catch (error) {
      console.error('Error loading applications:', error);
      setError('Failed to load applications');
      showError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (applicationId) => {
    try {
      await applicationsService.approveApplication(applicationId, reviewComment);
      showSuccess('Application approved successfully');
      setReviewComment('');
      setReviewAction(null);
      setShowDetailModal(false);
      loadApplications();
    } catch (error) {
      console.error('Error approving application:', error);
      showError('Failed to approve application');
    }
  };

  const handleReject = async (applicationId) => {
    try {
      await applicationsService.rejectApplication(applicationId, reviewComment);
      showSuccess('Application rejected successfully');
      setReviewComment('');
      setReviewAction(null);
      setShowDetailModal(false);
      loadApplications();
    } catch (error) {
      console.error('Error rejecting application:', error);
      showError('Failed to reject application');
    }
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
    setReviewComment('');
    setReviewAction(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error && applications.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Applications</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={loadApplications}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
          >
            Try Again
          </button>
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
                Application Management
              </h1>
              <p className="text-gray-600 mt-2">
                Review and manage all applications
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg">
                <span className="text-sm font-medium">
                  {filteredApplications.length} Applications
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Filters */}
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredApplications.map((application, index) => {
            const StatusIcon = getStatusIcon(application.status);
            return (
              <div
                key={application.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                      <Building className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{application.businessName}</h3>
                      <p className="text-sm text-gray-500 flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {application.contactPerson}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusColor(application.status)}`}>
                      <StatusIcon className="w-3 h-3" />
                      <span>{application.status.replace('_', ' ')}</span>
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Application ID</span>
                    <span className="font-mono text-gray-700">#{application.id}</span>
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
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        View <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  )}
                  {application.comments && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center text-sm text-gray-500 mb-1">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Comments
                      </div>
                      <p className="text-sm text-gray-700">{application.comments}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <button
                    onClick={() => openDetailModal(application)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-medium">Review</span>
                  </button>
                  
                  {application.status === 'PENDING' && (
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => {
                          setSelectedApplication(application);
                          setReviewAction('approve');
                          setShowDetailModal(true);
                        }}
                        className="flex items-center space-x-1 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">Approve</span>
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedApplication(application);
                          setReviewAction('reject');
                          setShowDetailModal(true);
                        }}
                        className="flex items-center space-x-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        <span className="text-sm">Reject</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredApplications.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Applications Found</h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== 'ALL' 
                ? 'Try adjusting your search or filter criteria'
                : 'No applications have been submitted yet'
              }
            </p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">Application Details</h3>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setReviewAction(null);
                    setReviewComment('');
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Business Name</label>
                  <p className="text-lg font-semibold text-gray-900">{selectedApplication.businessName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Contact Person</label>
                  <p className="text-lg font-semibold text-gray-900">{selectedApplication.contactPerson}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedApplication.status)}`}>
                    {selectedApplication.status.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Submitted</label>
                  <p className="text-lg font-semibold text-gray-900">{formatDate(selectedApplication.createdAt)}</p>
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
                  <label className="text-sm font-medium text-gray-500">Previous Comments</label>
                  <div className="bg-gray-50 rounded-lg p-4 mt-2">
                    <p className="text-gray-700">{selectedApplication.comments}</p>
                  </div>
                </div>
              )}

              {reviewAction && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {reviewAction === 'approve' ? 'Approval Comments' : 'Rejection Comments'}
                  </label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder={`Enter your ${reviewAction} comments...`}
                    className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={4}
                  />
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setReviewAction(null);
                  setReviewComment('');
                }}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              {reviewAction === 'approve' && (
                <button
                  onClick={() => handleApprove(selectedApplication.id)}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Approve Application
                </button>
              )}
              {reviewAction === 'reject' && (
                <button
                  onClick={() => handleReject(selectedApplication.id)}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Reject Application
                </button>
              )}
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

export default ApplicationManagement;