import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LineChart, Briefcase, ListOrdered, WalletCards, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Markets', path: '/markets', icon: <LineChart size={20} /> },
    { name: 'Terminal', path: '/trade', icon: <LineChart size={20} /> }, // Can use different icon
    { name: 'Portfolio', path: '/portfolio', icon: <Briefcase size={20} /> },
    { name: 'Orders', path: '/orders', icon: <ListOrdered size={20} /> },
    { name: 'Funds', path: '/funds', icon: <WalletCards size={20} /> },
  ];
  return (
    <aside className="w-20 md:w-[72px] flex flex-col h-full bg-sidebar-bg border-r border-border transition-all duration-300">
      {/* Brand Logo area (Navbar handles top on mobile, this is for desktop) */}
      <div className="h-16 flex flex-col items-center justify-center border-b border-border p-3">
        <img src="/logo.png" alt="ARAYXS" className="w-full h-full object-contain rounded-lg shadow-sm" />
      </div>

      <div className="flex-1 py-4 flex flex-col items-center gap-2 px-2">
        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            title={link.name}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full aspect-square rounded-xl transition-all duration-200 group relative
              ${isActive
                ? 'bg-primary/10 text-primary'
                : 'text-text-main/60 hover:bg-border/50 hover:text-text-main'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`${isActive ? 'text-primary' : 'group-hover:text-primary'} transition-colors mb-1`}>
                  {React.cloneElement(link.icon, { size: 22 })}
                </div>
                <span className="text-[10px] font-medium tracking-wide">{link.name}</span>
                
                {/* Active Indicator Line */}
                {isActive && (
                  <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1 h-8 bg-primary rounded-r"></div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
      
      {/* Bottom Actions */}
      <div className="p-2 border-t border-border mt-auto flex flex-col gap-2">
        <NavLink to="/profile" title="Settings" className="flex items-center justify-center w-full aspect-square rounded-xl text-text-main/60 hover:bg-border/50 hover:text-text-main transition-colors">
          <Settings size={22} />
        </NavLink>
        <button 
          onClick={() => {
            logout();
            navigate('/login');
          }}
          title="Logout" 
          className="flex items-center justify-center w-full aspect-square rounded-xl text-danger/70 hover:bg-danger/10 hover:text-danger transition-colors"
        >
          <LogOut size={22} />
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;
