import React, { useState, useEffect } from 'react';
import { useMarketData } from '../context/MarketContext';
import { useAuth } from '../context/AuthContext';
import StockCard from '../components/StockCard';
import { Briefcase, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import api from '../services/api';

const Dashboard = () => {
  const { marketData } = useMarketData();
  const { user } = useAuth();

  const [apiHoldings, setApiHoldings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        if (user) {
          const { data } = await api.get('/orders/portfolio');
          setApiHoldings(data);
        }
      } catch (error) {
        console.error('Failed to fetch portfolio', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPortfolio();
  }, [user]);

  const holdings = apiHoldings.map(h => {
    const marketStock = marketData.find(m => m.symbol === h.symbol) || { price: h.avgPrice };
    return { qty: h.quantity, avgCost: h.avgPrice, price: marketStock.price };
  });

  const totalCurrent = holdings.reduce((acc, h) => acc + (h.qty * h.price), 0);
  const totalInvested = holdings.reduce((acc, h) => acc + (h.qty * h.avgCost), 0);
  const totalPnL = totalCurrent - totalInvested;
  const pnlPercent = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

  // Overview stats
  const stats = [
    { 
       label: 'Portfolio Value', 
       value: isLoading ? '...' : `₹${totalCurrent.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
       change: isLoading ? '...' : 'Live', 
       isPositive: true, 
       icon: <Briefcase size={20} className="text-primary" /> 
    },
    { 
       label: 'Total P&L', 
       value: isLoading ? '...' : `₹${Math.abs(totalPnL).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
       change: isLoading ? '...' : `${pnlPercent >= 0 ? '+' : ''}${pnlPercent.toFixed(2)}%`, 
       isPositive: totalPnL >= 0, 
       icon: totalPnL >= 0 ? <ArrowUpRight size={20} className="text-success" /> : <ArrowDownRight size={20} className="text-danger" /> 
    },
    { 
       label: 'Available Margin', 
       value: user ? `₹${user.availableMargin.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '₹0.00', 
       change: 'Cash', 
       isPositive: true, 
       icon: <Activity size={20} className="text-text-main/60" /> 
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header section */}
      <div>
        <h1 className="text-2xl font-bold text-text-main tracking-tight">Welcome back, {user ? user.name.split(' ')[0] : 'Trader'}</h1>
        <p className="text-text-main/60 mt-1">Here's your market overview for today.</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-surface p-6 rounded-xl border border-border flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-text-main/60">{stat.label}</p>
              <h2 className="text-2xl font-bold mt-2 text-text-main tabular-nums">{stat.value}</h2>
              <div className={`flex items-center mt-2 text-sm font-medium ${stat.isPositive ? 'text-success' : 'text-danger'}`}>
                {stat.isPositive ? <ArrowUpRight size={16} className="mr-1" /> : <ArrowDownRight size={16} className="mr-1" />}
                {stat.change}
              </div>
            </div>
            <div className="p-3 bg-background rounded-lg border border-border/50">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Market Movers Grid */}
      <div>
         <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-text-main flex items-center gap-2">
               <Activity size={20} className="text-primary" />
               Market Movers
            </h2>
            <button className="text-sm text-primary hover:text-primary-hover font-medium transition-colors">View All Market</button>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketData.slice(0, 6).map((stock) => (
              <StockCard key={stock.symbol} stock={stock} />
            ))}
         </div>
      </div>
      
    </div>
  );
};

export default Dashboard;
