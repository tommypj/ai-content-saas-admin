import React from 'react';
import { 
  Users, 
  FileText, 
  DollarSign, 
  TrendingUp
} from 'lucide-react';
import { StatCard } from './StatCard';
import { SystemStats } from '../types';

interface KeyMetricsGridProps {
  stats: SystemStats;
  getStatCardColor: (type: string) => string;
}

export const KeyMetricsGrid: React.FC<KeyMetricsGridProps> = ({ stats, getStatCardColor }) => {
  // Handle undefined or loading stats
  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: (stats.totalUsers || 0).toLocaleString(),
      change: `+${stats.newUsersThisMonth || 0} this month`,
      icon: Users,
      type: 'users'
    },
    {
      title: 'Content Generated',
      value: (stats.totalContentGroups || 0).toLocaleString(),
      change: `+${stats.totalJobsThisMonth || 0} jobs this month`,
      icon: FileText,
      type: 'content'
    },
    {
      title: 'Monthly Revenue',
      value: `${(stats.monthlyRevenue || 0).toLocaleString()}`,
      change: `+${stats.conversionRate || 0}% conversion`,
      icon: DollarSign,
      type: 'revenue'
    },
    {
      title: 'System Health',
      value: `${stats.systemUptime || 0}%`,
      change: `${stats.avgJobProcessingTime || 0}s avg response`,
      icon: TrendingUp,
      type: 'performance'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          icon={stat.icon}
          color={getStatCardColor(stat.type)}
          type={stat.type}
        />
      ))}
    </div>
  );
};