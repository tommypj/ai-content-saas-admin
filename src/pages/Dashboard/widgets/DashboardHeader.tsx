import React from 'react';
import { Activity } from 'lucide-react';

interface DashboardHeaderProps {
  onRefresh: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onRefresh }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-admin-900">Dashboard</h1>
        <p className="text-admin-600 mt-1">System overview and key metrics</p>
      </div>
      <button
        onClick={onRefresh}
        className="btn-primary flex items-center space-x-2"
      >
        <Activity size={16} />
        <span>Refresh</span>
      </button>
    </div>
  );
};