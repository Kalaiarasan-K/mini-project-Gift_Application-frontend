import React, { useState, useEffect } from 'react';
import { 
  Building, 
  User, 
  Mail, 
  Phone, 
  Save, 
  X,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { providersService } from '../../services/providers';

const ProviderForm = ({ 
  isOpen, 
  onClose, 
  provider = null, 
  onSuccess 
}) => {
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
        result = await providersService.createProvider(formData);
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
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Building className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {provider ? 'Edit Provider' : 'Add New Provider'}
                </h3>
                <p className="text-sm text-gray-600">
                  {provider ? 'Update provider information' : 'Create a new service provider'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {/* Business Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Name *
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter business name"
                required
              />
            </div>
          </div>

          {/* Contact Person */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Person
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter contact person name"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter email address"
                required
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter phone number"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{provider ? 'Updating...' : 'Creating...'}</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{provider ? 'Update Provider' : 'Create Provider'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderForm;