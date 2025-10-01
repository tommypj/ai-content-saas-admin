import React from 'react';
import { RecentActivityWidget } from '../widgets/RecentActivityWidget';
import { SystemStatusWidget } from '../widgets/SystemStatusWidget';
import { ActivityItem, SystemStats } from '../types';

interface BottomRowProps {
  activities: ActivityItem[];
  stats: SystemStats;
}

export const BottomRow: React.FC<BottomRowProps> = ({ activities, stats }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <RecentActivityWidget activities={activities} />
      <SystemStatusWidget stats={stats} />
    </div>
  );
};