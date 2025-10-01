import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartDataPoint } from '../types';

interface UserGrowthChartProps {
  data: ChartDataPoint[];
}

export const UserGrowthChart: React.FC<UserGrowthChartProps> = ({ data }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-semibold text-admin-900">User Growth</h3>
        <p className="text-sm text-admin-600">Daily active users over time</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};