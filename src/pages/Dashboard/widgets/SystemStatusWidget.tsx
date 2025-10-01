import React from 'react';
import { Zap } from 'lucide-react';
import { SystemStats } from '../types';

interface SystemStatusWidgetProps {
  stats: SystemStats;
}

export const SystemStatusWidget: React.FC<SystemStatusWidgetProps> = ({ stats }) => {
  const getProgressBarColor = (usage: number) => {
    if (usage > 80) return 'bg-red-500';
    if (usage > 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const metrics = [
    { label: 'CPU Usage', value: stats.cpuUsage },
    { label: 'Memory Usage', value: stats.memoryUsage },
    { label: 'Disk Usage', value: stats.diskUsage }
  ];

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-semibold text-admin-900">System Status</h3>
        <p className="text-sm text-admin-600">Current system performance</p>
      </div>
      <div className="space-y-4">
        {metrics.map((metric) => (
          <div key={metric.label}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-admin-700">{metric.label}</span>
              <span className="text-sm font-medium text-admin-900">{metric.value}%</span>
            </div>
            <div className="w-full bg-admin-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${getProgressBarColor(metric.value)}`}
                style={{ width: `${metric.value}%` }}
              />
            </div>
          </div>
        ))}

        <div className="pt-4 border-t border-admin-200">
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-green-500" />
            <span className="text-sm text-admin-700">All services operational</span>
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-admin-500">Last updated: just now</span>
          </div>
        </div>
      </div>
    </div>
  );
};