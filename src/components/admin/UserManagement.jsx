import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  UserCheck, 
  Filter,
  MoreVertical,
  Eye,
  Mail,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { usersService } from '../../services/users';
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

// User Form Modal
const UserForm = ({ isOpen, onClose, user = null, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'APPLICANT',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'APPLICANT',
        password: '' // Don't pre-fill password
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'APPLICANT',
        password: ''
      });
    }
    setError(null);
  }, [user, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
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
    if (!user && !formData.password.trim()) {
      setError('Password is required for new users');
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
      if (user) {
        // For update, only send password if it's provided
        const updateData = { 
          name: formData.name,
          email: formData.email,
          role: formData.role
        };
        if (formData.password.trim()) {
          updateData.password = formData.password;
        }
        const response = await usersService.updateUser(user.id, updateData);
        result = response.data || response;
      } else {
        const response = await usersService.createUser(formData);
        result = response.data || response;
      }
      
      onSuccess(result, user ? 'updated' : 'created');
      onClose();
    } catch (error) {
      console.error('Error saving user:', error);
      setError(error.response?.data?.message || 'Failed to save user');
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
              {user ? 'Edit User' : 'Add New User'}
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
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
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
              Role *
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            >
              <option value="APPLICANT">Applicant</option>
              <option value="REVIEWER">Reviewer</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password {user ? '(leave blank to keep current)' : '*'}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required={!user}
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
              {loading ? 'Saving...' : (user ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const UserManagement = () => {
  const { user: currentUser, isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [error, setError] = useState(null);
  const { notification, showSuccess, showError, hideNotification } = useNotification();

  useEffect(() => {
    if (currentUser && isAdmin()) {
      loadUsers();
    } else {
      setError('Access denied. Admin privileges required.');
      setLoading(false);
    }
  }, [currentUser]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await usersService.getAllUsers();
      // Handle both response formats (response.data or direct data)
      const data = response.data || response;
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading users:', error);
      const errorMessage = error.response?.status === 403 
        ? 'Access denied. You do not have permission to view users.'
        : 'Failed to load users. Please check your connection.';
      
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (userId === currentUser?.id) {
      showError('You cannot delete your own account');
      return;
    }

    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await usersService.deleteUser(userId);
        setUsers(users.filter(user => user.id !== userId));
        showSuccess('User deleted successfully');
      } catch (error) {
        console.error('Error deleting user:', error);
        showError(error.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const handleUserSuccess = (savedUser, action) => {
    if (action === 'created') {
      setUsers([...users, savedUser]);
      showSuccess('User created successfully');
    } else {
      setUsers(users.map(u => u.id === savedUser.id ? savedUser : u));
      showSuccess('User updated successfully');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'ALL' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-800 border-red-200';
      case 'REVIEWER': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'APPLICANT': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Check access permissions
  if (!currentUser || !isAdmin()) {
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

  if (error && users.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Users</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={loadUsers}
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
                <Users className="w-8 h-8 mr-3 text-purple-600" />
                User Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage system users and their roles
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add New User</span>
            </button>
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
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="ALL">All Roles</option>
                  <option value="ADMIN">Admin</option>
                  <option value="REVIEWER">Reviewer</option>
                  <option value="APPLICANT">Applicant</option>
                </select>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Total: <span className="font-semibold">{filteredUsers.length}</span> users
            </div>
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user, index) => (
            <div
              key={user.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* User Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-semibold text-lg">
                    {getInitials(user.name)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="relative">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* User Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Role</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Status</span>
                  <span className="flex items-center text-sm text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">User ID</span>
                  <span className="text-sm text-gray-600 font-mono">#{user.id}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between">
                <button className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">View</span>
                </button>
                <button 
                  onClick={() => {
                    setSelectedUser(user);
                    setShowEditModal(true);
                  }}
                  className="flex items-center space-x-2 px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span className="text-sm">Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  disabled={user.id === currentUser?.id}
                  className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-sm">Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Users Found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterRole !== 'ALL' 
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by creating your first user'
              }
            </p>
            {!searchTerm && filterRole === 'ALL' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300"
              >
                Create First User
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create User Modal */}
      <UserForm
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleUserSuccess}
      />

      {/* Edit User Modal */}
      <UserForm
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSuccess={handleUserSuccess}
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

export default UserManagement;