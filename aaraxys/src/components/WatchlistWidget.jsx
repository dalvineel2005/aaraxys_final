import React, { useState } from 'react';
import { useMarketData } from '../context/MarketContext';
import { useOrder } from '../context/OrderContext';
import { Search, Plus, TrendingUp, TrendingDown, MoreHorizontal, ChevronRight, ChevronDown } from 'lucide-react';

const WatchlistWidget = () => {
  const { marketData } = useMarketData();
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Dummy watchlist lists
  const watchlists = ['All', 'WL 1', 'WL 2', 'Nifty 50', 'Tech', 'Holdings'];
  const currentTab = watchlists[activeTab];

  const filteredData = marketData.filter((stock) => {
    const matchesSearch = stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          stock.name.toLowerCase().includes(searchQuery.toLowerCase());
                          
    if (searchQuery.trim() !== '') {
       return matchesSearch;
    }
    
    // If 'All' tab is selected, show everything
    if (currentTab === 'All') {
      return true;
    }
    
    // Check if the stock has the tag corresponding to the current tab
    return stock.tags && stock.tags.includes(currentTab);
  });

  return (
    <aside className="w-80 h-[calc(100vh-4rem)] bg-sidebar-bg border-l border-border flex flex-col hidden lg:flex">
      
      {/* Search Bar */}
      <div className="p-3 border-b border-border bg-surface sticky top-0 z-10">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-main/50 group-focus-within:text-primary transition-colors">
            <Search size={16} />
          </div>
          <input
            type="text"
            className="block w-full pl-9 pr-3 py-2 text-sm border border-border rounded bg-background focus:outline-none focus:border-primary transition-colors text-text-main placeholder-text-main/50"
            placeholder="Search eg: infy bse, nifty fut"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto w-full relative">
        <div className="min-h-full">
          {filteredData.map((stock) => (
             <WatchlistItem key={stock.symbol} stock={stock} />
          ))}
          {filteredData.length === 0 && (
            <div className="flex flex-col items-center justify-center p-8 text-text-main/50">
               <Search size={32} className="mb-2 opacity-20" />
               <p className="text-sm">No results found for "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer Tabs */}
      <div className="h-12 border-t border-border flex bg-surface">
         {watchlists.map((wl, index) => (
           <button
             key={wl}
             onClick={() => setActiveTab(index)}
             className={`flex-1 text-xs font-medium transition-colors border-t-2 relative flex items-center justify-center ${
               activeTab === index 
                 ? 'text-primary border-primary bg-primary/5' 
                 : 'text-text-main/50 border-transparent hover:bg-background'
             }`}
           >
             {wl}
           </button>
         ))}
      </div>
    </aside>
  );
};

const WatchlistItem = ({ stock }) => {
  const isUp = stock.change >= 0;
  const { openOrderModal } = useOrder();
  
  return (
    <div className="group border-b border-border/50 hover:bg-border/30 transition-colors cursor-pointer relative">
      <div className="px-4 py-3 flex justify-between items-center group-hover:pr-2 transition-all">
        {/* Left Side */}
        <div className="flex flex-col w-[45%]">
            <span className={`text-sm font-medium ${stock.direction === 'up' ? 'text-success animate-pulse' : stock.direction === 'down' ? 'text-danger animate-pulse' : 'text-text-main'} truncate`}>
               {stock.symbol}
            </span>
            <span className="text-[10px] text-text-main/50 mt-0.5 truncate">{stock.name}</span>
        </div>
        
        {/* Right Side - Price */}
        <div className="flex flex-col items-end w-[45%] group-hover:opacity-0 transition-opacity duration-200">
           <span className={`text-sm font-medium tabular-nums ${isUp ? 'text-success' : 'text-danger'}`}>
              {stock.price.toFixed(2)}
           </span>
           <span className={`text-[10px] flex items-center mt-0.5 tabular-nums ${isUp ? 'text-success/80' : 'text-danger/80'}`}>
              {isUp ? <TrendingUp size={10} className="mr-0.5" /> : <TrendingDown size={10} className="mr-0.5" />}
              {Math.abs(stock.change).toFixed(2)} ({Math.abs(stock.changePercent).toFixed(2)}%)
           </span>
        </div>
      </div>
      
      {/* Hover Actions (Trading View style absolute overlay) */}
      <div className="absolute inset-y-0 right-0 flex items-center bg-gradient-to-l from-sidebar-bg via-sidebar-bg to-transparent pl-8 pr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="flex items-center gap-1.5 object-right">
             <button onClick={() => openOrderModal(stock, 'BUY')} className="w-7 h-7 bg-primary text-white rounded text-xs font-medium hover:bg-primary-hover transition-colors flex items-center justify-center">B</button>
             <button onClick={() => openOrderModal(stock, 'SELL')} className="w-7 h-7 bg-danger text-white rounded text-xs font-medium hover:bg-red-700 transition-colors flex items-center justify-center">S</button>
             <button className="w-7 h-7 bg-transparent border border-border text-text-main/70 rounded flex items-center justify-center hover:bg-background transition-colors"><MoreHorizontal size={14} /></button>
          </div>
      </div>
    </div>
  );
};

export default WatchlistWidget;
