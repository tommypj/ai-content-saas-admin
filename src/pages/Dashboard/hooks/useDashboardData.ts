import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../../../services/analyticsService';
import { SystemStats, ChartDataPoint } from '../types';

// Mock data for development
const mockStats: SystemStats = {
  totalUsers: 1247,
  activeUsers: 892,
  newUsersToday: 23,
  newUsersThisWeek: 156,
  newUsersThisMonth: 487,
  totalContentGroups: 3421,
  totalJobsProcessed: 18937,
  totalJobsToday: 234,
  totalJobsThisWeek: 1876,
  totalJobsThisMonth: 7234,
  avgJobProcessingTime: 15.6,
  systemUptime: 99.9,
  aiTokensUsed: 8230000,
  aiTokensToday: 45000,
  aiTokensThisWeek: 324000,
  aiTokensThisMonth: 1230000,
  monthlyRevenue: 24500,
  conversionRate: 3.2,
  errorRate: 0.8,
  cpuUsage: 45,
  memoryUsage: 67,
  diskUsage: 34
};

const mockChartData: ChartDataPoint[] = [
  { date: '2024-01-01', value: 400 },
  { date: '2024-01-02', value: 300 },
  { date: '2024-01-03', value: 600 },
  { date: '2024-01-04', value: 800 },
  { date: '2024-01-05', value: 700 },
  { date: '2024-01-06', value: 900 },
  { date: '2024-01-07', value: 1000 }
];

export const useDashboardData = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  // System stats query
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['systemStats', refreshKey],
    queryFn: async () => {
      try {
        const response = await analyticsService.getSystemStats();
        return response.data;
      } catch (err: any) {
        console.error('Failed to fetch real stats, using mock:', err);
        // Fallback to mock data if API fails
        return mockStats;
      }
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // User growth data query
  const { data: userGrowthData } = useQuery({
    queryKey: ['userGrowth'],
    queryFn: async () => mockChartData,
  });

  // Revenue data query
  const { data: revenueData } = useQuery({
    queryKey: ['revenueData'],
    queryFn: async () => mockChartData.map(item => ({ ...item, value: item.value * 25 })),
  });

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return {
    stats,
    userGrowthData,
    revenueData,
    isLoading,
    error,
    handleRefresh
  };
};