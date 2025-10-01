import { create } from 'zustand';
import { SystemStats } from '../types';

interface DashboardState {
  stats: SystemStats | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refreshInterval: number;
  autoRefresh: boolean;
  
  // Actions
  setStats: (stats: SystemStats) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setLastUpdated: (date: Date) => void;
  setRefreshInterval: (interval: number) => void;
  setAutoRefresh: (enabled: boolean) => void;
  clearError: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  stats: null,
  isLoading: false,
  error: null,
  lastUpdated: null,
  refreshInterval: 30000, // 30 seconds
  autoRefresh: true,

  setStats: (stats: SystemStats) => {
    set({ 
      stats, 
      lastUpdated: new Date(),
      error: null 
    });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  setLastUpdated: (date: Date) => {
    set({ lastUpdated: date });
  },

  setRefreshInterval: (interval: number) => {
    set({ refreshInterval: interval });
  },

  setAutoRefresh: (enabled: boolean) => {
    set({ autoRefresh: enabled });
  },

  clearError: () => {
    set({ error: null });
  }
}));

// UI State Store
interface UIState {
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark' | 'auto';
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
  }>;
  
  // Actions
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  addNotification: (notification: Omit<UIState['notifications'][0], 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  sidebarCollapsed: false,
  theme: 'light',
  notifications: [],

  toggleSidebar: () => {
    set({ sidebarCollapsed: !get().sidebarCollapsed });
  },

  setSidebarCollapsed: (collapsed: boolean) => {
    set({ sidebarCollapsed: collapsed });
  },

  setTheme: (theme: 'light' | 'dark' | 'auto') => {
    set({ theme });
    
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // Auto - use system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  },

  addNotification: (notification) => {
    const newNotification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false
    };
    
    set({ 
      notifications: [newNotification, ...get().notifications].slice(0, 50) // Keep only last 50
    });

    // Auto-remove after 5 seconds for success/info notifications
    if (notification.type === 'success' || notification.type === 'info') {
      setTimeout(() => {
        get().removeNotification(newNotification.id);
      }, 5000);
    }
  },

  markNotificationRead: (id: string) => {
    set({
      notifications: get().notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      )
    });
  },

  removeNotification: (id: string) => {
    set({
      notifications: get().notifications.filter(n => n.id !== id)
    });
  },

  clearNotifications: () => {
    set({ notifications: [] });
  }
}));