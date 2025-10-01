import React from 'react';
import { useParams } from 'react-router-dom';

export default function UserDetailsPage() {
  const { userId } = useParams();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-admin-900">User Details</h1>
          <p className="text-admin-600 mt-1">Detailed view for user ID: {userId}</p>
        </div>
      </div>

      <div className="card">
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-admin-900 mb-2">User Details</h3>
          <p className="text-admin-600">This section will show comprehensive user information including:</p>
          <ul className="mt-4 text-left max-w-md mx-auto space-y-2 text-admin-600">
            <li>• User profile information</li>
            <li>• Subscription details</li>
            <li>• Usage statistics</li>
            <li>• Content generation history</li>
            <li>• Billing history</li>
            <li>• Security events</li>
          </ul>
        </div>
      </div>
    </div>
  );
}