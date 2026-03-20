import React, { useState } from 'react';
import { useMarketData } from '../context/MarketContext';
import { useOrder } from '../context/OrderContext';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

const Markets = () => {
  const { marketData } = useMarketData();
  const { openOrderModal } = useOrder();
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Tech', 'Nifty 50', 'Holdings', 'WL 1', 'WL 2'];

  const filteredData = marketData.filter(stock => {
    const matchesSearch = stock.symbol.toLowerCase().includes(search.toLowerCase()) || 
                          stock.name.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = activeFilter === 'All' || (stock.tags && stock.tags.includes(activeFilter));
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 h-full flex flex-col animate-in fade-in duration-500 max-w-7xl mx-auto w-full border-r border-l border-border/50">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Markets</h1>
          <p className="text-text-main/60 mt-1">Explore all tradable instruments.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto relative">
           <div className="relative group w-full sm:w-64">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-main/50 group-focus-within:text-primary transition-colors">
               <Search size={16} />
             </div>
             <input
               type="text"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="block w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:border-primary transition-colors text-text-main placeholder-text-main/50"
               placeholder="Search markets..."
             />
           </div>
           
           <button 
             onClick={() => setShowFilters(!showFilters)}
             className={`p-2 border border-border rounded-lg text-text-main/70 hover:bg-border/50 transition-colors bg-surface flex items-center gap-2 text-sm ${showFilters ? 'bg-primary/10 border-primary text-primary' : ''}`}
           >
             <Filter size={16} />
             <span className="hidden sm:block">Filter{activeFilter !== 'All' ? `: ${activeFilter}` : ''}</span>
           </button>

           {/* Filter Dropdown */}
           {showFilters && (
             <div className="absolute top-full right-0 mt-2 w-48 bg-surface border border-border rounded-lg shadow-xl z-50 animate-in zoom-in-95 duration-200">
               <div className="p-2">
                 <p className="text-[10px] font-semibold text-text-main/40 px-2 py-1 uppercase tracking-wider">Filter by Category</p>
                 {filters.map((f) => (
                   <button
                     key={f}
                     onClick={() => {
                       setActiveFilter(f);
                       setShowFilters(false);
                     }}
                     className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                       activeFilter === f 
                         ? 'bg-primary text-white font-medium' 
                         : 'text-text-main/70 hover:bg-border/50'
                     }`}
                   >
                     {f}
                   </button>
                 ))}
               </div>
             </div>
           )}
        </div>
      </div>

      {/* Main Table Area */}
      <div className="flex-1 bg-surface border border-border rounded-xl overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-background/50 text-text-main/70 text-sm">
                <th className="p-4 font-medium flex items-center gap-1 cursor-pointer hover:text-text-main">
                  Instrument <ArrowUpDown size={14} />
                </th>
                <th className="p-4 font-medium text-right cursor-pointer hover:text-text-main">
                  <div className="flex items-center justify-end gap-1">LTP <ArrowUpDown size={14} /></div>
                </th>
                <th className="p-4 font-medium text-right hidden sm:table-cell cursor-pointer hover:text-text-main">
                  <div className="flex items-center justify-end gap-1">Chg <ArrowUpDown size={14} /></div>
                </th>
                <th className="p-4 font-medium text-right hidden md:table-cell cursor-pointer hover:text-text-main">
                  <div className="flex items-center justify-end gap-1">Chg % <ArrowUpDown size={14} /></div>
                </th>
                <th className="p-4 font-medium text-right hidden lg:table-cell">Volume</th>
                <th className="p-4 font-medium text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredData.map((stock) => {
                const isUp = stock.change >= 0;
                return (
                  <tr key={stock.symbol} className="hover:bg-border/30 transition-colors group">
                    <td className="p-4">
                      <div className="font-bold text-text-main flex items-center gap-2">
                        {stock.symbol}
                        <span className="text-[10px] bg-border px-1.5 py-0.5 rounded text-text-main/60 hidden sm:block">EQ</span>
                      </div>
                      <div className="text-xs text-text-main/60 mt-0.5">{stock.name}</div>
                    </td>
                    <td className="p-4 text-right">
                       <span className={`font-medium tabular-nums ${stock.direction === 'up' ? 'text-success animate-pulse' : stock.direction === 'down' ? 'text-danger animate-pulse' : 'text-text-main'}`}>
                         ₹{stock.price.toFixed(2)}
                       </span>
                    </td>
                    <td className="p-4 text-right hidden sm:table-cell">
                       <span className={`text-sm tabular-nums ${isUp ? 'text-success' : 'text-danger'}`}>
                         {isUp ? '+' : ''}{stock.change.toFixed(2)}
                       </span>
                    </td>
                    <td className="p-4 text-right hidden md:table-cell">
                       <span className={`text-sm tabular-nums py-1 px-2 rounded-md ${isUp ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                         {isUp ? '+' : ''}{stock.changePercent.toFixed(2)}%
                       </span>
                    </td>
                    <td className="p-4 text-right hidden lg:table-cell text-sm text-text-main/70 tabular-nums">
                       {(Math.random() * 10 + 1).toFixed(2)}M
                    </td>
                    <td className="p-4">
                       <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => openOrderModal(stock, 'BUY')} className="px-3 py-1 bg-primary text-white rounded text-sm font-medium hover:bg-primary-hover transition-colors">B</button>
                         <button onClick={() => openOrderModal(stock, 'SELL')} className="px-3 py-1 bg-danger text-white rounded text-sm font-medium hover:bg-red-700 transition-colors">S</button>
                       </div>
                    </td>
                  </tr>
                );
              })}
              {filteredData.length === 0 && (
                 <tr>
                    <td colSpan="6" className="p-8 text-center text-text-main/50">
                       No instruments found matching your search.
                    </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Markets;
