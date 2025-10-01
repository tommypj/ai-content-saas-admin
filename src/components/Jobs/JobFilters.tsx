import React from 'react';
import { Search } from 'lucide-react';

interface JobFiltersProps {
  filters: {
    search: string;
    status: string;
    type: string;
    sortBy: string;
    sortOrder: string;
  };
  onFilterChange: (filters: any) => void;
}

export default function JobFilters({ filters, onFilterChange }: JobFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by user email, content title..."
              value={filters.search}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="QUEUED">Queued</option>
          <option value="RUNNING">Running</option>
          <option value="SUCCEEDED">Succeeded</option>
          <option value="FAILED">Failed</option>
        </select>

        {/* Type Filter */}
        <select
          value={filters.type}
          onChange={(e) => onFilterChange({ ...filters, type: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Types</option>
          <option value="GENERATE_OUTLINE">Generate Outline</option>
          <option value="GENERATE_ARTICLE">Generate Article</option>
          <option value="PROOFREAD">Proofread</option>
          <option value="IMPROVE">Improve</option>
        </select>

        {/* Sort */}
        <select
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split('-');
            onFilterChange({ ...filters, sortBy, sortOrder });
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="createdAt-desc">Newest First</option>
          <option value="createdAt-asc">Oldest First</option>
          <option value="processingTime-desc">Slowest First</option>
          <option value="processingTime-asc">Fastest First</option>
          <option value="tokensUsed-desc">Most Tokens</option>
          <option value="tokensUsed-asc">Least Tokens</option>
        </select>
      </div>
    </div>
  );
}
