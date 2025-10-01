import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartDataPoint } from '../types';

interface RevenueChartProps {
  data: ChartDataPoint[];
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-semibold text-admin-900">Revenue Trend</h3>
        <p className="text-sm text-admin-600">Daily revenue over time</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#10B981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};