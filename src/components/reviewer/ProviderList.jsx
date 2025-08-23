import React, { useState, useEffect } from 'react';
import { 
  Building, 
  User, 
  Mail, 
  Phone, 
  Star, 
  MapPin,
  ExternalLink,
  Clock,
  AlertCircle
} from 'lucide-react';
import { providersService } from '../../services/providers';

const ProviderList = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await providersService.getAllProviders();
      setProviders(data);
    } catch (error) {
      console.error('Error fetching providers:', error);
      setError('Failed to load providers');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'P';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Providers</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={fetchProviders}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 mb-8">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
              <Building className="w-8 h-8 mr-3 text-purple-600" />
              Approved Providers
            </h1>
            <p className="text-gray-600 mt-2">
              Discover our verified service providers
            </p>
            <div className="mt-4">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                {providers.length} Providers Available
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {providers.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Providers Available</h3>
            <p className="text-gray-600">
              No approved providers found at the moment. Please check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {providers.map((provider, index) => (
              <div
                key={provider.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Provider Header */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                    {getInitials(provider.businessName)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {provider.businessName}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <Star className="w-4 h-4 mr-1 text-yellow-500 fill-current" />
                      <span>4.8 (24 reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Provider Details */}
                <div className="space-y-3 mb-6">
                  {provider.contactPerson && (
                    <div className="flex items-center space-x-3 text-gray-600">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{provider.contactPerson}</span>
                    </div>
                  )}
                  
                  {provider.email && (
                    <div className="flex items-center space-x-3 text-gray-600">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{provider.email}</span>
                    </div>
                  )}
                  
                  {provider.phoneNumber && (
                    <div className="flex items-center space-x-3 text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{provider.phoneNumber}</span>
                    </div>
                  )}
                </div>

                {/* Services */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Services Offered</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Web Dev', 'Mobile Apps', 'Design', 'Marketing'].map((service, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-md border border-blue-200"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Status and Actions */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center text-sm text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>Active Provider</span>
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium rounded-lg hover:shadow-md transition-all duration-200">
                    Contact
                  </button>
                </div>

                {/* Quick Stats */}
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <div className="text-lg font-bold text-gray-900">15+</div>
                    <div className="text-xs text-gray-500">Projects</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <div className="text-lg font-bold text-gray-900">4.8</div>
                    <div className="text-xs text-gray-500">Rating</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <div className="text-lg font-bold text-gray-900">2Y</div>
                    <div className="text-xs text-gray-500">Experience</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Info */}
        {providers.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8 text-center">
            <div className="flex items-center justify-center space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{providers.length}</div>
                <div className="text-sm text-gray-600">Verified Providers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">100%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">24/7</div>
                <div className="text-sm text-gray-600">Support</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderList;