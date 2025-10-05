import React, { useState } from 'react';
import { Cross2Icon, CheckIcon, ReloadIcon } from '@radix-ui/react-icons';
import { adminAPI } from '../../services/adminAPI';

interface Props {
  user: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditUserModal({ user, onClose, onSuccess }: Props) {
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    subscription: {
      plan: user.subscription.plan,
      status: user.subscription.status
    },
    isActive: user.isActive
  });
  const [limits, setLimits] = useState({
    monthlyJobs: user.usageStats?.planLimits?.monthlyJobs || 50,
    monthlyTokens: user.usageStats?.planLimits?.monthlyTokens || 100000,
    dailyJobs: user.usageStats?.planLimits?.dailyJobs || 10,
    maxRequestsPerHour: user.usageStats?.planLimits?.maxRequestsPerHour || 30
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      // Update user info
      await adminAPI.updateUser(user._id, formData);
      
      // Update limits
      await adminAPI.updateUserLimits(user._id, limits);
      
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-admin-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-admin-900">Edit User</h2>
            <button type="button" onClick={onClose} className="p-2 hover:bg-admin-100 rounded-lg">
              <Cross2Icon className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Account Info */}
            <div>
              <h3 className="text-lg font-semibold text-admin-900 mb-4">Account Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-admin-900 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-admin-900 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Subscription */}
            <div>
              <h3 className="text-lg font-semibold text-admin-900 mb-4">Subscription</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-admin-900 mb-2">
                    Plan
                  </label>
                  <select
                    value={formData.subscription.plan}
                    onChange={(e) => setFormData({
                      ...formData,
                      subscription: { ...formData.subscription, plan: e.target.value as any }
                    })}
                    className="input"
                  >
                    <option value="free">Free (50 jobs, 100K tokens)</option>
                    <option value="pro">Pro (500 jobs, 1M tokens)</option>
                    <option value="enterprise">Enterprise (Unlimited)</option>
                    <option value="dev">Dev (Unlimited - For Development)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-admin-900 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.subscription.status}
                    onChange={(e) => setFormData({
                      ...formData,
                      subscription: { ...formData.subscription, status: e.target.value }
                    })}
                    className="input"
                  >
                    <option value="active">Active</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="expired">Expired</option>
                    <option value="trial">Trial</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Usage Limits */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-admin-900">Usage Limits</h3>
                <button
                  type="button"
                  onClick={async () => {
                    if (!confirm('Reset this user\'s monthly usage to zero?')) return;
                    try {
                      await adminAPI.resetUserUsage(user._id);
                      setError('');
                      alert('Usage reset successfully!');
                    } catch (err: any) {
                      setError('Failed to reset usage');
                    }
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Reset Monthly Usage
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-admin-900 mb-2">
                    Monthly Jobs
                  </label>
                  <input
                    type="number"
                    value={limits.monthlyJobs}
                    onChange={(e) => setLimits({ ...limits, monthlyJobs: parseInt(e.target.value) })}
                    className="input"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-admin-900 mb-2">
                    Monthly Tokens
                  </label>
                  <input
                    type="number"
                    value={limits.monthlyTokens}
                    onChange={(e) => setLimits({ ...limits, monthlyTokens: parseInt(e.target.value) })}
                    className="input"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-admin-900 mb-2">
                    Daily Jobs
                  </label>
                  <input
                    type="number"
                    value={limits.dailyJobs}
                    onChange={(e) => setLimits({ ...limits, dailyJobs: parseInt(e.target.value) })}
                    className="input"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-admin-900 mb-2">
                    Max Requests/Hour
                  </label>
                  <input
                    type="number"
                    value={limits.maxRequestsPerHour}
                    onChange={(e) => setLimits({ ...limits, maxRequestsPerHour: parseInt(e.target.value) })}
                    className="input"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Account Status */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-admin-300"
                />
                <span className="text-sm font-medium text-admin-900">
                  Account is active
                </span>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-admin-200 px-6 py-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center gap-2"
              disabled={saving}
            >
              {saving ? (
                <>
                  <ReloadIcon className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckIcon className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}