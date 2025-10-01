import React from 'react';

export const DashboardLoadingState: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-admin-900">Dashboard</h1>
        <div className="animate-pulse bg-admin-200 h-10 w-32 rounded-lg"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="animate-pulse bg-white rounded-xl h-32"></div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="animate-pulse bg-white rounded-xl h-80"></div>
        <div className="animate-pulse bg-white rounded-xl h-80"></div>
      </div>
    </div>
  );
};