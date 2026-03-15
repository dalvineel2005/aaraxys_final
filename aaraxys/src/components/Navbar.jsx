import { Search, Bell, Sun, Moon, User, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useMarketData } from '../context/MarketContext';

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { marketData, setActiveStock } = useMarketData();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Order Executed',
      message: 'Your sell order for 10 AAPL @ $175.40 was successful.',
      time: '2 mins ago',
      read: false
    },
    {
      id: 2,
      title: 'Price Alert: TSLA',
      message: 'TSLA has crossed above your target price of $210.',
      time: '1 hour ago',
      read: false
    },
    {
      id: 3,
      title: 'System Update',
      message: 'Trading services will be undergoing maintenance on Saturday.',
      time: '1 day ago',
      read: false
    }
  ]);
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };
    
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setShowSearchResults(false);
        searchInputRef.current?.blur();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const filtered = marketData.filter(stock => 
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 8); // Limit to 8 results

    setSearchResults(filtered);
    setShowSearchResults(true);
  }, [searchQuery, marketData]);

  const handleSelectStock = (stock) => {
    setActiveStock(stock);
    setSearchQuery('');
    setShowSearchResults(false);
    navigate('/trade');
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    addToast('All notifications marked as read', 'success');
  };

  const clearNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <nav className="h-16 bg-surface border-b border-border flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40 backdrop-blur-md transition-colors">
      
      {/* Mobile Logo / Search */}
      <div className="flex items-center gap-4 flex-1">
        <div className="md:hidden flex items-center gap-3">
           <button className="text-text-main/70 hover:text-text-main p-1">
             <Menu size={24} />
           </button>
           <img src="/logo.png" alt="ARAYXS" className="w-8 h-8 object-contain rounded-lg shadow-sm" />
        </div>
        
        {/* Global Search Bar */}
        <div className="hidden sm:flex relative max-w-md w-full ml-4 md:ml-0 group bg-surface" ref={searchRef}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-main/50 group-focus-within:text-primary transition-colors">
            <Search size={18} />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery && setShowSearchResults(true)}
            className="block w-full pl-10 pr-3 py-2 border border-border rounded-lg leading-5 bg-background focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all sm:text-sm text-text-main placeholder-text-main/50"
            placeholder="Search stocks, ETF, Indices..."
          />
          {/* Keyboard shortcut hint */}
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
             <span className="text-xs text-text-main/40 border border-border/70 rounded px-1.5 py-0.5">/</span>
          </div>

          {/* Search Results Dropdown */}
          {showSearchResults && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-2">
                {searchResults.length > 0 ? (
                  searchResults.map((stock) => (
                    <button
                      key={stock.symbol}
                      onClick={() => handleSelectStock(stock)}
                      className="w-full text-left p-3 hover:bg-background rounded-lg transition-colors flex items-center justify-between group"
                    >
                      <div className="flex flex-col">
                        <span className="font-bold text-text-main group-hover:text-primary transition-colors">{stock.symbol}</span>
                        <span className="text-xs text-text-main/50">{stock.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-text-main">₹{stock.price.toFixed(2)}</div>
                        <div className={`text-[10px] font-medium ${stock.change >= 0 ? 'text-success' : 'text-danger'}`}>
                          {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-text-main/50 text-sm">
                    No results found for "{searchQuery}"
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-3 sm:gap-5">
        
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full text-text-main/70 hover:bg-border/60 hover:text-text-main transition-all"
          aria-label="Toggle theme"
        >
          {isDarkMode ? <Sun size={20} strokeWidth={1.5} /> : <Moon size={20} strokeWidth={1.5} />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2 rounded-full transition-all relative ${showNotifications ? 'bg-border/60 text-text-main' : 'text-text-main/70 hover:bg-border/60 hover:text-text-main'}`}
          >
            <Bell size={20} strokeWidth={1.5} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full animate-pulse border border-surface"></span>
            )}
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-surface border border-border rounded-xl shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
               <div className="p-4 border-b border-border flex justify-between items-center">
                  <h3 className="font-bold text-text-main flex items-center gap-2">
                     Notifications
                     {unreadCount > 0 && (
                        <span className="bg-primary/20 text-primary text-[10px] px-1.5 py-0.5 rounded-full font-bold">{unreadCount}</span>
                     )}
                  </h3>
                  {unreadCount > 0 && (
                     <button onClick={handleMarkAllRead} className="text-xs text-primary hover:text-primary-hover transition-colors">
                        Mark all as read
                     </button>
                  )}
               </div>
               <div className="max-h-[300px] overflow-y-auto p-2">
                  {notifications.length === 0 ? (
                     <div className="p-4 text-center text-text-main/50 text-sm flex flex-col items-center">
                        <Bell size={24} className="mb-2 opacity-20" />
                        <p>No new notifications</p>
                     </div>
                  ) : (
                     notifications.map((notif) => (
                        <div 
                           key={notif.id} 
                           className={`p-3 rounded-lg cursor-pointer transition-colors mb-1 group relative ${notif.read ? 'hover:bg-background opacity-70' : 'bg-primary/5 hover:bg-primary/10 border-l-2 border-primary'}`}
                        >
                           <p className="text-sm text-text-main font-medium">{notif.title}</p>
                           <p className="text-xs text-text-main/80 mt-0.5">{notif.message}</p>
                           <span className="text-[10px] text-text-main/50 mt-1 block">{notif.time}</span>
                           
                           {/* Dismiss button on hover */}
                           <button 
                              onClick={(e) => { e.stopPropagation(); clearNotification(notif.id); }}
                              className="absolute top-2 right-2 p-1 text-text-main/30 hover:text-danger hover:bg-danger/10 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                              title="Dismiss"
                           >
                              <span className="sr-only">Dismiss</span>
                              &times;
                           </button>
                        </div>
                     ))
                  )}
               </div>
               <div className="p-3 border-t border-border text-center">
                  <button 
                    onClick={() => { setShowNotifications(false); navigate('/profile'); }}
                    className="text-sm text-text-main/70 hover:text-text-main font-medium"
                  >
                    View All Activity
                  </button>
               </div>
            </div>
          )}
        </div>

        {/* User Profile Hook */}
        <div 
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 pl-2 border-l border-border cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-full bg-border flex items-center justify-center overflow-hidden">
             <User size={18} className="text-text-main/60" />
          </div>
          <div className="hidden lg:block text-sm">
            <p className="font-medium text-text-main leading-tight">{user ? user.name : 'Guest'}</p>
            <p className="text-xs text-text-main/50">U{(user?._id || '12498').substring(0,5).toUpperCase()}</p>
          </div>
        </div>
        
      </div>
    </nav>
  );
};

export default Navbar;
