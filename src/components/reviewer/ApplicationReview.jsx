import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  User, 
  Building, 
  Mail, 
  ExternalLink, 
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  Eye,
  Search,
  Filter,
  AlertCircle
} from 'lucide-react';
import { applicationsService } from '../../services/applications';
import { useAuth } from '../../contexts/AuthContext';

const ApplicationReview = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewAction, setReviewAction] = useState('');
  const [reviewComments, setReviewComments] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState(null);

  useEffect(() => {
    if (user && (user.role === 'REVIEWER' || user.role === 'ADMIN')) {
      loadApplications();
    }
  }, [user]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await applicationsService.getAllApplications();
      setApplications(data);
    } catch (error) {
      console.error('Error loading applications:', error);
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const openReviewModal = (application, action) => {
    setSelectedApplication(application);
    setReviewAction(action);
    setReviewComments('');
    setReviewError(null);
    setShowReviewModal(true);
  };

  const handleReviewSubmit = async () => {
    if (!selectedApplication || !reviewAction) return;

    setReviewLoading(true);
    setReviewError(null);

    try {
      let result;
      if (reviewAction === 'approve') {
        result = await applicationsService.approveApplication(
          selectedApplication.id, 
          reviewComments
        );
      } else {
        result = await applicationsService.rejectApplication(
          selectedApplication.id, 
          reviewComments
        );
      }

      // Update the applications list
      setApplications(prev => 
        prev.map(app => 
          app.id === selectedApplication.id ? result : app
        )
      );

      setShowReviewModal(false);
      setSelectedApplication(null);
    } catch (error) {
      console.error('Error reviewing application:', error);
      setReviewError(error.response?.data?.message || 'Failed to process review');
    } finally {
      setReviewLoading(false);
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.applicant?.email?.toLowerCase().includes(searchTerm.toLowerCase());
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!user || (user.role !== 'REVIEWER' && user.role !== 'ADMIN')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to review applications.</p>
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
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 mb-8">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <FileText className="w-8 h-8 mr-3 text-purple-600" />
                Application Review
              </h1>
              <p className="text-gray-600 mt-2">
                Review and process provider applications
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg">
                <span className="text-sm font-medium">{filteredApplications.length} Applications</span>
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
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-6">
          {filteredApplications.map((application, index) => (
            <div
              key={application.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {application.businessName?.[0]?.toUpperCase() || 'B'}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{application.businessName}</h3>
                    <p className="text-gray-600">{application.contactPerson}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(application.status)}`}>
                  {application.status.replace('_', ' ')}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{application.applicant?.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Applied on {formatDate(application.createdAt)}</span>
                </div>
                {application.portfolioLink && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <ExternalLink className="w-4 h-4" />
                    <a 
                      href={application.portfolioLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      View Portfolio
                    </a>
                  </div>
                )}
              </div>

              {application.comments && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Comments</span>
                  </div>
                  <p className="text-sm text-gray-600">{application.comments}</p>
                </div>
              )}

              {/* Action Buttons */}
              {(application.status === 'PENDING' || application.status === 'UNDER_REVIEW') && (
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => openReviewModal(application, 'reject')}
                    className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors flex items-center space-x-2"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                  <button
                    onClick={() => openReviewModal(application, 'approve')}
                    className="px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 transition-colors flex items-center space-x-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Approve</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredApplications.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Applications Found</h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== 'ALL' 
                ? 'Try adjusting your search or filter criteria'
                : 'No applications available for review at the moment'
              }
            </p>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  reviewAction === 'approve' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-red-100 text-red-600'
                }`}>
                  {reviewAction === 'approve' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <XCircle className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {reviewAction === 'approve' ? 'Approve Application' : 'Reject Application'}
                  </h3>
                  <p className="text-sm text-gray-600">{selectedApplication.businessName}</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {reviewError && (
                <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <span className="text-red-700 text-sm">{reviewError}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comments {reviewAction === 'reject' && '(Required for rejection)'}
                </label>
                <textarea
                  value={reviewComments}
                  onChange={(e) => setReviewComments(e.target.value)}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder={
                    reviewAction === 'approve' 
                      ? "Add any additional comments for approval..."
                      : "Please provide a reason for rejection..."
                  }
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  disabled={reviewLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleReviewSubmit}
                  disabled={reviewLoading || (reviewAction === 'reject' && !reviewComments.trim())}
                  className={`px-6 py-2 text-white font-medium rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 ${
                    reviewAction === 'approve'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {reviewLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      {reviewAction === 'approve' ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      <span>{reviewAction === 'approve' ? 'Approve' : 'Reject'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationReview;