import React, { useState, useEffect } from 'react';
import { 
  ReloadIcon, 
  PersonIcon, 
  FileTextIcon, 
  GearIcon,
  RocketIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  ClockIcon,
  BarChartIcon,
  DashboardIcon,
  LightningBoltIcon
} from '@radix-ui/react-icons';
import { adminAPI } from '../services/adminAPI';
import { Link } from 'react-router-dom';

interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  totalContentGroups: number;
  totalJobsProcessed: number;
  totalJobsToday: number;
  totalJobsThisWeek: number;
  totalJobsThisMonth: number;
  avgJobProcessingTime: number;
  systemUptime: number;
  aiTokensUsed: number;
  aiTokensToday: number;
  aiTokensThisWeek: number;
  aiTokensThisMonth: number;
  monthlyRevenue: number;
  conversionRate: number;
  errorRate: number;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
}

interface RecentActivity {
  id: string;
  type: 'user' | 'content' | 'job' | 'system';
  message: string;
  timestamp: Date;
  icon: any;
  color: string;
}

export default function EnhancedDashboard() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  useEffect(() => {
    fetchStats();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchStats(true);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchStats = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      setError(null);
      
      const response = await adminAPI.getOverview();
      setStats(response.data);
      setLastRefresh(new Date());
    } catch (err: any) {
      console.error('Failed to fetch dashboard stats:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getSystemHealthColor = () => {
    if (!stats) return 'text-gray-500';
    const avgUsage = (stats.cpuUsage + stats.memoryUsage + stats.diskUsage) / 3;
    if (avgUsage < 50) return 'text-green-600';
    if (avgUsage < 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSystemHealthText = () => {
    if (!stats) return 'Unknown';
    const avgUsage = (stats.cpuUsage + stats.memoryUsage + stats.diskUsage) / 3;
    if (avgUsage < 50) return 'Excellent';
    if (avgUsage < 75) return 'Good';
    return 'Warning';
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <ReloadIcon className="w-12 h-12 animate-spin text-admin-600 mx-auto mb-4" />
          <p className="text-admin-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-lg p-6">
          <CrossCircledIcon className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-900 text-center mb-2">
            {error}
          </h3>
          <button onClick={() => fetchStats()} className="btn-primary w-full mt-4">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-admin-900 flex items-center gap-3">
            <DashboardIcon className="w-8 h-8" />
            Dashboard Overview
          </h1>
          <p className="text-admin-600 mt-1">
            Real-time platform statistics and monitoring
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-admin-600">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </div>
          <button
            onClick={() => fetchStats()}
            disabled={loading}
            className="btn-secondary flex items-center gap-2"
          >
            <ReloadIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* System Health Alert */}
      <div className={`card border-l-4 ${
        getSystemHealthColor() === 'text-green-600' ? 'border-green-500 bg-green-50' :
        getSystemHealthColor() === 'text-yellow-600' ? 'border-yellow-500 bg-yellow-50' :
        'border-red-500 bg-red-50'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              getSystemHealthColor() === 'text-green-600' ? 'bg-green-100' :
              getSystemHealthColor() === 'text-yellow-600' ? 'bg-yellow-100' :
              'bg-red-100'
            }`}>
              <CheckCircledIcon className={`w-6 h-6 ${getSystemHealthColor()}`} />
            </div>
            <div>
              <h3 className="font-semibold text-admin-900">
                System Health: {getSystemHealthText()}
              </h3>
              <p className="text-sm text-admin-600">
                Uptime: {stats.systemUptime}% | Error Rate: {stats.errorRate}%
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-xs text-admin-600">CPU</p>
              <p className="text-lg font-semibold text-admin-900">{stats.cpuUsage}%</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-admin-600">Memory</p>
              <p className="text-lg font-semibold text-admin-900">{stats.memoryUsage}%</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-admin-600">Disk</p>
              <p className="text-lg font-semibold text-admin-900">{stats.diskUsage}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <Link to="/users" className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-admin-600 mb-1">Total Users</p>
              <p className="text-3xl font-bold text-admin-900">{formatNumber(stats.totalUsers)}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                  +{stats.newUsersToday} today
                </span>
                <span className="text-xs text-admin-600">
                  {stats.activeUsers} active
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <PersonIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Link>

        {/* Total Content */}
        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-admin-600 mb-1">Content Created</p>
              <p className="text-3xl font-bold text-admin-900">{formatNumber(stats.totalContentGroups)}</p>
              <p className="mt-2 text-xs text-admin-600">
                All-time content groups
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileTextIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Jobs Processed */}
        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-admin-600 mb-1">Jobs Processed</p>
              <p className="text-3xl font-bold text-admin-900">{formatNumber(stats.totalJobsProcessed)}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                  +{stats.totalJobsToday} today
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <GearIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* AI Tokens Used */}
        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-admin-600 mb-1">AI Tokens Used</p>
              <p className="text-3xl font-bold text-admin-900">{formatNumber(stats.aiTokensUsed)}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                  +{formatNumber(stats.aiTokensToday)} today
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <LightningBoltIcon className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue */}
        <div className="card bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-green-800 mb-1">Monthly Revenue</p>
              <p className="text-2xl font-bold text-green-900">{formatCurrency(stats.monthlyRevenue)}</p>
            </div>
            <BarChartIcon className="w-8 h-8 text-green-600" />
          </div>
        </div>

        {/* Processing Time */}
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-blue-800 mb-1">Avg Processing Time</p>
              <p className="text-2xl font-bold text-blue-900">{stats.avgJobProcessingTime}s</p>
            </div>
            <ClockIcon className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-purple-800 mb-1">Conversion Rate</p>
              <p className="text-2xl font-bold text-purple-900">{stats.conversionRate}%</p>
            </div>
            <RocketIcon className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        {/* New Users This Week */}
        <div className="card bg-gradient-to-br from-pink-50 to-pink-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-pink-800 mb-1">New Users (Week)</p>
              <p className="text-2xl font-bold text-pink-900">{stats.newUsersThisWeek}</p>
            </div>
            <PersonIcon className="w-8 h-8 text-pink-600" />
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage Trends */}
        <div className="card">
          <h3 className="text-lg font-semibold text-admin-900 mb-4">Usage Trends</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-admin-600">Today</span>
                <span className="font-medium text-admin-900">
                  {stats.totalJobsToday} jobs | {formatNumber(stats.aiTokensToday)} tokens
                </span>
              </div>
              <div className="w-full bg-admin-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${Math.min(100, (stats.totalJobsToday / stats.totalJobsThisWeek) * 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-admin-600">This Week</span>
                <span className="font-medium text-admin-900">
                  {stats.totalJobsThisWeek} jobs | {formatNumber(stats.aiTokensThisWeek)} tokens
                </span>
              </div>
              <div className="w-full bg-admin-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${Math.min(100, (stats.totalJobsThisWeek / stats.totalJobsThisMonth) * 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-admin-600">This Month</span>
                <span className="font-medium text-admin-900">
                  {stats.totalJobsThisMonth} jobs | {formatNumber(stats.aiTokensThisMonth)} tokens
                </span>
              </div>
              <div className="w-full bg-admin-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* User Growth */}
        <div className="card">
          <h3 className="text-lg font-semibold text-admin-900 mb-4">User Growth</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm text-admin-600">New Today</p>
                <p className="text-2xl font-bold text-blue-600">{stats.newUsersToday}</p>
              </div>
              <PersonIcon className="w-8 h-8 text-blue-600" />
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm text-admin-600">New This Week</p>
                <p className="text-2xl font-bold text-green-600">{stats.newUsersThisWeek}</p>
              </div>
              <PersonIcon className="w-8 h-8 text-green-600" />
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div>
                <p className="text-sm text-admin-600">New This Month</p>
                <p className="text-2xl font-bold text-purple-600">{stats.newUsersThisMonth}</p>
              </div>
              <PersonIcon className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-admin-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/users" className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <PersonIcon className="w-6 h-6 text-blue-600" />
            <div>
              <p className="font-medium text-admin-900">Manage Users</p>
              <p className="text-xs text-admin-600">{stats.totalUsers} total</p>
            </div>
          </Link>

          <Link to="/content" className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
            <FileTextIcon className="w-6 h-6 text-purple-600" />
            <div>
              <p className="font-medium text-admin-900">View Content</p>
              <p className="text-xs text-admin-600">{stats.totalContentGroups} items</p>
            </div>
          </Link>

          <Link to="/jobs" className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
            <GearIcon className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-medium text-admin-900">Monitor Jobs</p>
              <p className="text-xs text-admin-600">{stats.totalJobsProcessed} processed</p>
            </div>
          </Link>

          <Link to="/settings" className="flex items-center gap-3 p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
            <GearIcon className="w-6 h-6 text-orange-600" />
            <div>
              <p className="font-medium text-admin-900">Settings</p>
              <p className="text-xs text-admin-600">Configure platform</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}