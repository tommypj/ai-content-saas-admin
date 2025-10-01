import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Settings, 
  LogOut, 
  User,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../store/auth';
import { useUIStore } from '../../store/ui';
import { useDashboardStore } from '../../store/ui';

export default function Header() {
  const { user, logout } = useAuth();
  const { notifications, markNotificationRead, removeNotification } = useUIStore();
  const { lastUpdated, autoRefresh, setAutoRefresh } = useDashboardStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.read);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const formatLastUpdated = (date: Date | null) => {
    if (!date) return 'Never';
    
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <header className="bg-white border-b border-admin-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-admin-400" />
            <input
              type="text"
              placeholder="Search users, content, or analytics..."
              className="w-full pl-10 pr-4 py-2 border border-admin-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Auto-refresh Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`p-2 rounded-lg transition-colors ${
                autoRefresh 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-admin-100 text-admin-500'
              }`}
              title={`Auto-refresh: ${autoRefresh ? 'On' : 'Off'}`}
            >
              <RefreshCw size={16} className={autoRefresh ? 'animate-spin' : ''} />
            </button>
            <span className="text-xs text-admin-500">
              Updated {formatLastUpdated(lastUpdated)}
            </span>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-admin-100 transition-colors"
            >
              <Bell size={20} className="text-admin-600" />
              {unreadNotifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadNotifications.length > 9 ? '9+' : unreadNotifications.length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-admin-200 rounded-lg shadow-lg z-50">
                <div className="p-4 border-b border-admin-200">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-admin-900">Notifications</h3>
                    <span className="text-sm text-admin-500">
                      {unreadNotifications.length} unread
                    </span>
                  </div>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    <div className="space-y-1">
                      {notifications.slice(0, 10).map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 hover:bg-admin-50 cursor-pointer border-l-4 ${
                            notification.read 
                              ? 'border-transparent' 
                              : notification.type === 'error' 
                                ? 'border-red-500 bg-red-50' 
                                : notification.type === 'warning'
                                  ? 'border-yellow-500 bg-yellow-50'
                                  : notification.type === 'success'
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-blue-500 bg-blue-50'
                          }`}
                          onClick={() => {
                            if (!notification.read) {
                              markNotificationRead(notification.id);
                            }
                          }}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              notification.type === 'error' ? 'bg-red-500' :
                              notification.type === 'warning' ? 'bg-yellow-500' :
                              notification.type === 'success' ? 'bg-green-500' :
                              'bg-blue-500'
                            }`} />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-admin-900">
                                {notification.title}
                              </p>
                              <p className="text-sm text-admin-600 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-admin-400 mt-2">
                                {notification.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeNotification(notification.id);
                              }}
                              className="text-admin-400 hover:text-admin-600"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-admin-500">No notifications</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-admin-100 transition-colors"
            >
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-medium text-sm">
                  {user?.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-admin-900">{user?.name}</p>
                <p className="text-xs text-admin-500 capitalize">
                  {user?.role.replace('_', ' ')}
                </p>
              </div>
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-admin-200 rounded-lg shadow-lg z-50">
                <div className="p-2">
                  <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-admin-700 hover:bg-admin-50 rounded-lg">
                    <User size={16} />
                    <span>Profile</span>
                  </button>
                  <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-admin-700 hover:bg-admin-50 rounded-lg">
                    <Settings size={16} />
                    <span>Settings</span>
                  </button>
                  <hr className="my-2 border-admin-200" />
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}