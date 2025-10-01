import React, { useState, useEffect } from 'react';
import { Cross2Icon, ReloadIcon, PersonIcon } from '@radix-ui/react-icons';
import { adminAPI } from '../../services/adminAPI';

interface Props {
  user: any;
  onClose: () => void;
  onEdit: () => void;
}

export default function UserDetailsModal({ user, onClose, onEdit }: Props) {
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUserDetails(user._id);
      setDetails(response.data);
    } catch (error) {
      console.error('Failed to load user details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-admin-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-admin-100 flex items-center justify-center">
              <PersonIcon className="w-6 h-6 text-admin-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-admin-900">{user.username}</h2>
              <p className="text-sm text-admin-600">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onEdit} className="btn-primary">
              Edit User
            </button>
            <button onClick={onClose} className="p-2 hover:bg-admin-100 rounded-lg">
              <Cross2Icon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <ReloadIcon className="w-8 h-8 animate-spin text-admin-600" />
          </div>
        ) : details ? (
          <div className="p-6 space-y-6">
            {/* Account Info */}
            <div>
              <h3 className="text-lg font-semibold text-admin-900 mb-4">Account Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-admin-600">Username</label>
                  <p className="text-admin-900 font-medium">{details.user.username}</p>
                </div>
                <div>
                  <label className="text-sm text-admin-600">Email</label>
                  <p className="text-admin-900 font-medium">{details.user.email}</p>
                </div>
                <div>
                  <label className="text-sm text-admin-600">Plan</label>
                  <p className="text-admin-900 font-medium capitalize">{details.user.subscription.plan}</p>
                </div>
                <div>
                  <label className="text-sm text-admin-600">Status</label>
                  <p className="text-admin-900 font-medium">
                    {details.user.isActive ? 'Active' : 'Suspended'}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-admin-600">Member Since</label>
                  <p className="text-admin-900 font-medium">
                    {new Date(details.user.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-admin-600">Last Active</label>
                  <p className="text-admin-900 font-medium">
                    {new Date(details.user.usageStats.lastActiveAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Usage Statistics */}
            <div>
              <h3 className="text-lg font-semibold text-admin-900 mb-4">Usage Statistics</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-admin-50 rounded-lg p-4">
                  <p className="text-sm text-admin-600 mb-1">Content Groups</p>
                  <p className="text-2xl font-bold text-admin-900">{details.stats.contentGroups}</p>
                </div>
                <div className="bg-admin-50 rounded-lg p-4">
                  <p className="text-sm text-admin-600 mb-1">Jobs Completed</p>
                  <p className="text-2xl font-bold text-admin-900">{details.stats.jobs.succeeded}</p>
                </div>
                <div className="bg-admin-50 rounded-lg p-4">
                  <p className="text-sm text-admin-600 mb-1">Total Tokens</p>
                  <p className="text-2xl font-bold text-admin-900">
                    {(details.stats.jobs.totalTokens / 1000).toFixed(1)}K
                  </p>
                </div>
              </div>
            </div>

            {/* Usage Limits */}
            <div>
              <h3 className="text-lg font-semibold text-admin-900 mb-4">Usage Limits</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-admin-600">Monthly Jobs</span>
                    <span className="text-admin-900 font-medium">
                      {details.user.usageStats.currentMonthUsage.jobsCompleted} /{' '}
                      {details.user.usageStats.planLimits.monthlyJobs}
                    </span>
                  </div>
                  <div className="w-full bg-admin-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min(100, (details.user.usageStats.currentMonthUsage.jobsCompleted / details.user.usageStats.planLimits.monthlyJobs) * 100)}%`
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-admin-600">Monthly Tokens</span>
                    <span className="text-admin-900 font-medium">
                      {(details.user.usageStats.currentMonthUsage.tokensUsed / 1000).toFixed(1)}K /{' '}
                      {(details.user.usageStats.planLimits.monthlyTokens / 1000).toFixed(1)}K
                    </span>
                  </div>
                  <div className="w-full bg-admin-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min(100, (details.user.usageStats.currentMonthUsage.tokensUsed / details.user.usageStats.planLimits.monthlyTokens) * 100)}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-admin-600">
            Failed to load user details
          </div>
        )}
      </div>
    </div>
  );
}