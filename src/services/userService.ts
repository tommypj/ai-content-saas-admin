import { apiService } from './api';
import { 
  User, 
  UserListFilters, 
  UserAction, 
  UserUsage,
  PaginatedResponse,
  ApiResponse 
} from '../types';

export class UserService {
  // Get all users with filters and pagination
  async getUsers(filters: UserListFilters): Promise<PaginatedResponse<User>> {
    return apiService.get('/admin/users', filters);
  }

  // Get single user details
  async getUser(userId: string): Promise<ApiResponse<User>> {
    return apiService.get(`/admin/users/${userId}`);
  }

  // Update user
  async updateUser(userId: string, updates: Partial<User>): Promise<ApiResponse<User>> {
    return apiService.put(`/admin/users/${userId}`, updates);
  }

  // User actions
  async suspendUser(userId: string, reason: string, duration?: number): Promise<ApiResponse<void>> {
    return apiService.post(`/admin/users/${userId}/suspend`, { reason, duration });
  }

  async unsuspendUser(userId: string): Promise<ApiResponse<void>> {
    return apiService.post(`/admin/users/${userId}/unsuspend`);
  }

  async banUser(userId: string, reason: string): Promise<ApiResponse<void>> {
    return apiService.post(`/admin/users/${userId}/ban`, { reason });
  }

  async deleteUser(userId: string, reason: string): Promise<ApiResponse<void>> {
    return apiService.delete(`/admin/users/${userId}?reason=${encodeURIComponent(reason)}`);
  }

  async forcePasswordReset(userId: string): Promise<ApiResponse<void>> {
    return apiService.post(`/admin/users/${userId}/reset-password`);
  }

  // User analytics
  async getUserAnalytics(userId: string): Promise<ApiResponse<any>> {
    return apiService.get(`/admin/users/${userId}/analytics`);
  }

  async getUserUsage(userId: string, period?: string): Promise<ApiResponse<UserUsage>> {
    return apiService.get(`/admin/users/${userId}/usage`, { period });
  }

  async getUserBilling(userId: string): Promise<ApiResponse<any>> {
    return apiService.get(`/admin/users/${userId}/billing`);
  }

  async getUserContent(userId: string): Promise<ApiResponse<any>> {
    return apiService.get(`/admin/users/${userId}/content`);
  }

  async getUserSessions(userId: string): Promise<ApiResponse<any>> {
    return apiService.get(`/admin/users/${userId}/sessions`);
  }

  async revokeAllSessions(userId: string): Promise<ApiResponse<void>> {
    return apiService.post(`/admin/users/${userId}/sessions/revoke-all`);
  }

  // Bulk operations
  async bulkSuspend(userIds: string[], reason: string): Promise<ApiResponse<void>> {
    return apiService.post('/admin/users/bulk/suspend', { userIds, reason });
  }

  async bulkUpdatePlan(userIds: string[], newPlan: string): Promise<ApiResponse<void>> {
    return apiService.post('/admin/users/bulk/update-plan', { userIds, newPlan });
  }

  async bulkNotify(userIds: string[], message: any): Promise<ApiResponse<void>> {
    return apiService.post('/admin/users/bulk/notify', { userIds, message });
  }

  // User stats
  async getUserStats(): Promise<ApiResponse<any>> {
    return apiService.get('/admin/users/stats');
  }

  // Export user data (GDPR compliance)
  async exportUserData(userId: string): Promise<ApiResponse<any>> {
    return apiService.post(`/admin/users/${userId}/export`);
  }

  // Search users
  async searchUsers(query: string): Promise<ApiResponse<User[]>> {
    return apiService.get('/admin/users/search', { q: query });
  }
}

export const userService = new UserService();