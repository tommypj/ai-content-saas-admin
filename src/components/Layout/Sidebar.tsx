import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  BarChart3, 
  CreditCard, 
  Shield, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useUIStore } from '../../store/ui';
import { useAuth } from '../../store/auth';

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    permissions: []
  },
  {
    name: 'Users',
    href: '/users',
    icon: Users,
    permissions: ['users:read']
  },
  {
    name: 'Content',
    href: '/content',
    icon: FileText,
    permissions: ['content:read']
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    permissions: ['analytics:read']
  },
  {
    name: 'Billing',
    href: '/billing',
    icon: CreditCard,
    permissions: ['billing:read']
  },
  {
    name: 'Security',
    href: '/security',
    icon: Shield,
    permissions: ['security:read']
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    permissions: ['system:manage']
  }
];

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const { user } = useAuth();
  const location = useLocation();

  const hasPermission = (permissions: string[]) => {
    if (!user) return false;
    if (user.role === 'super_admin') return true;
    if (permissions.length === 0) return true;
    // Check for wildcard permission
    if (user.permissions.includes('*')) return true;
    return permissions.some(permission => user.permissions.includes(permission));
  };

  return (
    <div className={`${
      sidebarCollapsed ? 'w-16' : 'w-64'
    } bg-white border-r border-admin-200 fixed left-0 top-0 h-full z-30 transition-all duration-300 ease-in-out shadow-sm`}>
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-admin-200">
        <div className={`${sidebarCollapsed ? 'hidden' : 'block'}`}>
          <h1 className="text-xl font-bold text-primary-600">A-Stats Admin</h1>
          <p className="text-xs text-admin-500 mt-1">Content Studio</p>
        </div>
        
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-admin-100 transition-colors"
        >
          {sidebarCollapsed ? (
            <ChevronRight size={16} className="text-admin-600" />
          ) : (
            <ChevronLeft size={16} className="text-admin-600" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => {
          if (!hasPermission(item.permissions)) {
            return null;
          }

          const isActive = location.pathname === item.href || 
                          (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
          
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500'
                  : 'text-admin-600 hover:bg-admin-50 hover:text-admin-900'
              }`}
            >
              <item.icon size={20} className={isActive ? 'text-primary-600' : 'text-admin-500'} />
              <span className={`font-medium ${sidebarCollapsed ? 'hidden' : 'block'}`}>
                {item.name}
              </span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Info */}
      {!sidebarCollapsed && user && (
        <div className="absolute bottom-4 left-4 right-4 p-3 bg-admin-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-medium text-sm">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-admin-900 truncate">
                {user.name}
              </p>
              <p className="text-xs text-admin-500 capitalize">
                {user.role.replace('_', ' ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Collapsed User Info */}
      {sidebarCollapsed && user && (
        <div className="absolute bottom-4 left-2 right-2">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-primary-600 font-medium">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}