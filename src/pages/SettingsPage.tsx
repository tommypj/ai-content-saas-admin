import React, { useState, useEffect } from 'react';
import { 
  EnvelopeClosedIcon, 
  CheckCircledIcon, 
  CrossCircledIcon,
  ReloadIcon,
  EyeOpenIcon,
  EyeNoneIcon,
  RocketIcon,
  GearIcon
} from '@radix-ui/react-icons';
import { adminAPI } from '../services/adminAPI';

interface EmailSettings {
  provider: 'resend' | 'sendgrid' | 'ses' | 'none';
  resend: {
    apiKey: string;
    fromEmail: string;
    fromName: string;
    replyToEmail: string;
  };
  enabled: boolean;
  lastTested?: string;
  testStatus: 'success' | 'failed' | 'pending' | 'not_tested';
}

interface SystemSettings {
  emailService: EmailSettings;
  aiService: {
    provider: string;
    model: string;
    timeout: number;
    maxAttempts: number;
  };
  rateLimiting: {
    enabled: boolean;
    requestsPerHour: number;
    requestsPerDay: number;
  };
  features: {
    contentGroups: boolean;
    templates: boolean;
    scheduling: boolean;
    analytics: boolean;
  };
  maintenance: {
    enabled: boolean;
    message: string;
    scheduledStart?: string;
    scheduledEnd?: string;
  };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'email' | 'ai' | 'features' | 'maintenance'>('email');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getSettings();
      setSettings(response.data);
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Failed to load settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!settings) return;

    try {
      setSaving(true);
      setMessage(null);
      
      await adminAPI.updateSettings(settings);
      
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
      await fetchSettings(); // Refresh to get masked API key
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to save settings' 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleTestEmail = async () => {
    if (!testEmail) {
      setMessage({ type: 'error', text: 'Please enter an email address' });
      return;
    }

    try {
      setTesting(true);
      setMessage(null);
      
      const response = await adminAPI.testEmail(testEmail);
      
      setMessage({ type: 'success', text: response.message });
      await fetchSettings(); // Refresh to get updated test status
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to send test email' 
      });
    } finally {
      setTesting(false);
    }
  };

  const updateEmailSettings = (field: string, value: any) => {
    if (!settings) return;
    
    setSettings({
      ...settings,
      emailService: {
        ...settings.emailService,
        resend: {
          ...settings.emailService.resend,
          [field]: value
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <ReloadIcon className="w-8 h-8 animate-spin text-admin-600 mx-auto mb-4" />
          <p className="text-admin-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <CrossCircledIcon className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-admin-900 font-semibold mb-2">Failed to load settings</p>
          <button onClick={fetchSettings} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-admin-900">System Settings</h1>
          <p className="text-admin-600 mt-1">Configure system-wide settings and integrations</p>
        </div>
        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className="btn-primary flex items-center gap-2"
        >
          {saving ? (
            <>
              <ReloadIcon className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <CheckCircledIcon className="w-4 h-4" />
              Save Settings
            </>
          )}
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg flex items-start gap-3 ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircledIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          ) : (
            <CrossCircledIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <p className={`text-sm font-medium ${
              message.type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {message.text}
            </p>
          </div>
          <button
            onClick={() => setMessage(null)}
            className="text-admin-400 hover:text-admin-600"
          >
            <CrossCircledIcon className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-admin-200">
        <nav className="flex gap-6">
          {[
            { key: 'email' as const, label: 'Email Service', icon: EnvelopeClosedIcon },
            { key: 'ai' as const, label: 'AI Configuration', icon: RocketIcon },
            { key: 'features' as const, label: 'Features', icon: GearIcon },
            { key: 'maintenance' as const, label: 'Maintenance', icon: GearIcon }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-admin-600 text-admin-900 font-medium'
                  : 'border-transparent text-admin-600 hover:text-admin-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Email Service Settings */}
      {activeTab === 'email' && (
        <div className="card space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-admin-200">
            <div>
              <h2 className="text-xl font-bold text-admin-900">Email Service Configuration</h2>
              <p className="text-sm text-admin-600 mt-1">Configure Resend for sending transactional emails</p>
            </div>
            <div className="flex items-center gap-2">
              {settings.emailService.testStatus === 'success' && (
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <CheckCircledIcon className="w-4 h-4" />
                  Tested successfully
                </div>
              )}
              {settings.emailService.testStatus === 'failed' && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <CrossCircledIcon className="w-4 h-4" />
                  Test failed
                </div>
              )}
            </div>
          </div>

          {/* Resend API Key */}
          <div>
            <label className="block text-sm font-medium text-admin-900 mb-2">
              Resend API Key *
            </label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={settings.emailService.resend.apiKey}
                onChange={(e) => updateEmailSettings('apiKey', e.target.value)}
                placeholder="re_your_api_key_here"
                className="input pr-10"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-admin-400 hover:text-admin-600"
              >
                {showApiKey ? <EyeNoneIcon className="w-5 h-5" /> : <EyeOpenIcon className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-admin-600 mt-1">
              Get your API key from <a href="https://resend.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-admin-600 hover:text-admin-900 underline">Resend Dashboard</a>
            </p>
          </div>

          {/* From Email */}
          <div>
            <label className="block text-sm font-medium text-admin-900 mb-2">
              From Email *
            </label>
            <input
              type="email"
              value={settings.emailService.resend.fromEmail}
              onChange={(e) => updateEmailSettings('fromEmail', e.target.value)}
              placeholder="noreply@a-stats.online"
              className="input"
            />
            <p className="text-xs text-admin-600 mt-1">
              Email address that appears in the "From" field
            </p>
          </div>

          {/* From Name */}
          <div>
            <label className="block text-sm font-medium text-admin-900 mb-2">
              From Name
            </label>
            <input
              type="text"
              value={settings.emailService.resend.fromName}
              onChange={(e) => updateEmailSettings('fromName', e.target.value)}
              placeholder="A-Stats Content Studio"
              className="input"
            />
          </div>

          {/* Reply To Email */}
          <div>
            <label className="block text-sm font-medium text-admin-900 mb-2">
              Reply-To Email
            </label>
            <input
              type="email"
              value={settings.emailService.resend.replyToEmail}
              onChange={(e) => updateEmailSettings('replyToEmail', e.target.value)}
              placeholder="support@a-stats.online"
              className="input"
            />
          </div>

          {/* Enable Email Service */}
          <div className="flex items-center gap-3 p-4 bg-admin-50 rounded-lg">
            <input
              type="checkbox"
              id="enableEmail"
              checked={settings.emailService.enabled}
              onChange={(e) => setSettings({
                ...settings,
                emailService: {
                  ...settings.emailService,
                  enabled: e.target.checked
                }
              })}
              className="w-4 h-4 rounded border-admin-300 text-admin-600 focus:ring-admin-500"
            />
            <label htmlFor="enableEmail" className="text-sm text-admin-900 font-medium cursor-pointer">
              Enable email service
            </label>
          </div>

          {/* Test Email */}
          <div className="border-t border-admin-200 pt-6">
            <h3 className="text-lg font-semibold text-admin-900 mb-4">Test Email Configuration</h3>
            <div className="flex gap-3">
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="your-email@example.com"
                className="input flex-1"
              />
              <button
                onClick={handleTestEmail}
                disabled={testing || !settings.emailService.resend.apiKey}
                className="btn-primary flex items-center gap-2"
              >
                {testing ? (
                  <>
                    <ReloadIcon className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <EnvelopeClosedIcon className="w-4 h-4" />
                    Send Test Email
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-admin-600 mt-2">
              Send a test email to verify your configuration is working correctly
            </p>
          </div>

          {/* Setup Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">📚 Setup Instructions</h4>
            <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
              <li>Sign up for Resend at <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="underline">resend.com</a></li>
              <li>Go to API Keys and create a new key</li>
              <li>Paste the API key above</li>
              <li>Configure your email addresses</li>
              <li>Click "Send Test Email" to verify</li>
              <li>Enable the service and save settings</li>
            </ol>
          </div>
        </div>
      )}

      {/* AI Configuration Tab */}
      {activeTab === 'ai' && (
        <div className="card space-y-6">
          <div className="pb-4 border-b border-admin-200">
            <h2 className="text-xl font-bold text-admin-900">AI Configuration</h2>
            <p className="text-sm text-admin-600 mt-1">Configure AI model and processing settings</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-admin-900 mb-2">AI Model</label>
            <input
              type="text"
              value={settings.aiService.model}
              onChange={(e) => setSettings({
                ...settings,
                aiService: { ...settings.aiService, model: e.target.value }
              })}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-admin-900 mb-2">
              Timeout (milliseconds)
            </label>
            <input
              type="number"
              value={settings.aiService.timeout}
              onChange={(e) => setSettings({
                ...settings,
                aiService: { ...settings.aiService, timeout: parseInt(e.target.value) }
              })}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-admin-900 mb-2">
              Max Attempts
            </label>
            <input
              type="number"
              value={settings.aiService.maxAttempts}
              onChange={(e) => setSettings({
                ...settings,
                aiService: { ...settings.aiService, maxAttempts: parseInt(e.target.value) }
              })}
              className="input"
            />
          </div>
        </div>
      )}

      {/* Features Tab */}
      {activeTab === 'features' && (
        <div className="card space-y-6">
          <div className="pb-4 border-b border-admin-200">
            <h2 className="text-xl font-bold text-admin-900">Feature Flags</h2>
            <p className="text-sm text-admin-600 mt-1">Enable or disable platform features</p>
          </div>

          {Object.entries(settings.features).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-4 bg-admin-50 rounded-lg">
              <div>
                <label htmlFor={key} className="text-sm font-medium text-admin-900 capitalize cursor-pointer">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
              </div>
              <input
                type="checkbox"
                id={key}
                checked={value}
                onChange={(e) => setSettings({
                  ...settings,
                  features: { ...settings.features, [key]: e.target.checked }
                })}
                className="w-4 h-4 rounded border-admin-300 text-admin-600 focus:ring-admin-500"
              />
            </div>
          ))}
        </div>
      )}

      {/* Maintenance Tab */}
      {activeTab === 'maintenance' && (
        <div className="card space-y-6">
          <div className="pb-4 border-b border-admin-200">
            <h2 className="text-xl font-bold text-admin-900">Maintenance Mode</h2>
            <p className="text-sm text-admin-600 mt-1">Configure system maintenance settings</p>
          </div>

          <div className="flex items-center gap-3 p-4 bg-admin-50 rounded-lg">
            <input
              type="checkbox"
              id="maintenanceEnabled"
              checked={settings.maintenance.enabled}
              onChange={(e) => setSettings({
                ...settings,
                maintenance: { ...settings.maintenance, enabled: e.target.checked }
              })}
              className="w-4 h-4 rounded border-admin-300 text-admin-600 focus:ring-admin-500"
            />
            <label htmlFor="maintenanceEnabled" className="text-sm text-admin-900 font-medium cursor-pointer">
              Enable maintenance mode
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-admin-900 mb-2">
              Maintenance Message
            </label>
            <textarea
              value={settings.maintenance.message}
              onChange={(e) => setSettings({
                ...settings,
                maintenance: { ...settings.maintenance, message: e.target.value }
              })}
              rows={3}
              className="input"
              placeholder="System maintenance in progress..."
            />
          </div>
        </div>
      )}
    </div>
  );
}