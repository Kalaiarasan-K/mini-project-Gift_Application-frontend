import React, { useState, useEffect } from 'react';
import { 
  Building, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Filter,
  MoreVertical,
  Eye,
  Mail,
  Phone,
  User,
  MapPin,
  Calendar,
  Star,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { providersService } from '../../services/providers';
import { useAuth } from '../../contexts/AuthContext';

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

// Provider Form Modal
const ProviderForm = ({ isOpen, onClose, provider = null, onSuccess }) => {
  const [formData, setFormData] = useState({
    businessName: '',
    contactPerson: '',
    email: '',
    phoneNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (provider) {
      setFormData({
        businessName: provider.businessName || '',
        contactPerson: provider.contactPerson || '',
        email: provider.email || '',
        phoneNumber: provider.phoneNumber || ''
      });
    } else {
      setFormData({
        businessName: '',
        contactPerson: '',
        email: '',
        phoneNumber: ''
      });
    }
    setError(null);
  }, [provider, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.businessName.trim()) {
      setError('Business name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let result;
      if (provider) {
        result = await providersService.updateProvider(provider.id, formData);
      } else {
        // For creating new provider, we need to pass a user ID
        // This would typically come from the current user or be selected
        result = await providersService.createProvider(1, formData); // Using dummy userId for now
      }
      
      onSuccess(result, provider ? 'updated' : 'created');
      onClose();
    } catch (error) {
      console.error('Error saving provider:', error);
      setError(error.response?.data?.message || 'Failed to save provider');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">
              {provider ? 'Edit Provider' : 'Add New Provider'}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Name *
            </label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Person
            </label>
            <input
              type="text"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-600 hover:text-gray-800"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : (provider ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProviderManagement = () => {
  const { user, isAdmin } = useAuth();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [error, setError] = useState(null);
  const { notification, showSuccess, showError, hideNotification } = useNotification();

  useEffect(() => {
    if (user && isAdmin()) {
      loadProviders();
    } else {
      setError('Access denied. Admin privileges required.');
      setLoading(false);
    }
  }, [user]);

  const loadProviders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await providersService.getAllProviders();
      setProviders(data);
    } catch (error) {
      console.error('Error loading providers:', error);
      setError('Failed to load providers');
      showError('Failed to load providers');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProvider = async (providerId) => {
    if (window.confirm('Are you sure you want to delete this provider?')) {
      try {
        await providersService.deleteProvider(providerId);
        setProviders(providers.filter(provider => provider.id !== providerId));
        showSuccess('Provider deleted successfully');
      } catch (error) {
        console.error('Error deleting provider:', error);
        showError('Failed to delete provider');
      }
    }
  };

  const handleProviderSuccess = (savedProvider, action) => {
    if (action === 'created') {
      setProviders([...providers, savedProvider]);
      showSuccess('Provider created successfully');
    } else {
      setProviders(providers.map(p => p.id === savedProvider.id ? savedProvider : p));
      showSuccess('Provider updated successfully');
    }
  };

  const filteredProviders = providers.filter(provider => 
    provider.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name) => {
    if (!name) return 'P';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Check access permissions
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

  if (error && providers.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Providers</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={loadProviders}
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
                <Building className="w-8 h-8 mr-3 text-purple-600" />
                Provider Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage approved service providers
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Provider</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Search and Stats */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search providers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full md:w-80"
              />
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span>Active: {providers.length}</span>
              </div>
              <div className="text-gray-600">
                Total: <span className="font-semibold">{filteredProviders.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Providers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProviders.map((provider, index) => (
            <div
              key={provider.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Provider Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-semibold text-lg">
                    {getInitials(provider.businessName)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{provider.businessName}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <Star className="w-4 h-4 mr-1 text-yellow-500 fill-current" />
                      <span>4.8 (24 reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Provider Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>{provider.contactPerson || 'Not provided'}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{provider.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{provider.phoneNumber || 'Not provided'}</span>
                </div>
              </div>

              {/* Status and Actions */}
              <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="flex items-center text-sm text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Active Provider
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedProvider(provider);
                      setShowDetailModal(true);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedProvider(provider);
                      setShowEditModal(true);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteProvider(provider.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProviders.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Providers Found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Try adjusting your search criteria'
                : 'Get started by adding your first provider'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300"
              >
                Add First Provider
              </button>
            )}
          </div>
        )}
      </div>

      {/* Provider Detail Modal */}
      {showDetailModal && selectedProvider && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                    {getInitials(selectedProvider.businessName)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{selectedProvider.businessName}</h3>
                    <p className="text-gray-600">{selectedProvider.contactPerson}</p>
                    <div className="flex items-center mt-1">
                      <Star className="w-4 h-4 mr-1 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-600">4.8 (24 reviews)</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Contact Person</label>
                  <p className="text-lg font-semibold text-gray-900">{selectedProvider.contactPerson || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-lg font-semibold text-gray-900">{selectedProvider.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-lg font-semibold text-gray-900">{selectedProvider.phoneNumber || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                    Active Provider
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 block mb-3">Services Offered</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['Web Development', 'Mobile Apps', 'UI/UX Design', 'Digital Marketing', 'SEO', 'Consulting'].map((service) => (
                    <div key={service} className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium text-center border border-blue-200">
                      {service}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 block mb-3">Recent Projects</label>
                <div className="space-y-3">
                  {[
                    { name: 'E-commerce Platform', client: 'TechCorp', status: 'Completed' },
                    { name: 'Mobile Banking App', client: 'FinanceInc', status: 'In Progress' },
                    { name: 'Corporate Website', client: 'BusinessLtd', status: 'Completed' }
                  ].map((project, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{project.name}</p>
                        <p className="text-sm text-gray-600">{project.client}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.status === 'Completed' 
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  setShowDetailModal(false);
                  setShowEditModal(true);
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Provider
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Provider Modal */}
      <ProviderForm
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleProviderSuccess}
      />

      {/* Edit Provider Modal */}
      <ProviderForm
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedProvider(null);
        }}
        provider={selectedProvider}
        onSuccess={handleProviderSuccess}
      />

      <Notification
        type={notification.type}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />
    </div>
  );
};

export default ProviderManagement;