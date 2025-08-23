import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Building, 
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  UserCheck
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = {
    ADMIN: [
      { 
        label: 'Dashboard', 
        icon: LayoutDashboard, 
        path: '/admin/dashboard',
        color: 'text-blue-600'
      },
      { 
        label: 'Users Management', 
        icon: Users, 
        path: '/admin/users',
        color: 'text-green-600'
      },
      { 
        label: 'Applications', 
        icon: FileText, 
        path: '/admin/applications',
        color: 'text-purple-600'
      },
      { 
        label: 'Providers', 
        icon: Building, 
        path: '/admin/providers',
        color: 'text-orange-600'
      }
    ],
    REVIEWER: [
      { 
        label: 'Dashboard', 
        icon: LayoutDashboard, 
        path: '/reviewer/dashboard',
        color: 'text-blue-600'
      },
      { 
        label: 'Review Applications', 
        icon: CheckCircle, 
        path: '/reviewer/applications',
        color: 'text-purple-600'
      }
    ],
    APPLICANT: [
      { 
        label: 'Dashboard', 
        icon: LayoutDashboard, 
        path: '/applicant/dashboard',
        color: 'text-blue-600'
      },
      { 
        label: 'My Applications', 
        icon: FileText, 
        path: '/applicant/applications',
        color: 'text-green-600'
      },
      { 
        label: 'New Application', 
        icon: PlusCircle, 
        path: '/applicant/applications/new',
        color: 'text-purple-600'
      }
    ]
  };

  const currentMenuItems = user ? menuItems[user.role] || [] : [];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className={`bg-white shadow-lg border-r border-gray-100 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } fixed left-0 top-16 h-[calc(100vh-4rem)] z-40`}>
      
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-white shadow-md rounded-full p-1 border border-gray-200 hover:shadow-lg transition-all duration-200"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 text-gray-600" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        )}
      </button>

      {/* Menu Items */}
      <nav className="mt-8 px-3">
        <ul className="space-y-2">
          {currentMenuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`group flex items-center px-3 py-3 rounded-lg transition-all duration-200 ${
                    active 
                      ? 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${active ? item.color : 'text-gray-500 group-hover:text-gray-700'} ${
                    isCollapsed ? '' : 'mr-3'
                  } transition-colors duration-200`} />
                  
                  {!isCollapsed && (
                    <span className="font-medium text-sm">
                      {item.label}
                    </span>
                  )}

                  {/* Active Indicator */}
                  {active && (
                    <div className="ml-auto w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
                  )}
                </Link>

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-16 top-0 bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                    {item.label}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Role Badge */}
      {!isCollapsed && user && (
        <div className="absolute bottom-6 left-3 right-3">
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-3 border border-purple-200">
            <div className="flex items-center space-x-2">
              <UserCheck className="w-5 h-5 text-purple-600" />
              <div>
                <div className="text-sm font-semibold text-purple-700">
                  {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
                </div>
                <div className="text-xs text-purple-600">
                  Access Level
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;