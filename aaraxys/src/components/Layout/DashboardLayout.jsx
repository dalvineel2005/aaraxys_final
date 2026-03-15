import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import WatchlistWidget from '../WatchlistWidget';

const DashboardLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-background text-text-main transition-colors duration-300">
      {/* Left Sidebar (Hidden on mobile) */}
      <div className="hidden md:flex">
         <Sidebar />
      </div>
      
      {/* Main Column */}
      <div className="flex flex-col flex-1 h-full min-w-0 relative">
        <Navbar />
        
        {/* Content Area */}
        <div className="flex-1 overflow-auto relative">
           <Outlet />
        </div>
      </div>
      
      {/* Watchlist - Fix Width Right Sidebar */}
      <WatchlistWidget />
    </div>
  );
};

export default DashboardLayout;
