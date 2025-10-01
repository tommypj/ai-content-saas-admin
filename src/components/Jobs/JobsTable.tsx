import React from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, Loader } from 'lucide-react';

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

interface JobsTableProps {
  jobs: Job[];
  selectedJobs: Set<string>;
  onSelectJob: (jobId: string) => void;
  onSelectAll: () => void;
  onViewDetails: (job: Job) => void;
  onRetry: (jobId: string) => void;
  onCancel: (jobId: string) => void;
  onDelete: (jobId: string) => void;
}

export default function JobsTable({
  jobs,
  selectedJobs,
  onSelectJob,
  onSelectAll,
  onViewDetails,
  onRetry,
  onCancel,
  onDelete
}: JobsTableProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
      case 'QUEUED':
        return <Clock className="w-4 h-4 text-gray-500" />;
      case 'RUNNING':
        return <Loader className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'SUCCEEDED':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'FAILED':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
      case 'QUEUED':
        return 'bg-gray-100 text-gray-700';
      case 'RUNNING':
        return 'bg-blue-100 text-blue-700';
      case 'SUCCEEDED':
        return 'bg-green-100 text-green-700';
      case 'FAILED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  const formatDuration = (ms?: number) => {
    if (!ms) return 'N/A';
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedJobs.size === jobs.length && jobs.length > 0}
                  onChange={onSelectAll}
                  className="rounded border-gray-300"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Content</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tokens</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {jobs.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-6 py-12 text-center text-gray-500">
                  No jobs found
                </td>
              </tr>
            ) : (
              jobs.map((job) => (
                <tr key={job._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedJobs.has(job._id)}
                      onChange={() => onSelectJob(job._id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-900">
                    {job._id.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">
                      {job.type.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                      {getStatusIcon(job.status)}
                      <span>{job.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{job.userId?.username || 'Unknown'}</div>
                    <div className="text-xs text-gray-500">{job.userId?.email || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {job.contentGroupId?.title || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-500 max-w-xs truncate">
                      {job.contentGroupId?.topic || ''}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatDuration(job.processingTime)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {job.tokensUsed?.toLocaleString() || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatDate(job.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onViewDetails(job)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View
                      </button>
                      {job.status === 'FAILED' && (
                        <button
                          onClick={() => onRetry(job._id)}
                          className="text-green-600 hover:text-green-800 text-sm font-medium"
                        >
                          Retry
                        </button>
                      )}
                      {(job.status === 'PENDING' || job.status === 'QUEUED' || job.status === 'RUNNING') && (
                        <button
                          onClick={() => onCancel(job._id)}
                          className="text-yellow-600 hover:text-yellow-800 text-sm font-medium"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        onClick={() => onDelete(job._id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
