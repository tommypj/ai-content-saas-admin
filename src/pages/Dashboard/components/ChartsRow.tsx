import React from 'react';
import { UserGrowthChart } from '../widgets/UserGrowthChart';
import { RevenueChart } from '../widgets/RevenueChart';
import { ChartDataPoint } from '../types';

interface ChartsRowProps {
  userGrowthData: ChartDataPoint[];
  revenueData: ChartDataPoint[];
}

export const ChartsRow: React.FC<ChartsRowProps> = ({ userGrowthData, revenueData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <UserGrowthChart data={userGrowthData} />
      <RevenueChart data={revenueData} />
    </div>
  );
};