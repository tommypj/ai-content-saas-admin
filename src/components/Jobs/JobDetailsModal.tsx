import React from 'react';
import { XCircle, PlayCircle, StopCircle, Trash2 } from 'lucide-react';

interface Job {
  _id: string;
  type: string;
  status: 'PENDING' | 'QUEUED' | 'RUNNING' | 'SUCCEEDED' | 'FAILED';
  priority: number;
  attempts: number;
  maxAttempts: number;
  userId: {
    _id: string;
    email: string;
    username: string;
  };
  contentGroupId?: {
    _id: string;
    title: string;
    topic: string;
  };
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  processingTime?: number;
  tokensUsed?: number;
  error?: string;
  metadata?: any;
}

interface JobDetailsModalProps {
  job: Job;
  onClose: () => void;
  onRetry: () => void;
  onCancel: () => void;
  onDelete: () => void;
}

export default function JobDetailsModal({ 
  job, 
  onClose, 
  onRetry, 
  onCancel, 
  onDelete 
}: JobDetailsModalProps) {
  const formatDuration = (ms?: number) => {
    if (!ms) return 'N/A';
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
    return `${(ms / 60000).toFixed(2)}m`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Job Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Job ID</h3>
              <p className="text-sm font-mono text-gray-900">{job._id}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Type</h3>
              <p className="text-sm text-gray-900">{job.type.replace(/_/g, ' ')}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
              <span className="text-sm font-medium">{job.status}</span>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Priority</h3>
              <p className="text-sm text-gray-900">{job.priority}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Attempts</h3>
              <p className="text-sm text-gray-900">{job.attempts} / {job.maxAttempts}</p>
            </div>
          </div>

          {/* User Info */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">User</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-900">{job.userId?.username || 'Unknown'}</p>
              <p className="text-xs text-gray-500">{job.userId?.email || 'N/A'}</p>
            </div>
          </div>

          {/* Content Group Info */}
          {job.contentGroupId && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Content Group</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-900">{job.contentGroupId.title}</p>
                <p className="text-xs text-gray-500">{job.contentGroupId.topic}</p>
              </div>
            </div>
          )}

          {/* Timing Info */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Created</h3>
              <p className="text-sm text-gray-900">{new Date(job.createdAt).toLocaleString()}</p>
            </div>
            {job.startedAt && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Started</h3>
                <p className="text-sm text-gray-900">{new Date(job.startedAt).toLocaleString()}</p>
              </div>
            )}
            {job.completedAt && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Completed</h3>
                <p className="text-sm text-gray-900">{new Date(job.completedAt).toLocaleString()}</p>
              </div>
            )}
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Processing Time</h3>
              <p className="text-sm text-gray-900">{formatDuration(job.processingTime)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Tokens Used</h3>
              <p className="text-sm text-gray-900">{job.tokensUsed?.toLocaleString() || 'N/A'}</p>
            </div>
          </div>

          {/* Error Message */}
          {job.error && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Error</h3>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-900 font-mono whitespace-pre-wrap">{job.error}</p>
              </div>
            </div>
          )}

          {/* Metadata */}
          {job.metadata && Object.keys(job.metadata).length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Metadata</h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <pre className="text-xs text-gray-900 font-mono whitespace-pre-wrap overflow-x-auto">
                  {JSON.stringify(job.metadata, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700"
          >
            Close
          </button>
          
          {job.status === 'FAILED' && (
            <button
              onClick={onRetry}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Retry Job</span>
            </button>
          )}
          
          {(job.status === 'PENDING' || job.status === 'QUEUED' || job.status === 'RUNNING') && (
            <button
              onClick={onCancel}
              className="flex items-center space-x-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
            >
              <StopCircle className="w-4 h-4" />
              <span>Cancel Job</span>
            </button>
          )}
          
          <button
            onClick={onDelete}
            className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Job</span>
          </button>
        </div>
      </div>
    </div>
  );
}
