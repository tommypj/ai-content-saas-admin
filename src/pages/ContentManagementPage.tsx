import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  ReloadIcon,
  FileTextIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  ClockIcon,
  Pencil1Icon,
  TrashIcon,
  EyeOpenIcon,
  Cross2Icon,
  ExclamationTriangleIcon
} from '@radix-ui/react-icons';
import { adminAPI } from '../services/adminAPI';
import ContentDetailsModal from '../components/content/ContentDetailsModal';
import DeleteContentModal from '../components/content/DeleteContentModal';

interface ContentGroup {
  _id: string;
  userId: {
    _id: string;
    email: string;
    username: string;
  };
  title: string;
  description?: string;
  topic: string;
  status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  completionPercentage: number;
  summary: {
    keywordsCount: number;
    articleWordCount: number;
    seoScore?: number;
    hashtagsCount: number;
  };
  createdAt: string;
  updatedAt: string;
  tags: string[];
  isFavorite: boolean;
  isArchived: boolean;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function ContentManagementPage() {
  const [content, setContent] = useState<ContentGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Modals
  const [selectedContent, setSelectedContent] = useState<ContentGroup | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Messages
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchContent();
  }, [pagination.page, statusFilter, sortBy, sortOrder]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: pagination.page,
        limit: pagination.limit,
        sortBy,
        sortOrder
      };

      if (searchQuery) params.search = searchQuery;
      if (statusFilter !== 'all') params.status = statusFilter;

      const response = await adminAPI.getContentGroups(params);
      setContent(response.data);
      setPagination(response.pagination);
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Failed to load content' });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination({ ...pagination, page: 1 });
    fetchContent();
  };

  const handleSelectContent = (contentId: string) => {
    setSelectedIds(prev =>
      prev.includes(contentId)
        ? prev.filter(id => id !== contentId)
        : [...prev, contentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === content.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(content.map(c => c._id));
    }
  };

  const handleDeleteContent = async (contentId: string) => {
    try {
      await adminAPI.deleteContent(contentId, true);
      setMessage({ type: 'success', text: 'Content deleted successfully' });
      fetchContent();
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Failed to delete content' });
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedIds.length} content items?`)) return;
    if (!confirm('This action cannot be undone. Are you sure?')) return;

    try {
      await adminAPI.bulkContentAction(selectedIds, 'delete', { confirm: true });
      setMessage({ type: 'success', text: `${selectedIds.length} items deleted` });
      setSelectedIds([]);
      fetchContent();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete content' });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      COMPLETED: (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircledIcon className="w-3 h-3" />
          Completed
        </span>
      ),
      IN_PROGRESS: (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <ClockIcon className="w-3 h-3" />
          In Progress
        </span>
      ),
      DRAFT: (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Draft
        </span>
      ),
      FAILED: (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <CrossCircledIcon className="w-3 h-3" />
          Failed
        </span>
      )
    };
    return badges[status as keyof typeof badges] || badges.DRAFT;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-admin-900">Content Management</h1>
          <p className="text-admin-600 mt-1">
            Manage {pagination.total} content item{pagination.total !== 1 ? 's' : ''} across your platform
          </p>
        </div>
        <button
          onClick={fetchContent}
          disabled={loading}
          className="btn-secondary flex items-center gap-2"
        >
          <ReloadIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
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
          <p className={`text-sm font-medium flex-1 ${
            message.type === 'success' ? 'text-green-800' : 'text-red-800'
          }`}>
            {message.text}
          </p>
          <button onClick={() => setMessage(null)} className="text-admin-400 hover:text-admin-600">
            <Cross2Icon className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Filters & Search */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-admin-900 mb-2">Search Content</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-admin-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search by title or topic..."
                  className="input pl-10"
                />
              </div>
              <button onClick={handleSearch} className="btn-primary">
                Search
              </button>
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-admin-900 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPagination({ ...pagination, page: 1 });
              }}
              className="input"
            >
              <option value="all">All Status</option>
              <option value="COMPLETED">Completed</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DRAFT">Draft</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-admin-900 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input"
            >
              <option value="createdAt">Created Date</option>
              <option value="updatedAt">Updated Date</option>
              <option value="title">Title</option>
              <option value="completionPercentage">Completion</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  {selectedIds.length}
                </div>
                <span className="text-sm font-medium text-admin-900">
                  {selectedIds.length} item{selectedIds.length !== 1 ? 's' : ''} selected
                </span>
              </div>
              
              <button
                onClick={handleBulkDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <TrashIcon className="w-4 h-4" />
                Delete Selected
              </button>
            </div>

            <button
              onClick={() => setSelectedIds([])}
              className="p-2 hover:bg-admin-100 rounded-lg"
            >
              <Cross2Icon className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Content Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <ReloadIcon className="w-8 h-8 animate-spin text-admin-600" />
          </div>
        ) : content.length === 0 ? (
          <div className="text-center py-12">
            <FileTextIcon className="w-12 h-12 text-admin-400 mx-auto mb-4" />
            <p className="text-admin-600">No content found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-admin-50 border-b border-admin-200">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === content.length}
                        onChange={handleSelectAll}
                        className="rounded border-admin-300"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-admin-900 uppercase tracking-wider">
                      Content
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-admin-900 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-admin-900 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-admin-900 uppercase tracking-wider">
                      Stats
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-admin-900 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-admin-900 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-admin-200">
                  {content.map((item) => (
                    <tr key={item._id} className="hover:bg-admin-50 transition-colors">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(item._id)}
                          onChange={() => handleSelectContent(item._id)}
                          className="rounded border-admin-300"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-admin-900">{item.title}</div>
                          <div className="text-sm text-admin-600">{item.topic}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm text-admin-900">{item.userId.username}</div>
                          <div className="text-xs text-admin-600">{item.userId.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(item.status)}
                        <div className="mt-1 text-xs text-admin-600">
                          {item.completionPercentage}% complete
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm space-y-1">
                          <div className="text-admin-900">
                            {item.summary.articleWordCount} words
                          </div>
                          <div className="text-admin-600">
                            {item.summary.keywordsCount} keywords
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-admin-600">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedContent(item);
                              setShowDetailsModal(true);
                            }}
                            className="p-2 hover:bg-admin-100 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <EyeOpenIcon className="w-4 h-4 text-admin-600" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedContent(item);
                              setShowDeleteModal(true);
                            }}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                            title="Delete Content"
                          >
                            <TrashIcon className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-admin-200 flex items-center justify-between">
              <div className="text-sm text-admin-600">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} items
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                  disabled={pagination.page === 1}
                  className="btn-secondary"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                  disabled={pagination.page >= pagination.pages}
                  className="btn-secondary"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      {showDetailsModal && selectedContent && (
        <ContentDetailsModal
          content={selectedContent}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedContent(null);
          }}
        />
      )}

      {showDeleteModal && selectedContent && (
        <DeleteContentModal
          content={selectedContent}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedContent(null);
          }}
          onSuccess={() => {
            setShowDeleteModal(false);
            setSelectedContent(null);
            setMessage({ type: 'success', text: 'Content deleted successfully' });
            fetchContent();
          }}
        />
      )}
    </div>
  );
}