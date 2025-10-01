import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { AdminLoginRequest, AdminLoginResponse } from '../types';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Add timestamp for cache busting
        if (config.method === 'get') {
          config.params = {
            ...config.params,
            _t: Date.now()
          };
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        // Extract data from the response if it has a success/data structure
        if (response.data && typeof response.data === 'object' && 'success' in response.data) {
          return response;
        }
        return response;
      },
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          window.location.href = '/login';
        }

        // Log error for debugging
        console.error('API Error:', {
          status: error.response?.status,
          message: error.response?.data,
          url: error.config?.url,
          method: error.config?.method
        });

        return Promise.reject(error);
      }
    );
  }

  // Generic HTTP methods
  async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.api.get(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.api.post(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.api.put(url, data);
    return response.data;
  }

  async patch<T>(url: string, data?: any): Promise<T> {
    const response = await this.api.patch(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.api.delete(url);
    return response.data;
  }

  // Authentication methods
  async login(credentials: AdminLoginRequest): Promise<AdminLoginResponse> {
    console.log('🔐 API service login attempt:', credentials.email);
    
    try {
      // Use regular auth endpoint - any user can access admin panel for demo
      const response = await this.post<any>('/auth/login', credentials);
      
      console.log('✅ API response received:', {
        success: response.success,
        hasUser: !!response.user,
        hasToken: !!response.token,
        userEmail: response.user?.email,
        fullResponse: response // Full response for debugging
      });
      
      // Handle the response format from backend
      // Backend auth returns either {success: true, ...} or just {user: ..., token: ...}
      if ((response.success && response.token) || (response.token && response.user)) {
        localStorage.setItem('adminToken', response.token);
        
        // Transform regular user to admin user format
        const adminUser = {
          id: response.user.id || response.user._id,
          email: response.user.email,
          name: response.user.username || response.user.email,
          role: 'admin' as const, // For demo, treat all users as admins
          permissions: ['*'], // Full permissions for demo
          twoFactorEnabled: false,
          lastLogin: new Date(),
          isActive: true,
          createdAt: response.user.createdAt ? new Date(response.user.createdAt) : new Date(),
          updatedAt: response.user.updatedAt ? new Date(response.user.updatedAt) : new Date()
        };
        
        localStorage.setItem('adminUser', JSON.stringify(adminUser));
        
        console.log('✅ Admin user created and stored:', adminUser.email);
        
        return {
          user: adminUser,
          token: response.token,
          refreshToken: response.refreshToken || response.token
        };
      } else {
        console.error('❌ Invalid response format:', { 
          hasSuccess: response.hasOwnProperty('success'),
          successValue: response.success,
          hasToken: !!response.token,
          hasUser: !!response.user,
          responseKeys: Object.keys(response)
        });
        throw new Error(response.message || response.error || 'Login failed');
      }
    } catch (error: any) {
      console.error('❌ API service login error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url
      });
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      // Try to logout via admin endpoint, but don't fail if it doesn't exist
      await this.post('/auth/logout');
    } catch (error) {
      console.log('Logout endpoint not available, cleaning up locally');
    } finally {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
    }
  }

  async refreshToken(): Promise<{ token: string }> {
    const response = await this.post<{ token: string }>('/admin/auth/refresh');
    
    if (response.token) {
      localStorage.setItem('adminToken', response.token);
    }
    
    return response;
  }

  async getCurrentUser() {
    return this.get('/admin/auth/me');
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.get('/health');
  }

  // File upload helper
  async uploadFile(file: File, endpoint: string, onProgress?: (progress: number) => void): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.api.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
  }

  // Batch operations helper
  async batchRequest<T>(requests: Array<{ method: string; url: string; data?: any }>): Promise<T[]> {
    const promises = requests.map(req => {
      switch (req.method.toLowerCase()) {
        case 'get':
          return this.get(req.url);
        case 'post':
          return this.post(req.url, req.data);
        case 'put':
          return this.put(req.url, req.data);
        case 'delete':
          return this.delete(req.url);
        default:
          throw new Error(`Unsupported method: ${req.method}`);
      }
    });

    return Promise.all(promises);
  }
}

// Create singleton instance
export const apiService = new ApiService();
export default apiService;