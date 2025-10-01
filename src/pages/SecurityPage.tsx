import React from 'react';

export default function SecurityPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-admin-900">Security & Monitoring</h1>
          <p className="text-admin-600 mt-1">Monitor security events and manage access controls</p>
        </div>
      </div>

      <div className="card">
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-admin-900 mb-2">Security Management</h3>
          <p className="text-admin-600">This section will provide security oversight including:</p>
          <ul className="mt-4 text-left max-w-md mx-auto space-y-2 text-admin-600">
            <li>• Security event monitoring</li>
            <li>• Failed login attempts</li>
            <li>• Rate limiting violations</li>
            <li>• Suspicious activity detection</li>
            <li>• Audit logs</li>
            <li>• IP blocking and access controls</li>
          </ul>
        </div>
      </div>
    </div>
  );
}