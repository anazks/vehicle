import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { MobileBottomNav } from './MobileBottomNav';

export const Layout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-sky-50/80 via-white to-blue-50/60 text-slate-800 overflow-hidden">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white">
        {/* Top Navbar */}
        <Navbar />

        {/* Page Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 pb-20 md:pb-8 bg-sky-50/30">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>

        {/* Mobile Staff Bottom Tab Navigation Bar */}
        <MobileBottomNav />
      </div>
    </div>
  );
};
