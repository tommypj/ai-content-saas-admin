import { apiService } from './api';

/**
 * Admin API Service
 * Handles all admin-specific API calls
 */

// Admin Dashboard & Analytics
export const adminAPI = {
  // Dashboard & Analytics
  getOverview: () => apiService.get('/admin/analytics/overview'),
  
  // Users Management
  getUsers: (params?: any) => apiService.get('/admin/users', params),
  getUserDetails: (userId: string) => apiService.get(`/admin/users/${userId}`),
  updateUser: (userId: string, updates: any) => apiService.put(`/admin/users/${userId}`, updates),
  suspendUser: (userId: string, reason?: string) => apiService.post(`/admin/users/${userId}/suspend`, { reason }),
  activateUser: (userId: string) => apiService.post(`/admin/users/${userId}/activate`),
  resetUserPassword: (userId: string) => apiService.post(`/admin/users/${userId}/reset-password`),
  updateUserLimits: (userId: string, limits: any) => apiService.put(`/admin/users/${userId}/limits`, limits),
  resetUserUsage: (userId: string) => apiService.post(`/admin/users/${userId}/reset-usage`),
  deleteUser: (userId: string, confirm: boolean) => apiService.delete(`/admin/users/${userId}`, { data: { confirm } }),
  bulkUserAction: (userIds: string[], action: string, data?: any) => 
    apiService.post('/admin/users/bulk', { userIds, action, data }),
  
  // Content Management
  getContentGroups: (params?: any) => apiService.get('/admin/content-groups', params),
  getContentDetails: (contentId: string) => apiService.get(`/admin/content-groups/${contentId}`),
  deleteContent: (contentId: string, confirm: boolean) => 
    apiService.delete(`/admin/content-groups/${contentId}`, { data: { confirm } }),
  bulkContentAction: (contentIds: string[], action: string, data?: any) => 
    apiService.post('/admin/content-groups/bulk', { contentIds, action, data }),
  
  // Jobs Management
  getJobs: (params?: any) => apiService.get('/admin/jobs', params),
  getJobStats: () => apiService.get('/admin/jobs/stats'),
  getJobDetails: (jobId: string) => apiService.get(`/admin/jobs/${jobId}`),
  retryJob: (jobId: string) => apiService.post(`/admin/jobs/${jobId}/retry`),
  cancelJob: (jobId: string) => apiService.post(`/admin/jobs/${jobId}/cancel`),
  deleteJob: (jobId: string) => apiService.delete(`/admin/jobs/${jobId}`),
  bulkJobAction: (jobIds: string[], action: string, data?: any) => 
    apiService.post('/admin/jobs/bulk', { jobIds, action, data }),
  
  // Settings Management
  getSettings: () => apiService.get('/admin/settings'),
  updateSettings: (settings: any) => apiService.put('/admin/settings', settings),
  testEmail: (email: string) => apiService.post('/admin/settings/email/test', { email }),
};

export default adminAPI;