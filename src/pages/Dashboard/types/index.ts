export interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  totalContentGroups: number;
  totalJobsProcessed: number;
  totalJobsToday: number;
  totalJobsThisWeek: number;
  totalJobsThisMonth: number;
  avgJobProcessingTime: number;
  systemUptime: number;
  aiTokensUsed: number;
  aiTokensToday: number;
  aiTokensThisWeek: number;
  aiTokensThisMonth: number;
  monthlyRevenue: number;
  conversionRate: number;
  errorRate: number;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
}

export interface ChartDataPoint {
  date: string;
  value: number;
}

export interface ActivityItem {
  id: string;
  type: string;
  message: string;
  time: string;
  severity: 'info' | 'success' | 'warning' | 'error';
}

export interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ComponentType<any>;
  color: string;
  type: string;
}