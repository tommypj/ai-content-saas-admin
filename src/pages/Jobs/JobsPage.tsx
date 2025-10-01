import React, { useState, useEffect } from 'react';
import { RefreshCw, Loader } from 'lucide-react';
import { adminAPI } from '../../services/adminAPI';
import JobStatsCards from '../../components/Jobs/JobStatsCards';
import JobFilters from '../../components/Jobs/JobFilters';
import JobBulkActions from '../../components/Jobs/JobBulkActions';
import JobsTable from '../../components/Jobs/JobsTable';
import JobDetailsModal from '../../components/Jobs/JobDetailsModal';

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

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedJobs, setSelectedJobs] = useState<Set<string>>(new Set());
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  const [filters, setFilters] = useState({
    search: '',
    status: '',
    type: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    running: 0,
    succeeded: 0,
    failed: 0,
    avgProcessingTime: 0,
    totalTokens: 0
  });

  useEffect(() => {
    fetchJobs();
    fetchJobStats();
  }, [pagination.page, pagination.limit, filters]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getJobs({
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      });

      setJobs(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchJobStats = async () => {
    try {
      const response = await adminAPI.getJobStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to fetch job stats:', error);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchJobs();
    fetchJobStats();
  };

  const handleSelectJob = (jobId: string) => {
    const newSelected = new Set(selectedJobs);
    if (newSelected.has(jobId)) {
      newSelected.delete(jobId);
    } else {
      newSelected.add(jobId);
    }
    setSelectedJobs(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedJobs.size === jobs.length) {
      setSelectedJobs(new Set());
    } else {
      setSelectedJobs(new Set(jobs.map(j => j._id)));
    }
  };

  const handleRetryJob = async (jobId: string) => {
    try {
      await adminAPI.retryJob(jobId);
      fetchJobs();
      alert('Job retry initiated successfully');
    } catch (error) {
      console.error('Failed to retry job:', error);
      alert('Failed to retry job');
    }
  };

  const handleCancelJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to cancel this job?')) return;

    try {
      await adminAPI.cancelJob(jobId);
      fetchJobs();
      alert('Job cancelled successfully');
    } catch (error) {
      console.error('Failed to cancel job:', error);
      alert('Failed to cancel job');
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) return;

    try {
      await adminAPI.deleteJob(jobId);
      fetchJobs();
      fetchJobStats();
      alert('Job deleted successfully');
    } catch (error) {
      console.error('Failed to delete job:', error);
      alert('Failed to delete job');
    }
  };

  const handleBulkAction = async (action: 'retry' | 'cancel' | 'delete') => {
    if (selectedJobs.size === 0) {
      alert('Please select jobs first');
      return;
    }

    const confirmMessage = `Are you sure you want to ${action} ${selectedJobs.size} job(s)?`;
    if (!confirm(confirmMessage)) return;

    try {
      await adminAPI.bulkJobAction(Array.from(selectedJobs), action);
      setSelectedJobs(new Set());
      fetchJobs();
      fetchJobStats();
      alert(`Bulk ${action} completed successfully`);
    } catch (error) {
      console.error(`Failed to ${action} jobs:`, error);
      alert(`Failed to ${action} jobs`);
    }
  };

  if (loading && !refreshing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Jobs Management</h1>
            <p className="text-gray-600 mt-1">Monitor and manage AI content generation jobs</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="mb-8">
          <JobStatsCards stats={stats} />
        </div>

        {/* Filters */}
        <div className="mb-6">
          <JobFilters filters={filters} onFilterChange={setFilters} />
        </div>

        {/* Bulk Actions */}
        <div className="mb-6">
          <JobBulkActions
            selectedCount={selectedJobs.size}
            onRetry={() => handleBulkAction('retry')}
            onCancel={() => handleBulkAction('cancel')}
            onDelete={() => handleBulkAction('delete')}
          />
        </div>

        {/* Jobs Table */}
        <JobsTable
          jobs={jobs}
          selectedJobs={selectedJobs}
          onSelectJob={handleSelectJob}
          onSelectAll={handleSelectAll}
          onViewDetails={(job) => {
            setSelectedJob(job);
            setShowDetails(true);
          }}
          onRetry={handleRetryJob}
          onCancel={handleCancelJob}
          onDelete={handleDeleteJob}
        />

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="mt-6 px-6 py-4 bg-white rounded-lg shadow-sm flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} jobs
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                disabled={pagination.page === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                disabled={pagination.page === pagination.pages}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Job Details Modal */}
      {showDetails && selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          onClose={() => {
            setShowDetails(false);
            setSelectedJob(null);
          }}
          onRetry={() => {
            handleRetryJob(selectedJob._id);
            setShowDetails(false);
          }}
          onCancel={() => {
            handleCancelJob(selectedJob._id);
            setShowDetails(false);
          }}
          onDelete={() => {
            handleDeleteJob(selectedJob._id);
            setShowDetails(false);
          }}
        />
      )}
    </div>
  );
}
