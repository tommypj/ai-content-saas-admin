import React from 'react';
import { useDashboardData, useDashboardActions, useDashboardConstants } from './hooks';
import { DashboardLoadingState, ChartsRow, BottomRow } from './components';
import { DashboardHeader, KeyMetricsGrid } from './widgets';

export default function DashboardPage() {
  const { stats, userGrowthData, revenueData, isLoading, error, handleRefresh } = useDashboardData();
  const { onRefresh, getStatCardColor } = useDashboardActions(stats, isLoading, error, handleRefresh);
  const { recentActivities } = useDashboardConstants();

  if (isLoading) {
    return <DashboardLoadingState />;
  }

  if (!stats || !userGrowthData || !revenueData) {
    return <DashboardLoadingState />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <DashboardHeader onRefresh={onRefresh} />

      {/* Key Metrics */}
      <KeyMetricsGrid stats={stats} getStatCardColor={getStatCardColor} />

      {/* Charts Row */}
      <ChartsRow userGrowthData={userGrowthData} revenueData={revenueData} />

      {/* Bottom Row */}
      <BottomRow activities={recentActivities} stats={stats} />
    </div>
  );
}