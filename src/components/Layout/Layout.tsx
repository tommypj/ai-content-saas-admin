import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useUIStore } from '../../store/ui';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { sidebarCollapsed } = useUIStore();

  return (
    <div className="min-h-screen bg-admin-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className={`${
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      } transition-all duration-300 ease-in-out`}>
        {/* Header */}
        <Header />
        
        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}