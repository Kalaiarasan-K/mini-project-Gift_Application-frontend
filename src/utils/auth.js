export const getToken = () => {
  return localStorage.getItem('token');
};

export const getUserFromStorage = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    return null;
  }
};

export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};

export const formatRole = (role) => {
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
};

export const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase();
};