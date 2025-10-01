import { apiService } from './api';
import { 
  SystemStats, 
  AnalyticsData, 
  ChartDataPoint,
  DateRange,
  ApiResponse 
} from '../types';

export class AnalyticsService {
  // System Overview
  async getSystemStats(): Promise<ApiResponse<SystemStats>> {
    return apiService.get('/admin/analytics/overview');
  }

  async getRealtimeStats(): Promise<ApiResponse<any>> {
    return apiService.get('/admin/analytics/realtime');
  }

  // User Analytics
  async getUserGrowthTrend(period: 'daily' | 'weekly' | 'monthly', days: number): Promise<ApiResponse<ChartDataPoint[]>> {
    return apiService.get('/admin/analytics/users/growth', { period, days });
  }

  async getUserSegmentation(): Promise<ApiResponse<any>> {
    return apiService.get('/admin/analytics/users/segmentation');
  }

  async getUserRetention(cohort?: string): Promise<ApiResponse<any>> {
    return apiService.get('/admin/analytics/users/retention', { cohort });
  }

  async getActiveUsers(period: 'hourly' | 'daily' | 'weekly'): Promise<ApiResponse<any>> {
    return apiService.get('/admin/analytics/users/active', { period });
  }

  // Content Analytics
  async getContentAnalytics(): Promise<ApiResponse<any>> {
    return apiService.get('/admin/analytics/content');
  }

  async getContentTrends(period: 'daily' | 'weekly' | 'monthly', days: number): Promise<ApiResponse<ChartDataPoint[]>> {
    return apiService.get('/admin/analytics/content/trends', { period, days });
  }

  async getPopularTopics(limit: number = 10): Promise<ApiResponse<any>> {
    return apiService.get('/admin/analytics/content/topics', { limit });
  }

  async getJobTypeDistribution(): Promise<ApiResponse<any>> {
    return apiService.get('/admin/analytics/content/job-types');
  }

  // Revenue Analytics
  async getRevenueAnalytics(dateRange?: DateRange): Promise<ApiResponse<any>> {
    return apiService.get('/admin/analytics/revenue', dateRange);
  }

  async getRevenueGrowth(period: 'daily' | 'weekly' | 'monthly', days: number): Promise<ApiResponse<ChartDataPoint[]>> {
    return apiService.get('/admin/analytics/revenue/growth', { period, days });
  }

  async getRevenueByPlan(dateRange?: DateRange): Promise<ApiResponse<any>> {
    return apiService.get('/admin/analytics/revenue/by-plan', dateRange);
  }

  async getChurnAnalysis(period: 'monthly' | 'quarterly'): Promise<ApiResponse<any>> {
    return apiService.get('/admin/analytics/revenue/churn', { period });
  }

  async getLifetimeValue(): Promise<ApiResponse<any>> {
    return apiService.get('/admin/analytics/revenue/ltv');
  }

  // System Performance
  async getSystemPerformance(hours: number = 24): Promise<ApiResponse<any>> {
    return apiService.get('/admin/analytics/performance', { hours });
  }

  async getErrorRates(period: 'hourly' | 'daily', hours: number = 24): Promise<ApiResponse<ChartDataPoint[]>> {
    return apiService.get('/admin/analytics/performance/errors', { period, hours });
  }

  async getResponseTimes(period: 'hourly' | 'daily', hours: number = 24): Promise<ApiResponse<ChartDataPoint[]>> {
    return apiService.get('/admin/analytics/performance/response-times', { period, hours });
  }

  // AI Usage Analytics
  async getAIUsage(dateRange?: DateRange): Promise<ApiResponse<any>> {
    return apiService.get('/admin/analytics/ai/usage', dateRange);
  }

  async getTokenUsageTrends(period: 'daily' | 'weekly' | 'monthly', days: number): Promise<ApiResponse<ChartDataPoint[]>> {
    return apiService.get('/admin/analytics/ai/tokens', { period, days });
  }

  async getAICosts(dateRange?: DateRange): Promise<ApiResponse<any>> {
    return apiService.get('/admin/analytics/ai/costs', dateRange);
  }

  async getAIPerformanceMetrics(): Promise<ApiResponse<any>> {
    return apiService.get('/admin/analytics/ai/performance');
  }

  // Custom Analytics
  async getCustomMetrics(metrics: string[], dateRange?: DateRange): Promise<ApiResponse<any>> {
    return apiService.post('/admin/analytics/custom', { metrics, dateRange });
  }

  // Predictive Analytics
  async getChurnPrediction(userId?: string): Promise<ApiResponse<any>> {
    return apiService.get('/admin/analytics/predictions/churn', { userId });
  }

  async getRevenueProjection(months: number): Promise<ApiResponse<any>> {
    return apiService.get('/admin/analytics/predictions/revenue', { months });
  }

  async getResourceProjection(months: number): Promise<ApiResponse<any>> {
    return apiService.get('/admin/analytics/predictions/resources', { months });
  }

  async getUpsellOpportunities(): Promise<ApiResponse<any>> {
    return apiService.get('/admin/analytics/predictions/upsell');
  }

  // Cohort Analysis
  async getCohortAnalysis(registrationPeriod: DateRange): Promise<ApiResponse<any>> {
    return apiService.get('/admin/analytics/cohorts', registrationPeriod);
  }

  async getCohortRetention(cohortId: string): Promise<ApiResponse<any>> {
    return apiService.get(`/admin/analytics/cohorts/${cohortId}/retention`);
  }

  // Funnel Analysis
  async getFunnelAnalysis(steps: string[], dateRange?: DateRange): Promise<ApiResponse<any>> {
    return apiService.post('/admin/analytics/funnel', { steps, dateRange });
  }

  // Comparative Analytics
  async getComparativeAnalytics(periods: DateRange[]): Promise<ApiResponse<any>> {
    return apiService.post('/admin/analytics/compare', { periods });
  }

  // Export Analytics
  async exportAnalytics(type: string, dateRange?: DateRange, format: 'csv' | 'pdf' | 'json' = 'csv'): Promise<ApiResponse<any>> {
    return apiService.post('/admin/analytics/export', { type, dateRange, format });
  }
}

export const analyticsService = new AnalyticsService();