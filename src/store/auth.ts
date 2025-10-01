import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AdminUser, AdminLoginRequest } from '../types';
import { apiService } from '../services/api';

interface AuthState {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: AdminLoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: AdminLoginRequest) => {
        set({ isLoading: true, error: null });
        
        console.log('🔐 Auth store login attempt:', credentials.email);
        
        try {
          const response = await apiService.login(credentials);
          
          console.log('✅ Auth store login successful:', response.user.email);
          
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } catch (error: any) {
          console.error('❌ Auth store login failed:', error);
          
          const errorMessage = error.response?.data?.message || error.message || 'Login failed';
          
          console.log('📢 Setting error in store:', errorMessage);
          
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage
          });
          
          // Re-throw to let the component handle it
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        
        try {
          await apiService.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });
        }
      },

      refreshToken: async () => {
        try {
          const response = await apiService.refreshToken();
          set({ token: response.token });
        } catch (error) {
          // If refresh fails, logout user
          get().logout();
          throw error;
        }
      },

      clearError: () => {
        set({ error: null });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      hydrate: () => {
        console.log('💧 Hydrating auth state...');
        const token = localStorage.getItem('adminToken');
        const userStr = localStorage.getItem('adminUser');
        
        console.log('📊 Auth hydration check:', {
          hasToken: !!token,
          hasUser: !!userStr,
          tokenPreview: token?.substring(0, 20) + '...' || 'None'
        });
        
        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            console.log('✅ Auth state hydrated successfully:', user.email);
            set({
              user,
              token,
              isAuthenticated: true
            });
          } catch (error) {
            console.error('❌ Failed to hydrate auth state:', error);
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            set({
              user: null,
              token: null,
              isAuthenticated: false
            });
          }
        } else {
          console.log('📊 No stored auth data found');
          set({
            user: null,
            token: null,
            isAuthenticated: false
          });
        }
      }
    }),
    {
      name: 'admin-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

// Convenience hook
export const useAuth = () => useAuthStore();