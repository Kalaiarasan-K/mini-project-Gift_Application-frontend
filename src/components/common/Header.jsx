import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { User, LogOut, Gift, Menu, X, Bell, Settings } from 'lucide-react';
import { getInitials, formatRole } from '../../utils/auth';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const getDashboardRoute = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'ADMIN': return '/admin/dashboard';
      case 'REVIEWER': return '/reviewer/dashboard';
      case 'APPLICANT': return '/applicant/dashboard';
      default: return '/';
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-200">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <Link 
              to={getDashboardRoute()} 
              className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200"
            >
              GiftApp
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                {/* Notifications */}
                <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>

                {/* User Info */}
                <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors duration-200">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {user.name ? getInitials(user.name) : <User className="w-4 h-4" />}
                  </div>
                  <div className="text-left">
                    <div className="text-gray-700 font-medium text-sm">
                      {user.name || user.email}
                    </div>
                    <div className="text-gray-500 text-xs">
                      {formatRole(user.role)}
                    </div>
                  </div>
                </div>

                {/* Settings */}
                <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200">
                  <Settings className="w-5 h-5" />
                </button>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group"
                >
                  <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
                  <span className="font-medium">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg font-medium transition-all duration-200"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-4 py-3 space-y-3 border-t border-gray-100 bg-white">
            {user ? (
              <>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {user.name ? getInitials(user.name) : <User className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-gray-700 font-medium">
                      {user.name || user.email}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {formatRole(user.role)}
                    </div>
                  </div>
                </div>
                
                <button className="w-full flex items-center space-x-2 p-3 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200">
                  <Bell className="w-4 h-4" />
                  <span>Notifications</span>
                </button>
                
                <button className="w-full flex items-center space-x-2 p-3 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2 p-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-medium">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full p-3 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg font-medium transition-all duration-200"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full p-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg text-center hover:shadow-lg transition-all duration-200"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;