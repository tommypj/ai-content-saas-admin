import React, { useState } from 'react';
import { Cross2Icon, ExclamationTriangleIcon, ReloadIcon } from '@radix-ui/react-icons';
import { adminAPI } from '../../services/adminAPI';

interface Props {
  user: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SuspendUserModal({ user, onClose, onSuccess }: Props) {
  const [reason, setReason] = useState('');
  const [suspending, setSuspending] = useState(false);
  const [error, setError] = useState('');

  const handleSuspend = async () => {
    if (!reason.trim()) {
      setError('Please provide a reason for suspension');
      return;
    }

    setSuspending(true);
    setError('');

    try {
      await adminAPI.suspendUser(user._id, reason);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to suspend user');
    } finally {
      setSuspending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="px-6 py-4 border-b border-admin-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-admin-900">Suspend User</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-admin-100 rounded-lg">
            <Cross2Icon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div>
            <p className="text-admin-900 mb-2">
              You are about to suspend <strong>{user.email}</strong>
            </p>
            <p className="text-sm text-admin-600">
              This user will no longer be able to log in or access their account until reactivated.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-admin-900 mb-2">
              Reason for Suspension *
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter the reason for suspending this user..."
              rows={4}
              className="input"
              required
            />
            <p className="text-xs text-admin-600 mt-1">
              This reason will be logged for audit purposes
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-admin-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="btn-secondary"
            disabled={suspending}
          >
            Cancel
          </button>
          <button
            onClick={handleSuspend}
            className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            disabled={suspending}
          >
            {suspending ? (
              <>
                <ReloadIcon className="w-4 h-4 animate-spin" />
                Suspending...
              </>
            ) : (
              <>
                <ExclamationTriangleIcon className="w-4 h-4" />
                Suspend User
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}