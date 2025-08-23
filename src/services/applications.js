import api from './api';

export const applicationsService = {
  getUserApplications: async (userId) => {
    const response = await api.get(`/applications/user/${userId}`);
    return response.data;
  },
  createApplication: async (userId, data) => {
    const response = await api.post(`/applications/user/${userId}`, data);
    return response.data;
  },
  getAllApplications: async () => {
    const response = await api.get('/applications');
    return response.data;
  },
  approveApplication: async (id, comments) => {
    const response = await api.put(`/applications/${id}/approve`, comments, {
      headers: { 'Content-Type': 'text/plain' },
    });
    return response.data;
  },
  rejectApplication: async (id, comments) => {
    const response = await api.put(`/applications/${id}/reject`, comments, {
      headers: { 'Content-Type': 'text/plain' },
    });
    return response.data;
  },
};