import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import WatchlistWidget from '../WatchlistWidget';
import MobileBottomNav from '../MobileBottomNav';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-text-main transition-colors duration-300">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsSidebarOpen(false)}
          />
          {/* Sidebar Drawer */}
          <div className="absolute left-0 top-0 bottom-0 z-10 animate-in slide-in-from-left duration-300">
            <Sidebar onNavigate={() => setIsSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
         <Sidebar />
      </div>
      
      {/* Main Column */}
      <div className="flex flex-col flex-1 h-full min-w-0 relative">
        <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        {/* Content Area - add bottom padding on mobile for bottom nav */}
        <div className="flex-1 overflow-auto relative pb-16 md:pb-0">
           <Outlet />
        </div>
      </div>
      
      {/* Watchlist - Fix Width Right Sidebar (hidden on < lg) */}
      <WatchlistWidget />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default DashboardLayout;
