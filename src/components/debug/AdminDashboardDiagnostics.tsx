import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { analyticsService } from '../../services/analyticsService';
import { apiService } from '../../services/api';
import { useAuth } from '../../store/auth';

interface TestResult {
  name: string;
  status: 'success' | 'error' | 'warning' | 'loading';
  message: string;
  details?: any;
  timestamp: Date;
}

export default function AdminDashboardDiagnostics() {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const { isAuthenticated, user, token } = useAuth();

  const addTest = (result: Omit<TestResult, 'timestamp'>) => {
    setTests(prev => [...prev, { ...result, timestamp: new Date() }]);
  };

  const clearTests = () => {
    setTests([]);
  };

  const runDiagnostics = async () => {
    setIsRunning(true);
    clearTests();

    // Test 1: Backend Connectivity
    addTest({ name: 'Backend Connectivity', status: 'loading', message: 'Testing backend connection...' });
    try {
      const health = await fetch('http://localhost:5000/health').then(r => r.json());
      addTest({ 
        name: 'Backend Connectivity', 
        status: 'success', 
        message: 'Backend is running and responsive',
        details: health
      });
    } catch (error: any) {
      addTest({ 
        name: 'Backend Connectivity', 
        status: 'error', 
        message: `Backend connection failed: ${error.message}`,
        details: error
      });
    }

    // Test 2: Authentication Status
    addTest({ name: 'Authentication Status', status: 'loading', message: 'Checking auth status...' });
    if (isAuthenticated && user && token) {
      addTest({ 
        name: 'Authentication Status', 
        status: 'success', 
        message: `Authenticated as ${user.email} with role: ${user.role}`,
        details: { user: user.email, role: user.role, hasToken: !!token }
      });
    } else {
      addTest({ 
        name: 'Authentication Status', 
        status: 'warning', 
        message: 'Not authenticated - please login first',
        details: { isAuthenticated, hasUser: !!user, hasToken: !!token }
      });
    }

    // Test 3: Admin API Access
    addTest({ name: 'Admin API Access', status: 'loading', message: 'Testing admin endpoints...' });
    try {
      const stats = await analyticsService.getSystemStats();
      if (stats && stats.data) {
        const requiredFields = ['totalUsers', 'diskUsage', 'cpuUsage', 'memoryUsage'];
        const missingFields = requiredFields.filter(field => !(field in stats.data));
        
        if (missingFields.length === 0) {
          addTest({ 
            name: 'Admin API Access', 
            status: 'success', 
            message: 'All admin endpoints accessible, system stats complete',
            details: {
              totalUsers: stats.data.totalUsers,
              diskUsage: stats.data.diskUsage,
              cpuUsage: stats.data.cpuUsage,
              memoryUsage: stats.data.memoryUsage,
              tokensUsed: stats.data.aiTokensUsed
            }
          });
        } else {
          addTest({ 
            name: 'Admin API Access', 
            status: 'warning', 
            message: `Admin API accessible but missing fields: ${missingFields.join(', ')}`,
            details: { missingFields, receivedData: stats.data }
          });
        }
      } else {
        addTest({ 
          name: 'Admin API Access', 
          status: 'error', 
          message: 'Admin API returned empty response',
          details: stats
        });
      }
    } catch (error: any) {
      addTest({ 
        name: 'Admin API Access', 
        status: 'error', 
        message: `Admin API failed: ${error.response?.data?.error || error.message}`,
        details: { 
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          isAuthError: error.response?.status === 401
        }
      });
    }

    // Test 4: Database Connection
    addTest({ name: 'Database Connection', status: 'loading', message: 'Testing database connectivity...' });
    try {
      await apiService.get('/admin/users?limit=1');
      addTest({ 
        name: 'Database Connection', 
        status: 'success', 
        message: 'Database queries working correctly'
      });
    } catch (error: any) {
      addTest({ 
        name: 'Database Connection', 
        status: 'error', 
        message: `Database connection issues: ${error.response?.data?.error || error.message}`,
        details: error.response?.data
      });
    }

    // Test 5: Real-time Features
    addTest({ name: 'Real-time Features', status: 'loading', message: 'Testing real-time updates...' });
    try {
      const stats1 = await analyticsService.getSystemStats();
      await new Promise(resolve => setTimeout(resolve, 1000));
      const stats2 = await analyticsService.getSystemStats();
      
      // Check if system metrics are updating (CPU/Memory should change slightly)
      const cpuChanged = stats1.data?.cpuUsage !== stats2.data?.cpuUsage;
      const memoryChanged = stats1.data?.memoryUsage !== stats2.data?.memoryUsage;
      
      if (cpuChanged || memoryChanged) {
        addTest({ 
          name: 'Real-time Features', 
          status: 'success', 
          message: 'Real-time system metrics updating correctly',
          details: {
            cpu: { before: stats1.data?.cpuUsage, after: stats2.data?.cpuUsage },
            memory: { before: stats1.data?.memoryUsage, after: stats2.data?.memoryUsage }
          }
        });
      } else {
        addTest({ 
          name: 'Real-time Features', 
          status: 'warning', 
          message: 'System metrics not updating (using static values)',
          details: { cpuUsage: stats1.data?.cpuUsage, memoryUsage: stats1.data?.memoryUsage }
        });
      }
    } catch (error: any) {
      addTest({ 
        name: 'Real-time Features', 
        status: 'error', 
        message: `Real-time test failed: ${error.message}`,
        details: error
      });
    }

    setIsRunning(false);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'loading': return <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />;
    }
  };

  const getStatusBg = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'error': return 'bg-red-50 border-red-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'loading': return 'bg-blue-50 border-blue-200';
    }
  };

  const overallStatus = tests.length > 0 ? (
    tests.every(t => t.status === 'success') ? 'success' :
    tests.some(t => t.status === 'error') ? 'error' : 'warning'
  ) : 'loading';

  return (
    <div className="p-6 bg-admin-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-admin-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Activity className="w-8 h-8 text-primary-600" />
              <div>
                <h1 className="text-2xl font-bold text-admin-900">Admin Dashboard Diagnostics</h1>
                <p className="text-admin-600">System health check and troubleshooting</p>
              </div>
            </div>
            <button
              onClick={runDiagnostics}
              disabled={isRunning}
              className="btn-primary flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
              <span>{isRunning ? 'Running...' : 'Run Tests'}</span>
            </button>
          </div>
        </div>

        {/* Overall Status */}
        {tests.length > 0 && (
          <div className={`rounded-xl border p-4 ${getStatusBg(overallStatus)}`}>
            <div className="flex items-center space-x-2">
              {getStatusIcon(overallStatus)}
              <span className="font-semibold">
                Overall Status: {overallStatus === 'success' ? '✅ All Systems Operational' :
                                overallStatus === 'error' ? '❌ Issues Detected' :
                                '⚠️ Warnings Present'}
              </span>
            </div>
          </div>
        )}

        {/* Test Results */}
        <div className="space-y-4">
          {tests.map((test, index) => (
            <div key={index} className={`rounded-xl border p-4 ${getStatusBg(test.status)}`}>
              <div className="flex items-start space-x-3">
                {getStatusIcon(test.status)}
                <div className="flex-1">
                  <h3 className="font-semibold text-admin-900">{test.name}</h3>
                  <p className="text-sm text-admin-700 mt-1">{test.message}</p>
                  {test.details && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-xs text-admin-600 hover:text-admin-800">
                        View Details
                      </summary>
                      <pre className="mt-2 text-xs bg-admin-100 p-2 rounded text-admin-800 overflow-auto">
                        {JSON.stringify(test.details, null, 2)}
                      </pre>
                    </details>
                  )}
                  <div className="text-xs text-admin-500 mt-1">
                    {test.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-xl shadow-sm border border-admin-200 p-6">
          <h3 className="font-semibold text-admin-900 mb-3">Troubleshooting Guide</h3>
          <div className="space-y-3 text-sm text-admin-700">
            <div>
              <strong>Backend Connectivity Issues:</strong> Make sure the backend is running on port 5000 with <code className="bg-admin-100 px-1 rounded">npm run dev</code>
            </div>
            <div>
              <strong>Authentication Issues:</strong> Use the login page at <code className="bg-admin-100 px-1 rounded">/login</code> with test credentials
            </div>
            <div>
              <strong>Admin API Issues:</strong> Verify JWT token is present and user has admin permissions
            </div>
            <div>
              <strong>Database Issues:</strong> Check MongoDB connection in backend console logs
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}