import React from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

interface JobStats {
  total: number;
  pending: number;
  running: number;
  succeeded: number;
  failed: number;
  avgProcessingTime: number;
  totalTokens: number;
}

interface JobStatsCardsProps {
  stats: JobStats;
}

export default function JobStatsCards({ stats }: JobStatsCardsProps) {
  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Jobs */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600 text-sm">Total Jobs</span>
          <Clock className="w-5 h-5 text-gray-400" />
        </div>
        <div className="text-2xl font-bold text-gray-900">{stats.total.toLocaleString()}</div>
      </div>

      {/* Succeeded */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600 text-sm">Succeeded</span>
          <CheckCircle className="w-5 h-5 text-green-500" />
        </div>
        <div className="text-2xl font-bold text-green-600">{stats.succeeded.toLocaleString()}</div>
        <div className="text-xs text-gray-500 mt-1">
          {stats.total > 0 ? ((stats.succeeded / stats.total) * 100).toFixed(1) : 0}% success rate
        </div>
      </div>

      {/* Failed */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600 text-sm">Failed</span>
          <XCircle className="w-5 h-5 text-red-500" />
        </div>
        <div className="text-2xl font-bold text-red-600">{stats.failed.toLocaleString()}</div>
        <div className="text-xs text-gray-500 mt-1">
          {stats.total > 0 ? ((stats.failed / stats.total) * 100).toFixed(1) : 0}% failure rate
        </div>
      </div>

      {/* Avg Processing Time */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600 text-sm">Avg Processing Time</span>
          <Clock className="w-5 h-5 text-blue-500" />
        </div>
        <div className="text-2xl font-bold text-gray-900">
          {formatDuration(stats.avgProcessingTime)}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {stats.totalTokens.toLocaleString()} tokens used
        </div>
      </div>
    </div>
  );
}
