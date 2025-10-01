import React from 'react';
import { Clock } from 'lucide-react';
import { ActivityItem } from '../types';

interface RecentActivityWidgetProps {
  activities: ActivityItem[];
}

export const RecentActivityWidget: React.FC<RecentActivityWidgetProps> = ({ activities }) => {
  return (
    <div className="lg:col-span-2 card">
      <div className="card-header">
        <h3 className="text-lg font-semibold text-admin-900">Recent Activity</h3>
        <p className="text-sm text-admin-600">Latest system events and user actions</p>
      </div>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-admin-50">
            <div className={`w-2 h-2 rounded-full mt-2 ${
              activity.severity === 'error' ? 'bg-red-500' :
              activity.severity === 'warning' ? 'bg-yellow-500' :
              activity.severity === 'success' ? 'bg-green-500' :
              'bg-blue-500'
            }`} />
            <div className="flex-1">
              <p className="text-sm text-admin-900">{activity.message}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Clock size={12} className="text-admin-400" />
                <span className="text-xs text-admin-500">{activity.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};