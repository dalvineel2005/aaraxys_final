import React from 'react';
import MiniChart from './MiniChart';
import { useOrder } from '../context/OrderContext';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StockCard = ({ stock }) => {
  const isUp = stock.change >= 0;
  const { openOrderModal } = useOrder();
  
  // Generate random dummy historical data for the mini chart
  const historyData = Array.from({ length: 20 }, () => stock.price + (Math.random() - 0.5) * 5);

  return (
    <div className="bg-surface rounded-xl p-5 border border-border hover:border-primary/50 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-text-main group-hover:text-primary transition-colors">{stock.symbol}</h3>
          <p className="text-xs text-text-main/60 mt-0.5">{stock.name}</p>
        </div>
        <div className="text-right">
          <p className={`text-xl font-bold tabular-nums tracking-tight ${stock.direction === 'up' ? 'text-success animate-pulse' : stock.direction === 'down' ? 'text-danger animate-pulse' : 'text-text-main'}`}>
             ₹{stock.price.toFixed(2)}
          </p>
          <div className={`flex items-center justify-end font-medium text-sm mt-1 tabular-nums ${isUp ? 'text-success' : 'text-danger'}`}>
             {isUp ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
             <span>{Math.abs(stock.change).toFixed(2)} ({Math.abs(stock.changePercent).toFixed(2)}%)</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-end justify-between mt-6">
         <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => openOrderModal(stock, 'BUY')} className="px-5 py-1.5 bg-primary/10 text-primary font-medium rounded-lg hover:bg-primary hover:text-white transition-colors text-sm">Buy</button>
            <button onClick={() => openOrderModal(stock, 'SELL')} className="px-5 py-1.5 bg-danger/10 text-danger font-medium rounded-lg hover:bg-danger hover:text-white transition-colors text-sm">Sell</button>
         </div>
         <MiniChart data={historyData} color={isUp ? '#22c55e' : '#ef4444'} />
      </div>
    </div>
  );
};

export default StockCard;
