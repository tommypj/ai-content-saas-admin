import React from 'react';
import { PlayCircle, StopCircle, Trash2 } from 'lucide-react';

interface JobBulkActionsProps {
  selectedCount: number;
  onRetry: () => void;
  onCancel: () => void;
  onDelete: () => void;
}

export default function JobBulkActions({ 
  selectedCount, 
  onRetry, 
  onCancel, 
  onDelete 
}: JobBulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <span className="text-blue-900 font-medium">
          {selectedCount} job(s) selected
        </span>
        <div className="flex items-center space-x-2">
          <button
            onClick={onRetry}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Retry Selected</span>
          </button>
          <button
            onClick={onCancel}
            className="flex items-center space-x-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
          >
            <StopCircle className="w-4 h-4" />
            <span>Cancel Selected</span>
          </button>
          <button
            onClick={onDelete}
            className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Selected</span>
          </button>
        </div>
      </div>
    </div>
  );
}
