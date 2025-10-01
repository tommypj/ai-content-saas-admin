import React from 'react';
import { Cross2Icon, FileTextIcon, PersonIcon, ClockIcon, CheckCircledIcon } from '@radix-ui/react-icons';

interface Props {
  content: any;
  onClose: () => void;
}

export default function ContentDetailsModal({ content, onClose }: Props) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-admin-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <FileTextIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-admin-900">{content.title}</h2>
              <p className="text-sm text-admin-600">{content.topic}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-admin-100 rounded-lg">
            <Cross2Icon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="text-lg font-semibold text-admin-900 mb-4">Content Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-admin-600">Status</label>
                <p className="text-admin-900 font-medium capitalize">{content.status.toLowerCase()}</p>
              </div>
              <div>
                <label className="text-sm text-admin-600">Completion</label>
                <p className="text-admin-900 font-medium">{content.completionPercentage}%</p>
              </div>
              <div>
                <label className="text-sm text-admin-600">Created By</label>
                <p className="text-admin-900 font-medium">{content.userId.username}</p>
                <p className="text-xs text-admin-600">{content.userId.email}</p>
              </div>
              <div>
                <label className="text-sm text-admin-600">Created At</label>
                <p className="text-admin-900 font-medium">{formatDate(content.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div>
            <h3 className="text-lg font-semibold text-admin-900 mb-4">Content Statistics</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-admin-600 mb-1">Word Count</p>
                <p className="text-2xl font-bold text-blue-600">
                  {content.summary.articleWordCount || 0}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-admin-600 mb-1">Keywords</p>
                <p className="text-2xl font-bold text-green-600">
                  {content.summary.keywordsCount || 0}
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-admin-600 mb-1">SEO Score</p>
                <p className="text-2xl font-bold text-purple-600">
                  {content.summary.seoScore || 'N/A'}
                </p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <p className="text-sm text-admin-600 mb-1">Hashtags</p>
                <p className="text-2xl font-bold text-orange-600">
                  {content.summary.hashtagsCount || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          {content.description && (
            <div>
              <h3 className="text-lg font-semibold text-admin-900 mb-2">Description</h3>
              <p className="text-admin-600">{content.description}</p>
            </div>
          )}

          {/* Target Audience */}
          {content.targetAudience && (
            <div>
              <h3 className="text-lg font-semibold text-admin-900 mb-2">Target Audience</h3>
              <p className="text-admin-600">{content.targetAudience}</p>
            </div>
          )}

          {/* Tags */}
          {content.tags && content.tags.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-admin-900 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {content.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-admin-100 text-admin-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div>
            <h3 className="text-lg font-semibold text-admin-900 mb-2">Metadata</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="text-admin-600">Content ID</label>
                <p className="text-admin-900 font-mono">{content._id}</p>
              </div>
              <div>
                <label className="text-admin-600">User ID</label>
                <p className="text-admin-900 font-mono">{content.userId._id}</p>
              </div>
              <div>
                <label className="text-admin-600">Last Updated</label>
                <p className="text-admin-900">{formatDate(content.updatedAt)}</p>
              </div>
              <div>
                <label className="text-admin-600">Favorite</label>
                <p className="text-admin-900">{content.isFavorite ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-admin-200 px-6 py-4 flex items-center justify-end">
          <button onClick={onClose} className="btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}