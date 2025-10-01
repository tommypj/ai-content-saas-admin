import React from 'react';
import { Cross2Icon, CheckIcon, ExclamationTriangleIcon, TrashIcon } from '@radix-ui/react-icons';

interface Props {
  selectedCount: number;
  onClear: () => void;
  onSuspend: () => void;
  onActivate: () => void;
  onDelete: () => void;
}

export default function BulkActionsBar({ selectedCount, onClear, onSuspend, onActivate, onDelete }: Props) {
  return (
    <div className="card bg-blue-50 border-blue-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
              {selectedCount}
            </div>
            <span className="text-sm font-medium text-admin-900">
              {selectedCount} user{selectedCount !== 1 ? 's' : ''} selected
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={onActivate}
              className="btn-secondary flex items-center gap-2"
            >
              <CheckIcon className="w-4 h-4" />
              Activate
            </button>
            <button
              onClick={onSuspend}
              className="btn-secondary flex items-center gap-2"
            >
              <ExclamationTriangleIcon className="w-4 h-4" />
              Suspend
            </button>
            <button
              onClick={onDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <TrashIcon className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>

        <button
          onClick={onClear}
          className="p-2 hover:bg-admin-100 rounded-lg"
          title="Clear selection"
        >
          <Cross2Icon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}