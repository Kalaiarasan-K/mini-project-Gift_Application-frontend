import api from './api';

export const authService = {
  // Login user
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // Register user
  register: async (name, email, password, role) => {
    const response = await api.post('/auth/register', { name, email, password, role });
    return response.data;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  }
};