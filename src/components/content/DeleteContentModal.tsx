import React, { useState } from 'react';
import { Cross2Icon, TrashIcon, ReloadIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { adminAPI } from '../../services/adminAPI';

interface Props {
  content: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteContentModal({ content, onClose, onSuccess }: Props) {
  const [confirmText, setConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') {
      setError('Please type DELETE to confirm');
      return;
    }

    setDeleting(true);
    setError('');

    try {
      await adminAPI.deleteContent(content._id, true);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete content');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="px-6 py-4 border-b border-admin-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <TrashIcon className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-admin-900">Delete Content</h2>
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

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-900 mb-1">Warning: This action cannot be undone!</p>
              <p className="text-sm text-red-800">
                This will permanently delete the content and all associated data.
              </p>
            </div>
          </div>

          <div>
            <p className="text-admin-900 mb-4">
              You are about to permanently delete:
            </p>
            <div className="bg-admin-50 rounded-lg p-4 space-y-2">
              <div>
                <label className="text-xs text-admin-600">Title</label>
                <p className="font-medium text-admin-900">{content.title}</p>
              </div>
              <div>
                <label className="text-xs text-admin-600">Topic</label>
                <p className="font-medium text-admin-900">{content.topic}</p>
              </div>
              <div>
                <label className="text-xs text-admin-600">Created By</label>
                <p className="font-medium text-admin-900">{content.userId.username}</p>
              </div>
              <div>
                <label className="text-xs text-admin-600">Word Count</label>
                <p className="font-medium text-admin-900">{content.summary.articleWordCount || 0} words</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-admin-900 mb-2">
              Type <strong>DELETE</strong> to confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              className="input"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-admin-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="btn-secondary"
            disabled={deleting}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            disabled={deleting || confirmText !== 'DELETE'}
          >
            {deleting ? (
              <>
                <ReloadIcon className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <TrashIcon className="w-4 h-4" />
                Delete Content
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}