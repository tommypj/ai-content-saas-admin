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
  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      change: `+${stats.newUsersThisMonth} this month`,
      icon: Users,
      type: 'users'
    },
    {
      title: 'Content Generated',
      value: stats.totalContentGroups.toLocaleString(),
      change: `+${stats.totalJobsThisMonth} jobs this month`,
      icon: FileText,
      type: 'content'
    },
    {
      title: 'Monthly Revenue',
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      change: `+${stats.conversionRate}% conversion`,
      icon: DollarSign,
      type: 'revenue'
    },
    {
      title: 'System Health',
      value: `${stats.systemUptime}%`,
      change: `${stats.avgJobProcessingTime}s avg response`,
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