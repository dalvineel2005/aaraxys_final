import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMarketData } from '../context/MarketContext';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';
import { ArrowUpRight, ArrowDownRight, Briefcase, RefreshCw, BarChart3 } from 'lucide-react';
import api from '../services/api';

const Portfolio = () => {
  const { marketData, setActiveStock } = useMarketData();
  const { user } = useAuth();
  const { openOrderModal } = useOrder();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('HOLDINGS');
  const [apiHoldings, setApiHoldings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPortfolio = async () => {
    setIsLoading(true);
    try {
      if (user) {
        const [portfolioRes, ordersRes] = await Promise.all([
          api.get('/orders/portfolio'),
          api.get('/orders')
        ]);
        setApiHoldings(portfolioRes.data);
        setOrders(ordersRes.data);
      }
    } catch (error) {
      console.error('Failed to fetch portfolio', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, [user]);

  // Combine API holdings with real-time market data
  const holdings = apiHoldings.map(h => {
    const marketStock = marketData.find(m => m.symbol === h.symbol) || { price: h.avgPrice, name: h.symbol, change: 0, changePercent: 0 };
    return {
      symbol: h.symbol,
      name: marketStock.name,
      qty: h.quantity,
      avgCost: h.avgPrice,
      price: marketStock.price,
      // Keep full market data for navigation
      _marketData: marketStock
    };
  });

  // Positions = today's executed orders
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const positions = orders.filter(o => {
    const orderDate = new Date(o.createdAt);
    return orderDate >= today && o.status === 'EXECUTED';
  });

  const totalInvested = holdings.reduce((acc, h) => acc + (h.qty * h.avgCost), 0);
  const totalCurrent = holdings.reduce((acc, h) => acc + (h.qty * h.price), 0);
  const totalPnL = totalCurrent - totalInvested;
  const isPositive = totalPnL >= 0;

  const handleViewChart = (holding) => {
    const stock = marketData.find(m => m.symbol === holding.symbol) || {
      symbol: holding.symbol,
      name: holding.name,
      price: holding.price,
      change: 0,
      changePercent: 0
    };
    setActiveStock(stock);
    navigate('/trade');
  };

  const handleAction = (holding, type) => {
    const stock = marketData.find(m => m.symbol === holding.symbol) || {
      symbol: holding.symbol,
      name: holding.name,
      price: holding.price,
      change: 0,
      changePercent: 0
    };
    openOrderModal(stock, type);
  };

  return (
    <div className="p-6 h-full flex flex-col animate-in fade-in duration-500 max-w-7xl mx-auto w-full">
      
      {/* Header Summary */}
      <div className="bg-surface border border-border rounded-xl p-6 mb-8 flex flex-col md:flex-row gap-8 justify-between">
        <div className="flex-1">
           <div className="flex items-center gap-3 mb-2">
             <h2 className="text-sm font-medium text-text-main/60 flex items-center gap-2">
                <Briefcase size={16} /> Total Portfolio Value
             </h2>
             <button onClick={fetchPortfolio} disabled={isLoading} className="text-text-main/40 hover:text-text-main transition-colors">
               <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
             </button>
           </div>
           
           <div className="text-4xl font-bold text-text-main tabular-nums tracking-tight">
              ₹{(totalCurrent + (user?.availableMargin || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
           </div>
           <p className="text-xs text-text-main/50 mt-1">Includes Available Cash: ₹{(user?.availableMargin || 0).toLocaleString('en-IN')}</p>
        </div>
        
        <div className="flex gap-8 md:border-l md:border-border md:pl-8 flex-1">
           <div>
              <p className="text-sm font-medium text-text-main/60 mb-2">Invested</p>
              <p className="text-xl font-medium text-text-main tabular-nums">₹{totalInvested.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
           </div>
           <div>
              <p className="text-sm font-medium text-text-main/60 mb-2">Total P&L</p>
              <div className={`text-xl font-bold tabular-nums flex items-center ${isPositive ? 'text-success' : 'text-danger'}`}>
                 {isPositive ? <ArrowUpRight size={20} className="mr-1" /> : <ArrowDownRight size={20} className="mr-1" />}
                 ₹{Math.abs(totalPnL).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
           </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-border/50 mb-6 font-medium">
         <button 
           onClick={() => setActiveTab('HOLDINGS')} 
           className={`pb-3 border-b-2 transition-all ${activeTab === 'HOLDINGS' ? 'border-primary text-primary' : 'border-transparent text-text-main/60 hover:text-text-main'}`}
         >
           Holdings ({holdings.length})
         </button>
         <button 
           onClick={() => setActiveTab('POSITIONS')}
           className={`pb-3 border-b-2 transition-all ${activeTab === 'POSITIONS' ? 'border-primary text-primary' : 'border-transparent text-text-main/60 hover:text-text-main'}`}
         >
           Positions ({positions.length})
         </button>
      </div>

      {/* Holdings Table */}
      {activeTab === 'HOLDINGS' && (
        <div className="flex-1 bg-surface border border-border rounded-xl flex flex-col relative overflow-hidden">
          {isLoading && (
            <div className="absolute inset-x-0 top-0 h-1 bg-primary/20 overflow-hidden">
               <div className="h-full bg-primary animate-pulse w-1/2 rounded"></div>
            </div>
          )}
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="border-b border-border bg-background/50 text-text-main/70 text-xs uppercase tracking-wider">
                  <th className="p-4 font-medium">Instrument</th>
                  <th className="p-4 font-medium text-right">Qty.</th>
                  <th className="p-4 font-medium text-right">Avg. Cost</th>
                  <th className="p-4 font-medium text-right">LTP</th>
                  <th className="p-4 font-medium text-right">Cur. Value</th>
                  <th className="p-4 font-medium text-right">P&L</th>
                  <th className="p-4 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {holdings.length === 0 && !isLoading ? (
                  <tr>
                    <td colSpan="7" className="p-12 text-center text-text-main/50">
                       No active holdings found in your account.
                    </td>
                  </tr>
                ) : (
                  holdings.map((h) => {
                    const pnl = (h.price - h.avgCost) * h.qty;
                    const pnlPercent = ((h.price - h.avgCost) / h.avgCost) * 100;
                    const isUp = pnl >= 0;
                    
                    return (
                      <tr key={h.symbol} className="hover:bg-border/30 transition-colors group">
                        <td className="p-4">
                          <div className="font-bold text-text-main">{h.symbol}</div>
                          <div className="text-xs text-text-main/60 mt-0.5">{h.name}</div>
                        </td>
                        <td className="p-4 text-right text-text-main tabular-nums">{h.qty}</td>
                        <td className="p-4 text-right text-text-main tabular-nums">₹{h.avgCost.toFixed(2)}</td>
                        <td className="p-4 text-right font-medium text-text-main tabular-nums">₹{h.price.toFixed(2)}</td>
                        <td className="p-4 text-right tabular-nums">₹{(h.qty * h.price).toFixed(2)}</td>
                        <td className="p-4 text-right">
                           <div className={`font-medium tabular-nums ${isUp ? 'text-success' : 'text-danger'}`}>
                             {isUp ? '+' : ''}{pnl.toFixed(2)}
                           </div>
                           <div className={`text-xs tabular-nums mt-0.5 ${isUp ? 'text-success/80' : 'text-danger/80'}`}>
                             {isUp ? '+' : ''}{pnlPercent.toFixed(2)}%
                           </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleViewChart(h)}
                              className="px-2.5 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                              title="View Chart"
                            >
                              <BarChart3 size={12} />
                              <span className="hidden lg:inline">Chart</span>
                            </button>
                            <button
                              onClick={() => handleAction(h, 'BUY')}
                              className="px-2.5 py-1.5 bg-success/10 text-success hover:bg-success hover:text-white rounded-lg text-xs font-semibold transition-colors"
                              title="Buy"
                            >
                              Buy
                            </button>
                            <button
                              onClick={() => handleAction(h, 'SELL')}
                              className="px-2.5 py-1.5 bg-danger/10 text-danger hover:bg-danger hover:text-white rounded-lg text-xs font-semibold transition-colors"
                              title="Sell"
                            >
                              Sell
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Positions Table */}
      {activeTab === 'POSITIONS' && (
        positions.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-text-main/50 border border-border border-dashed rounded-xl p-12">
            <Briefcase size={40} className="mb-4 opacity-20" />
            <p className="text-center">You don't have any open POSITIONS for intra-day trades.<br/>Place a trade from the terminal to see it here.</p>
          </div>
        ) : (
          <div className="flex-1 bg-surface border border-border rounded-xl flex flex-col relative overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="border-b border-border bg-background/50 text-text-main/70 text-xs uppercase tracking-wider">
                    <th className="p-4 font-medium">Instrument</th>
                    <th className="p-4 font-medium text-center">Type</th>
                    <th className="p-4 font-medium text-right">Qty.</th>
                    <th className="p-4 font-medium text-right">Price</th>
                    <th className="p-4 font-medium text-right">Value</th>
                    <th className="p-4 font-medium text-center">Status</th>
                    <th className="p-4 font-medium text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {positions.map((pos) => {
                    const marketStock = marketData.find(m => m.symbol === pos.symbol);
                    return (
                      <tr key={pos._id} className="hover:bg-border/30 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-text-main">{pos.symbol}</div>
                          <div className="text-xs text-text-main/60 mt-0.5">{marketStock?.name || pos.symbol}</div>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${pos.type === 'BUY' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                            {pos.type}
                          </span>
                        </td>
                        <td className="p-4 text-right text-text-main tabular-nums">{pos.quantity}</td>
                        <td className="p-4 text-right text-text-main tabular-nums">₹{pos.price.toFixed(2)}</td>
                        <td className="p-4 text-right text-text-main tabular-nums">₹{(pos.quantity * pos.price).toFixed(2)}</td>
                        <td className="p-4 text-center">
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary">
                            {pos.status}
                          </span>
                        </td>
                        <td className="p-4 text-right text-text-main/60 text-sm tabular-nums">
                          {new Date(pos.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

    </div>
  );
};

export default Portfolio;
