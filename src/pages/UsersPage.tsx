import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  ReloadIcon,
  PersonIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  LockClosedIcon,
  TrashIcon,
  Pencil1Icon,
  EyeOpenIcon,
  ExclamationTriangleIcon,
  CheckIcon,
  Cross2Icon
} from '@radix-ui/react-icons';
import { adminAPI } from '../services/adminAPI';
import UserDetailsModal from '../components/users/UserDetailsModal';
import EditUserModal from '../components/users/EditUserModal';
import SuspendUserModal from '../components/users/SuspendUserModal';
import DeleteUserModal from '../components/users/DeleteUserModal';
import BulkActionsBar from '../components/users/BulkActionsBar';

interface User {
  _id: string;
  username: string;
  email: string;
  isActive: boolean;
  subscription: {
    plan: 'free' | 'pro' | 'enterprise';
    status: string;
  };
  usageStats: {
    totalContentGenerated: number;
    totalTokensUsed: number;
    totalJobsCompleted: number;
    lastActiveAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Modals
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Bulk selection
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Messages
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, planFilter, statusFilter, sortBy, sortOrder]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: pagination.page,
        limit: pagination.limit,
        sortBy,
        sortOrder
      };

      if (searchQuery) params.search = searchQuery;
      if (planFilter !== 'all') params.plan = planFilter;
      if (statusFilter !== 'all') params.status = statusFilter;

      const response = await adminAPI.getUsers(params);
      setUsers(response.data);
      setPagination(response.pagination);
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Failed to load users' });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination({ ...pagination, page: 1 });
    fetchUsers();
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUserIds(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUserIds.length === users.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(users.map(u => u._id));
    }
  };

  const handleActivateUser = async (userId: string) => {
    try {
      await adminAPI.activateUser(userId);
      setMessage({ type: 'success', text: 'User activated successfully' });
      fetchUsers();
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Failed to activate user' });
    }
  };

  const handleResetPassword = async (userId: string) => {
    if (!confirm('Send password reset email to this user?')) return;

    try {
      await adminAPI.resetUserPassword(userId);
      setMessage({ type: 'success', text: 'Password reset email sent' });
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Failed to send password reset email' });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (user: User) => {
    if (!user.isActive) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <CrossCircledIcon className="w-3 h-3" />
          Suspended
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircledIcon className="w-3 h-3" />
        Active
      </span>
    );
  };

  const getPlanBadge = (plan: string) => {
    const colors = {
      free: 'bg-gray-100 text-gray-800',
      pro: 'bg-blue-100 text-blue-800',
      enterprise: 'bg-purple-100 text-purple-800',
      dev: 'bg-green-100 text-green-800'
    };
    const labels = {
      free: 'FREE',
      pro: 'PRO',
      enterprise: 'ENTERPRISE',
      dev: 'DEV 🚀'
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${colors[plan as keyof typeof colors]}`}>
        {labels[plan as keyof typeof labels] || plan.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-admin-900">User Management</h1>
          <p className="text-admin-600 mt-1">
            Manage {pagination.total} user{pagination.total !== 1 ? 's' : ''} across your platform
          </p>
        </div>
        <button
          onClick={fetchUsers}
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
            <label className="block text-sm font-medium text-admin-900 mb-2">Search Users</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-admin-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search by email or username..."
                  className="input pl-10"
                />
              </div>
              <button onClick={handleSearch} className="btn-primary">
                Search
              </button>
            </div>
          </div>

          {/* Plan Filter */}
          <div>
            <label className="block text-sm font-medium text-admin-900 mb-2">Plan</label>
            <select
              value={planFilter}
              onChange={(e) => {
                setPlanFilter(e.target.value);
                setPagination({ ...pagination, page: 1 });
              }}
              className="input"
            >
              <option value="all">All Plans</option>
              <option value="free">Free</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
              <option value="dev">Dev</option>
            </select>
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
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedUserIds.length > 0 && (
        <BulkActionsBar
          selectedCount={selectedUserIds.length}
          onClear={() => setSelectedUserIds([])}
          onSuspend={() => {
            setShowBulkActions(true);
          }}
          onActivate={async () => {
            if (!confirm(`Activate ${selectedUserIds.length} users?`)) return;
            try {
              await adminAPI.bulkUserAction(selectedUserIds, 'activate');
              setMessage({ type: 'success', text: `${selectedUserIds.length} users activated` });
              setSelectedUserIds([]);
              fetchUsers();
            } catch (error) {
              setMessage({ type: 'error', text: 'Failed to activate users' });
            }
          }}
          onDelete={() => {
            if (!confirm(`Delete ${selectedUserIds.length} users and all their data?`)) return;
            if (!confirm('This action cannot be undone. Are you sure?')) return;
            
            adminAPI.bulkUserAction(selectedUserIds, 'delete', { confirm: true })
              .then(() => {
                setMessage({ type: 'success', text: `${selectedUserIds.length} users deleted` });
                setSelectedUserIds([]);
                fetchUsers();
              })
              .catch(() => {
                setMessage({ type: 'error', text: 'Failed to delete users' });
              });
          }}
        />
      )}

      {/* Users Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <ReloadIcon className="w-8 h-8 animate-spin text-admin-600" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <PersonIcon className="w-12 h-12 text-admin-400 mx-auto mb-4" />
            <p className="text-admin-600">No users found</p>
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
                        checked={selectedUserIds.length === users.length}
                        onChange={handleSelectAll}
                        className="rounded border-admin-300"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-admin-900 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-admin-900 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-admin-900 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-admin-900 uppercase tracking-wider">
                      Usage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-admin-900 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-admin-900 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-admin-200">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-admin-50 transition-colors">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedUserIds.includes(user._id)}
                          onChange={() => handleSelectUser(user._id)}
                          className="rounded border-admin-300"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-admin-100 flex items-center justify-center">
                            <PersonIcon className="w-5 h-5 text-admin-600" />
                          </div>
                          <div>
                            <div className="font-medium text-admin-900">{user.username}</div>
                            <div className="text-sm text-admin-600">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getPlanBadge(user.subscription.plan)}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(user)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="text-admin-900">
                            {user.usageStats.totalJobsCompleted} jobs
                          </div>
                          <div className="text-admin-600">
                            {(user.usageStats.totalTokensUsed / 1000).toFixed(1)}K tokens
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-admin-600">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowDetailsModal(true);
                            }}
                            className="p-2 hover:bg-admin-100 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <EyeOpenIcon className="w-4 h-4 text-admin-600" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowEditModal(true);
                            }}
                            className="p-2 hover:bg-admin-100 rounded-lg transition-colors"
                            title="Edit User"
                          >
                            <Pencil1Icon className="w-4 h-4 text-admin-600" />
                          </button>
                          {user.isActive ? (
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowSuspendModal(true);
                              }}
                              className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                              title="Suspend User"
                            >
                              <ExclamationTriangleIcon className="w-4 h-4 text-red-600" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleActivateUser(user._id)}
                              className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                              title="Activate User"
                            >
                              <CheckIcon className="w-4 h-4 text-green-600" />
                            </button>
                          )}
                          <button
                            onClick={() => handleResetPassword(user._id)}
                            className="p-2 hover:bg-admin-100 rounded-lg transition-colors"
                            title="Reset Password"
                          >
                            <LockClosedIcon className="w-4 h-4 text-admin-600" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowDeleteModal(true);
                            }}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                            title="Delete User"
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
                {pagination.total} users
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
      {showDetailsModal && selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedUser(null);
          }}
          onEdit={() => {
            setShowDetailsModal(false);
            setShowEditModal(true);
          }}
        />
      )}

      {showEditModal && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          onSuccess={() => {
            setShowEditModal(false);
            setSelectedUser(null);
            setMessage({ type: 'success', text: 'User updated successfully' });
            fetchUsers();
          }}
        />
      )}

      {showSuspendModal && selectedUser && (
        <SuspendUserModal
          user={selectedUser}
          onClose={() => {
            setShowSuspendModal(false);
            setSelectedUser(null);
          }}
          onSuccess={() => {
            setShowSuspendModal(false);
            setSelectedUser(null);
            setMessage({ type: 'success', text: 'User suspended successfully' });
            fetchUsers();
          }}
        />
      )}

      {showDeleteModal && selectedUser && (
        <DeleteUserModal
          user={selectedUser}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedUser(null);
          }}
          onSuccess={() => {
            setShowDeleteModal(false);
            setSelectedUser(null);
            setMessage({ type: 'success', text: 'User deleted successfully' });
            fetchUsers();
          }}
        />
      )}
    </div>
  );
}