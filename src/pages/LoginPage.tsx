import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Eye, EyeOff, Shield } from 'lucide-react';
import { useAuth } from '../store/auth';
import { useUIStore } from '../store/ui';

export default function LoginPage() {
  const { login, isAuthenticated, isLoading, error, clearError } = useAuth();
  const { addNotification } = useUIStore();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    twoFactorToken: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);

  // Handle redirect after successful login using React Router Navigate
  useEffect(() => {
    if (isAuthenticated) {
      // Let React Router handle the redirect through the Navigate component below
      console.log('User is authenticated, will redirect to dashboard');
    }
  }, [isAuthenticated]);

  // If authenticated, render Navigate component instead of the login form
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log('🛡️ Form submission intercepted');
    
    // Absolutely prevent default behavior
    e.preventDefault();
    e.stopPropagation();
    
    // Double-check that we're preventing submission
    if (e.defaultPrevented) {
      console.log('✅ Default prevented successfully');
    } else {
      console.warn('⚠️ Default NOT prevented - this is the problem!');
      return false;
    }
    
    clearError();

    console.log('🔐 Login attempt starting...', { email: formData.email, hasPassword: !!formData.password });

    try {
      console.log('🔐 About to call login...');
      await login(formData);
      
      console.log('✅ Login completed successfully');
      addNotification({
        type: 'success',
        title: 'Login Successful',
        message: 'Welcome to the admin dashboard!'
      });
    } catch (error: any) {
      console.error('❌ Login failed with error:', error);
      console.error('❌ Error stack:', error.stack);
      console.error('❌ Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        name: error.name,
        cause: error.cause
      });
      
      // Prevent any automatic redirects or reloads
      if (error.response?.data?.requires2FA) {
        setRequires2FA(true);
        addNotification({
          type: 'info',
          title: '2FA Required',
          message: 'Please enter your two-factor authentication code.'
        });
      } else {
        const errorMessage = error.response?.data?.error || 
                           error.response?.data?.message || 
                           error.message || 
                           'Invalid credentials';
        
        console.log('📢 Setting error message:', errorMessage);
        
        addNotification({
          type: 'error',
          title: 'Login Failed',
          message: errorMessage
        });
        
        // Ensure error persists in state
        setTimeout(() => {
          console.log('📢 Error should still be visible:', errorMessage);
        }, 100);
      }
    }
    
    // Explicitly return false to prevent any form submission
    return false;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    // Clear any existing errors when component mounts
    clearError();
    
    // Add global error handler to catch any unhandled errors
    const handleError = (error: ErrorEvent) => {
      console.error('🔥 Global error caught:', error.error);
      console.error('🔥 Error details:', {
        message: error.message,
        filename: error.filename,
        lineno: error.lineno,
        colno: error.colno,
        stack: error.error?.stack
      });
    };
    
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('🔥 Unhandled promise rejection:', event.reason);
    };
    
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [clearError]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-admin-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary-600 rounded-xl flex items-center justify-center">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-admin-900">
            Admin Dashboard
          </h2>
          <p className="mt-2 text-sm text-admin-600">
            Sign in to access A-Stats administration
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form 
            className="space-y-6" 
            onSubmit={handleSubmit}
            action="#"
            method="post"
          >
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-admin-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 input"
                placeholder="admin@a-stats.online"
                disabled={isLoading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-admin-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input pr-10"
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-admin-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-admin-400" />
                  )}
                </button>
              </div>
            </div>

            {/* 2FA Field (if required) */}
            {requires2FA && (
              <div>
                <label htmlFor="twoFactorToken" className="block text-sm font-medium text-admin-700">
                  Two-Factor Authentication Code
                </label>
                <input
                  id="twoFactorToken"
                  name="twoFactorToken"
                  type="text"
                  autoComplete="one-time-code"
                  required={requires2FA}
                  value={formData.twoFactorToken}
                  onChange={handleInputChange}
                  className="mt-1 input"
                  placeholder="000000"
                  maxLength={6}
                  disabled={isLoading}
                />
                <p className="mt-1 text-xs text-admin-500">
                  Enter the 6-digit code from your authenticator app
                </p>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Development Notice */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 mb-3">
                <strong>Development Access:</strong><br />
                Use any existing user credentials from the main app<br />
                Or create a new user account first
              </p>
              
              {/* Debug Button */}
              <button
                type="button"
                onClick={async () => {
                  console.log('🔍 Starting auth state debug...');
                  const start = Date.now();
                  
                  console.log('📊 Auth state before hydrate:', {
                    isAuthenticated,
                    isLoading,
                    error,
                    hasUser: !!localStorage.getItem('adminUser'),
                    hasToken: !!localStorage.getItem('adminToken')
                  });
                  
                  // Test API connectivity
                  console.log('🌐 Testing API connectivity...');
                  try {
                    const healthResponse = await fetch('http://localhost:5000/health');
                    const healthData = await healthResponse.json();
                    console.log('✅ Health check result:', healthData);
                  } catch (err) {
                    console.error('❌ Health check failed:', err);
                  }
                  
                  const end = Date.now();
                  console.log(`⏱️ Debug completed in ${end - start}ms`);
                  
                  alert(`Check console for detailed auth state. Took ${end - start}ms`);
                }}
                className="mt-2 text-xs bg-yellow-600 hover:bg-yellow-700 text-white px-2 py-1 rounded"
              >
                Debug Auth State
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-admin-500">
            © 2024 A-Stats Content Studio. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}