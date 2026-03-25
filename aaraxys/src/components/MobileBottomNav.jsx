import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, LineChart, Briefcase, WalletCards, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

const MobileBottomNav = () => {
  const [showMore, setShowMore] = useState(false);

  const mainLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Markets', path: '/markets', icon: LineChart },
    { name: 'Terminal', path: '/trade', icon: LineChart },
    { name: 'Portfolio', path: '/portfolio', icon: Briefcase },
  ];

  const moreLinks = [
    { name: 'Orders', path: '/orders' },
    { name: 'Funds', path: '/funds' },
    { name: 'Profile', path: '/profile' },
  ];

  return (
    <>
      {/* More menu overlay */}
      {showMore && (
        <div className="fixed inset-0 z-[60] md:hidden" onClick={() => setShowMore(false)}>
          <div className="absolute bottom-16 right-3 bg-surface border border-border rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-2 fade-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-2 min-w-[160px]">
              {moreLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setShowMore(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-text-main/70 hover:bg-border/50 hover:text-text-main'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Nav Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-surface/95 backdrop-blur-md border-t border-border flex items-center justify-around h-16 px-1">
        {mainLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-0.5 flex-1 py-1 rounded-lg transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-text-main/50 active:text-text-main'
                }`
              }
            >
              <Icon size={20} strokeWidth={1.5} />
              <span className="text-[10px] font-medium">{link.name}</span>
            </NavLink>
          );
        })}
        
        {/* More button */}
        <button
          onClick={() => setShowMore(!showMore)}
          className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1 rounded-lg transition-colors ${
            showMore ? 'text-primary' : 'text-text-main/50 active:text-text-main'
          }`}
        >
          <MoreHorizontal size={20} strokeWidth={1.5} />
          <span className="text-[10px] font-medium">More</span>
        </button>
      </nav>
    </>
  );
};

export default MobileBottomNav;
