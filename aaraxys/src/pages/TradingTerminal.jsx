import React, { useState } from 'react';
import { useMarketData } from '../context/MarketContext';
import { useOrder } from '../context/OrderContext';
import { Line } from 'react-chartjs-2';
import { Maximize2, Activity, ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';

const TradingTerminal = () => {
  const { marketData, activeStock, setActiveStock } = useMarketData();
  const { openOrderModal } = useOrder();
  
  const [timeframe, setTimeframe] = useState('1D');
  const [orderType, setOrderType] = useState('Regular');
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Generating a realistic looking dummy chart
  const [dummyLabels, setDummyLabels] = useState([]);
  const [dummyDataPoints, setDummyDataPoints] = useState([]);

  React.useEffect(() => {
     let price = activeStock?.price || 100;
     let dataLength = 60;
     let volatility = 2;

     switch(timeframe) {
       case '1W': dataLength = 70; volatility = 5; break;
       case '1M': dataLength = 30; volatility = 10; break;
       case '3M': dataLength = 90; volatility = 15; break;
       case '1Y': dataLength = 120; volatility = 25; break;
       case 'ALL': dataLength = 240; volatility = 40; break;
       case '1D': default: dataLength = 60; volatility = 2; break;
     }

     const points = Array.from({length: dataLength}, () => {
       price = price + (Math.random() - 0.5) * volatility;
       return price;
     });
     
     const labels = Array.from({length: dataLength}, (_, i) => {
        if (timeframe === '1D') return `${Math.floor(i/60) + 9}:${(i%60).toString().padStart(2, '0')}`;
        return `T-${dataLength - i}`;
     });

     setDummyDataPoints(points);
     setDummyLabels(labels);
  }, [activeStock?.symbol, activeStock?.price, timeframe]);

  const chartData = {
    labels: dummyLabels,
    datasets: [
      {
        label: 'Price',
        data: dummyDataPoints,
        borderColor: '#2563eb', // primary
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, 'rgba(37, 99, 235, 0.4)');
          gradient.addColorStop(1, 'rgba(37, 99, 235, 0.0)');
          return gradient;
        },
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 4,
        tension: 0.1,
        borderWidth: 2,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(17, 24, 39, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
      }
    },
    scales: {
      x: { 
        grid: { color: 'rgba(156, 163, 175, 0.1)' },
        ticks: { maxTicksLimit: 6, color: 'rgba(156, 163, 175, 0.7)' }
      },
      y: {
        position: 'right',
        grid: { color: 'rgba(156, 163, 175, 0.1)' },
        ticks: { color: 'rgba(156, 163, 175, 0.7)' }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
  };

  const currentPrice = activeStock?.price || 0;
  const isUp = (activeStock?.change || 0) >= 0;

  return (
    <div className="h-full flex flex-col p-4 md:p-6 animate-in fade-in duration-500 max-w-[1600px] mx-auto w-full">
      
      {/* Top Header */}
      {activeStock && (
        <div className="bg-surface border border-border rounded-xl p-4 sm:p-5 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setActiveStock(null)}
               className="p-2 bg-border/40 hover:bg-border rounded-lg text-text-main transition-colors mr-2"
               title="Back to Grid"
             >
                <ArrowLeft size={20} />
             </button>
             <div>
                <h1 className="text-2xl font-bold text-text-main flex items-center gap-2">
                   {activeStock.symbol}
                   <span className="text-xs bg-border px-2 py-0.5 rounded-full text-text-main/70 font-normal">NSE</span>
                </h1>
                <p className="text-sm text-text-main/60 mt-0.5">{activeStock.name}</p>
             </div>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="text-right">
                <p className={`text-2xl font-bold tabular-nums tracking-tight ${activeStock.direction === 'up' ? 'text-success animate-pulse' : activeStock.direction === 'down' ? 'text-danger animate-pulse' : 'text-text-main'}`}>
                  ₹{currentPrice.toFixed(2)}
                </p>
                <p className={`text-sm font-medium tabular-nums ${isUp ? 'text-success' : 'text-danger'}`}>
                  {isUp ? '+' : ''}{activeStock.change.toFixed(2)} ({isUp ? '+' : ''}{activeStock.changePercent.toFixed(2)}%)
                </p>
             </div>
             
             <div className="hidden sm:flex items-center gap-3 border-l border-border pl-6">
                <button 
                  onClick={() => openOrderModal(activeStock, 'BUY')}
                  className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors"
                >
                  Buy
                </button>
                <button 
                  onClick={() => openOrderModal(activeStock, 'SELL')}
                  className="px-6 py-2 bg-danger text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Sell
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {activeStock ? (
         <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0 animate-in fade-in duration-300">
            {/* Chart Section */}
            <div className={`flex-1 bg-surface border border-border rounded-xl flex flex-col min-h-[400px] ${isFullscreen ? 'fixed inset-4 z-50 shadow-2xl bg-background' : ''}`}>
               <div className="p-3 border-b border-border flex justify-between items-center bg-background/50 rounded-t-xl">
                  <div className="flex gap-2">
                     {['1D', '1W', '1M', '3M', '1Y', 'ALL'].map(tf => (
                       <button 
                         key={tf} 
                         onClick={() => setTimeframe(tf)}
                         className={`px-2 py-1 text-xs font-medium rounded transition-colors ${timeframe === tf ? 'bg-primary/10 text-primary' : 'text-text-main/60 hover:bg-border/50 hover:text-text-main'}`}>
                         {tf}
                       </button>
                     ))}
                  </div>
                  <div className="flex gap-2">
                    <button className="p-1.5 text-text-main/60 hover:text-text-main hover:bg-border/50 rounded transition-colors" title="Indicators">
                       <Activity size={16} />
                    </button>
                    <button 
                       onClick={() => setIsFullscreen(!isFullscreen)}
                       className={`p-1.5 rounded transition-colors ${isFullscreen ? 'bg-primary/10 text-primary' : 'text-text-main/60 hover:text-text-main hover:bg-border/50'}`} 
                       title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                    >
                       <Maximize2 size={16} />
                    </button>
                  </div>
               </div>
               <div className="flex-1 p-4 relative w-full h-full">
                  <Line data={chartData} options={chartOptions} />
               </div>
            </div>

            {/* Right Panel (Order Panel replica for large screens) */}
            <div className="w-full lg:w-80 bg-surface border border-border rounded-xl p-5 flex flex-col h-full hidden xl:flex">
               <h3 className="font-bold text-text-main mb-4 pb-4 border-b border-border">Quick Order</h3>
               
               <div className="space-y-4 flex-1">
                  {/* Simplified embedded order form */}
                  <div className="bg-background rounded-lg p-1 flex">
                    <button 
                       onClick={() => setOrderType('Regular')}
                       className={`flex-1 py-1.5 rounded text-sm font-medium transition-colors ${orderType === 'Regular' ? 'bg-surface text-text-main border-border border' : 'text-text-main/60 hover:text-text-main'}`}
                    >
                       Regular
                    </button>
                    <button 
                       onClick={() => setOrderType('AMO')}
                       className={`flex-1 py-1.5 rounded text-sm font-medium transition-colors ${orderType === 'AMO' ? 'bg-surface text-text-main border-border border' : 'text-text-main/60 hover:text-text-main'}`}
                    >
                       AMO
                    </button>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-text-main/70 mb-1.5">Quantity</label>
                    <input type="number" defaultValue="1" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-text-main focus:outline-none focus:border-primary" />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-text-main/70 mb-1.5">Price</label>
                    <input type="number" defaultValue={currentPrice.toFixed(2)} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-text-main focus:outline-none focus:border-primary" />
                  </div>
                  
                  <div className="mt-8 flex gap-3">
                    <button onClick={() => openOrderModal(activeStock, 'BUY')} className="flex-1 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary-hover transition-colors">BUY</button>
                    <button onClick={() => openOrderModal(activeStock, 'SELL')} className="flex-1 py-3 bg-danger text-white rounded-lg font-bold hover:bg-red-700 transition-colors">SELL</button>
                  </div>
               </div>
            </div>
         </div>
      ) : (
         /* Stock Grid View */
         <div className="flex-1 overflow-y-auto pr-2">
            <h2 className="text-xl font-bold text-text-main mb-6">Market Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-10">
               {marketData.map((stock) => {
                  const isStockUp = stock.change >= 0;
                  return (
                     <div 
                        key={stock.symbol}
                        onClick={() => setActiveStock(stock)}
                        className="bg-surface border border-border rounded-xl p-5 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 cursor-pointer transition-all group"
                     >
                        <div className="flex justify-between items-start mb-4">
                           <div>
                              <h3 className="text-lg font-bold text-text-main flex items-center gap-2 group-hover:text-primary transition-colors">
                                 {stock.symbol}
                              </h3>
                              <p className="text-xs text-text-main/50 truncate max-w-[140px] mt-0.5">{stock.name}</p>
                           </div>
                           <div className={`p-2 rounded-lg ${isStockUp ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                              {isStockUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                           </div>
                        </div>
                        
                        <div className="flex items-end justify-between mt-6">
                           <div>
                              <p className="text-xs text-text-main/50 mb-1">Current Price</p>
                              <p className={`text-2xl font-bold tabular-nums tracking-tight ${stock.direction === 'up' ? 'text-success animate-pulse' : stock.direction === 'down' ? 'text-danger animate-pulse' : 'text-text-main'}`}>
                                 ₹{stock.price.toFixed(2)}
                              </p>
                           </div>
                           <div className="text-right">
                              <p className={`text-sm font-medium tabular-nums ${isStockUp ? 'text-success' : 'text-danger'}`}>
                                 {isStockUp ? '+' : ''}{stock.change.toFixed(2)}
                              </p>
                              <p className={`text-xs tabular-nums mt-0.5 ${isStockUp ? 'text-success/80' : 'text-danger/80'}`}>
                                 ({isStockUp ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                              </p>
                           </div>
                        </div>
                        
                        {/* Quick action overlay on hover */}
                        <div className="mt-4 pt-4 border-t border-border opacity-0 group-hover:opacity-100 flex gap-2 transition-opacity duration-200">
                           <button 
                             onClick={(e) => { e.stopPropagation(); openOrderModal(stock, 'BUY'); }}
                             className="flex-1 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded text-xs font-semibold transition-colors"
                           >
                              BUY
                           </button>
                           <button 
                             onClick={(e) => { e.stopPropagation(); openOrderModal(stock, 'SELL'); }}
                             className="flex-1 py-1.5 bg-danger/10 text-danger hover:bg-danger hover:text-white rounded text-xs font-semibold transition-colors"
                           >
                              SELL
                           </button>
                        </div>
                     </div>
                  );
               })}
            </div>
         </div>
      )}
    </div>
  );
};

export default TradingTerminal;
