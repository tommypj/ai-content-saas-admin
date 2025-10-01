import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './store/auth';
import { useUIStore } from './store/ui';

// Components
import Layout from './components/Layout/Layout';
import LoginPage from './pages/LoginPage';
import SimpleLoginPage from './pages/SimpleLoginPage';
import AdminApiTest from './components/debug/AdminApiTest';
import AdminDashboardDiagnostics from './components/debug/AdminDashboardDiagnostics';
import AdminSetupVerification from './components/debug/AdminSetupVerification';

// Pages
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import UserDetailsPage from './pages/UserDetailsPage';
import ContentPage from './pages/ContentPage';
import JobsPage from './pages/Jobs/JobsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import BillingPage from './pages/BillingPage';
import SecurityPage from './pages/SecurityPage';
import SettingsPage from './pages/SettingsPage';

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
}

function ProtectedRoute({ children, requiredPermissions }: ProtectedRouteProps) {
  const { isAuthenticated, user, hydrate } = useAuth();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check permissions if specified
  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasPermission = requiredPermissions.some(permission => 
      user.permissions.includes(permission) || 
      user.permissions.includes('*') || // Check for wildcard permission
      user.role === 'super_admin' ||
      user.role === 'admin' // Admin role has access to everything
    );

    if (!hasPermission) {
      return (
        <Layout>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-admin-900 mb-2">Access Denied</h2>
              <p className="text-admin-600">You don't have permission to access this page.</p>
              <p className="text-xs text-admin-500 mt-2">Required: {requiredPermissions.join(', ')}</p>
              <p className="text-xs text-admin-500">Your permissions: {user.permissions.join(', ')}</p>
            </div>
          </div>
        </Layout>
      );
    }
  }

  return <Layout>{children}</Layout>;
}

// Error Boundary Component
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Admin Panel Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-admin-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-admin-900">Something went wrong</h2>
                <p className="text-sm text-admin-600">The admin panel encountered an error</p>
              </div>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full btn-primary"
              >
                Reload Application
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="w-full btn-secondary"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const { setTheme } = useUIStore();

  useEffect(() => {
    // Initialize theme
    setTheme('light');
  }, [setTheme]);

  return (
    <ErrorBoundary>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<SimpleLoginPage />} />
          
          {/* Debug Routes - Public */}
          <Route path="/debug" element={<AdminApiTest />} />
          <Route path="/diagnostics" element={<AdminDashboardDiagnostics />} />
          <Route path="/setup" element={<AdminSetupVerification />} />
          
          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          
          <Route path="/users" element={
            <ProtectedRoute requiredPermissions={['users:read']}>
              <UsersPage />
            </ProtectedRoute>
          } />
          
          <Route path="/users/:userId" element={
            <ProtectedRoute requiredPermissions={['users:read']}>
              <UserDetailsPage />
            </ProtectedRoute>
          } />
          
          <Route path="/content" element={
            <ProtectedRoute requiredPermissions={['content:read']}>
              <ContentPage />
            </ProtectedRoute>
          } />
          
          <Route path="/jobs" element={
            <ProtectedRoute requiredPermissions={['jobs:read']}>
              <JobsPage />
            </ProtectedRoute>
          } />
          
          <Route path="/analytics" element={
            <ProtectedRoute requiredPermissions={['analytics:read']}>
              <AnalyticsPage />
            </ProtectedRoute>
          } />
          
          <Route path="/billing" element={
            <ProtectedRoute requiredPermissions={['billing:read']}>
              <BillingPage />
            </ProtectedRoute>
          } />
          
          <Route path="/security" element={
            <ProtectedRoute requiredPermissions={['security:read']}>
              <SecurityPage />
            </ProtectedRoute>
          } />
          
          <Route path="/settings" element={
            <ProtectedRoute requiredPermissions={['system:manage']}>
              <SettingsPage />
            </ProtectedRoute>
          } />
          
          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </ErrorBoundary>
  );
}

export default App;