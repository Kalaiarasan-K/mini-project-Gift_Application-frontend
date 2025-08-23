import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FileText, 
  Building, 
  User, 
  Link, 
  Send, 
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Upload,
  Phone,
  Mail,
  MapPin,
  Save
} from 'lucide-react';
import { applicationsService } from '../../services/applications';

// Notification component
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

const ApplicationForm = ({ applicationId, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    contactPerson: '',
    phoneNumber: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    businessRegistrationNumber: '',
    yearsInBusiness: '',
    servicesOffered: '',
    portfolioLink: '',
    description: '',
    status: 'PENDING'
  });

  const [notification, setNotification] = useState({
    isVisible: false,
    type: 'success',
    message: ''
  });

  const showNotification = (type, message) => {
    setNotification({
      isVisible: true,
      type,
      message
    });
    setTimeout(() => hideNotification(), 4000);
  };

  const hideNotification = () => {
    setNotification(prev => ({
      ...prev,
      isVisible: false
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const requiredFields = [
      'businessName', 'businessType', 'contactPerson', 
      'phoneNumber', 'email', 'address', 'city', 'state', 'zipCode', 'servicesOffered'
    ];
    
    const errors = {};
    
    requiredFields.forEach(field => {
      if (!formData[field] || !formData[field].toString().trim()) {
        errors[field] = `${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`;
      }
    });
    
    if (formData.portfolioLink && !isValidUrl(formData.portfolioLink)) {
      errors.portfolioLink = 'Please enter a valid URL';
    }
    
    if (formData.email && !isValidEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (formData.phoneNumber && !isValidPhone(formData.phoneNumber)) {
      errors.phoneNumber = 'Please enter a valid phone number';
    }
    
    return errors;
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone) => {
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setError('Please fix the errors in the form');
      // You could set these errors to state to display them next to fields
      setSaving(false);
      return;
    }

    try {
      if (applicationId) {
        // Update existing application
        await applicationsService.updateApplication(applicationId, formData);
        showNotification('success', 'Application updated successfully!');
      } else {
        // Create new application
        await applicationsService.createApplication(user.id, formData);
        showNotification('success', 'Application submitted successfully!');
      }
      
      if (onSuccess) {
        onSuccess();
      } else {
        // Redirect to applications list after a short delay
        setTimeout(() => {
          window.location.href = '/applicant/applications';
        }, 2000);
      }
    } catch (error) {
      console.error('Error saving application:', error);
      const errorMsg = error.response?.data?.message || 'Failed to save application. Please try again.';
      setError(errorMsg);
      showNotification('error', errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center mb-6">
          <button
            onClick={handleGoBack}
            className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {applicationId ? 'Edit Application' : 'New Application'}
          </h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Business Information */}
            <div className="md:col-span-2">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Building className="w-5 h-5 mr-2 text-blue-600" />
                Business Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    required
                    value={formData.businessName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-1">
                    Business Type *
                  </label>
                  <select
                    id="businessType"
                    name="businessType"
                    required
                    value={formData.businessType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select type</option>
                    <option value="INDIVIDUAL">Individual</option>
                    <option value="PARTNERSHIP">Partnership</option>
                    <option value="CORPORATION">Corporation</option>
                    <option value="LLC">LLC</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="businessRegistrationNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Registration Number
                  </label>
                  <input
                    type="text"
                    id="businessRegistrationNumber"
                    name="businessRegistrationNumber"
                    value={formData.businessRegistrationNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="yearsInBusiness" className="block text-sm font-medium text-gray-700 mb-1">
                    Years in Business
                  </label>
                  <input
                    type="number"
                    id="yearsInBusiness"
                    name="yearsInBusiness"
                    min="0"
                    value={formData.yearsInBusiness}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="md:col-span-2">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-green-600" />
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    id="contactPerson"
                    name="contactPerson"
                    required
                    value={formData.contactPerson}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    required
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="md:col-span-2">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-red-600" />
                Address Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    required
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Services Information */}
            <div className="md:col-span-2">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Link className="w-5 h-5 mr-2 text-purple-600" />
                Services & Portfolio
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="servicesOffered" className="block text-sm font-medium text-gray-700 mb-1">
                    Services Offered *
                  </label>
                  <textarea
                    id="servicesOffered"
                    name="servicesOffered"
                    required
                    rows={3}
                    value={formData.servicesOffered}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe the services you offer..."
                  />
                </div>
                <div>
                  <label htmlFor="portfolioLink" className="block text-sm font-medium text-gray-700 mb-1">
                    Portfolio Link
                  </label>
                  <input
                    type="url"
                    id="portfolioLink"
                    name="portfolioLink"
                    value={formData.portfolioLink}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Information
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any additional information about your business or services..."
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleGoBack}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : (applicationId ? 'Update Application' : 'Submit Application')}
            </button>
          </div>
        </form>
      </div>

      <Notification
        type={notification.type}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />
    </div>
  );
};

export default ApplicationForm;