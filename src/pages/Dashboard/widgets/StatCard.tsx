import React from 'react';
import { StatCardProps } from '../types';

export const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon: Icon, color, type }) => {
  return (
    <div className={`stat-card border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="stat-title">{title}</p>
          <p className="stat-value">{value}</p>
          <p className="stat-change positive">{change}</p>
        </div>
        <Icon className={`h-8 w-8 ${
          type === 'users' ? 'text-blue-600' :
          type === 'content' ? 'text-green-600' :
          type === 'revenue' ? 'text-purple-600' :
          'text-orange-600'
        }`} />
      </div>
    </div>
  );
};