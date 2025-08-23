import api from './api';

export const providersService = {
  // Get all providers
  getAllProviders: async () => {
    const response = await api.get('/providers');
    return response.data;
  },

  // Get provider by ID
  getProviderById: async (providerId) => {
    const response = await api.get(`/providers/${providerId}`);
    return response.data;
  },

  // Create provider
  createProvider: async (userId, providerData) => {
    const response = await api.post(`/providers/user/${userId}`, providerData);
    return response.data;
  },

  // Update provider
  updateProvider: async (providerId, providerData) => {
    const response = await api.put(`/providers/${providerId}`, providerData);
    return response.data;
  },

  // Delete provider
  deleteProvider: async (providerId) => {
    await api.delete(`/providers/${providerId}`);
  }
};