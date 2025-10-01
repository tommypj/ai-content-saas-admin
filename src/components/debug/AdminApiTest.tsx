import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analyticsService';
import { apiService } from '../../services/api';

export default function AdminApiTest() {
  const [testResults, setTestResults] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    const results: any = {};

    try {
      // Test 1: Basic API connectivity
      results.connectivity = await fetch('http://localhost:5000/health')
        .then(res => res.json())
        .then(data => ({ success: true, data }))
        .catch(err => ({ success: false, error: err.message }));

      // Test 2: Admin stats endpoint
      results.adminStats = await analyticsService.getSystemStats()
        .then(data => ({ success: true, data }))
        .catch(err => ({ success: false, error: err.response?.data || err.message }));

      // Test 3: Direct API call test
      results.directApi = await apiService.get('/admin/analytics/overview')
        .then(data => ({ success: true, data }))
        .catch(err => ({ success: false, error: err.response?.data || err.message }));

      // Test 4: Auth check
      results.authCheck = {
        success: true,
        data: {
          hasAdminToken: !!localStorage.getItem('adminToken'),
          hasAdminUser: !!localStorage.getItem('adminUser'),
          tokenPreview: localStorage.getItem('adminToken')?.substring(0, 20) + '...' || 'None'
        }
      };

    } catch (error) {
      results.error = error;
    }

    setTestResults(results);
    setLoading(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  return (
    <div className="p-6 bg-admin-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-admin-900 mb-6">Admin API Connectivity Test</h1>
        
        <div className="mb-4">
          <button
            onClick={runTests}
            disabled={loading}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Run Tests'}
          </button>
        </div>

        <div className="space-y-6">
          {Object.entries(testResults).map(([key, result]: [string, any]) => (
            <div key={key} className="bg-white p-4 rounded-lg border border-admin-200">
              <h3 className="text-lg font-semibold text-admin-900 mb-2 capitalize">{key} Test</h3>
              <div className={`p-3 rounded-lg ${
                result?.success 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              } border`}>
                <div className={`font-medium ${
                  result?.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {result?.success ? '✅ Success' : '❌ Failed'}
                </div>
                <pre className="mt-2 text-sm text-admin-600 overflow-auto whitespace-pre-wrap">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-900 mb-2">Environment Info</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <div>Base URL: {import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'}</div>
            <div>Admin Token: {localStorage.getItem('adminToken') ? 'Present' : 'Missing'}</div>
            <div>Admin User: {localStorage.getItem('adminUser') ? 'Present' : 'Missing'}</div>
            <div>Environment: {import.meta.env.VITE_ENVIRONMENT || 'development'}</div>
          </div>
        </div>

        <div className="mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="font-medium text-yellow-900 mb-2">Quick Actions</h3>
          <div className="space-y-2">
            <button
              onClick={() => {
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminUser');
                window.location.reload();
              }}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
            >
              Clear Admin Session
            </button>
            <div className="text-xs text-yellow-700 mt-1">
              Use this if you're having authentication issues
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}