export const ROLES = {
  ADMIN: 'ADMIN',
  REVIEWER: 'REVIEWER',
  APPLICANT: 'APPLICANT'
};

export const APPLICATION_STATUS = {
  PENDING: 'PENDING',
  UNDER_REVIEW: 'UNDER_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
};

export const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  UNDER_REVIEW: 'bg-blue-100 text-blue-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800'
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register'
  },
  USERS: '/users',
  APPLICATIONS: '/applications',
  PROVIDERS: '/providers'
};

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    APPLICATIONS: '/admin/applications',
    PROVIDERS: '/admin/providers'
  },
  REVIEWER: {
    DASHBOARD: '/reviewer/dashboard',
    APPLICATIONS: '/reviewer/applications'
  },
  APPLICANT: {
    DASHBOARD: '/applicant/dashboard',
    APPLICATIONS: '/applicant/applications',
    NEW_APPLICATION: '/applicant/applications/new'
  }
};