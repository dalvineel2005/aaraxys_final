import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Orders = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('ALL');
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const filteredOrders = activeTab === 'ALL' 
    ? orders 
    : orders.filter(o => o.status === activeTab);

  const StatusBadge = ({ status }) => {
    switch(status) {
      case 'EXECUTED': return <span className="flex items-center gap-1.5 text-success text-xs font-medium"><CheckCircle2 size={14}/> Executed</span>;
      case 'PENDING': return <span className="flex items-center gap-1.5 text-primary text-xs font-medium animate-pulse"><Clock size={14}/> Pending</span>;
      case 'CANCELLED': 
      case 'REJECTED': return <span className="flex items-center gap-1.5 text-danger text-xs font-medium"><XCircle size={14}/> {status.charAt(0) + status.slice(1).toLowerCase()}</span>;
      default: return null;
    }
  };

  const formatTime = (isoString) => {
    return new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date(isoString));
  };

  return (
    <div className="p-6 h-full flex flex-col animate-in fade-in duration-500 max-w-7xl mx-auto w-full">
      <div className="mb-6 flex justify-between items-end">
        <div>
           <h1 className="text-2xl font-bold text-text-main tracking-tight">Orders</h1>
           <p className="text-text-main/60 mt-1">View and manage your recent orders.</p>
        </div>
        <button onClick={fetchOrders} disabled={isLoading} className="mb-1 text-text-main/40 hover:text-text-main transition-colors p-2 bg-surface hover:bg-border rounded-lg border border-border">
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="flex gap-4 border-b border-border/50 mb-6 font-medium text-sm">
         {['ALL', 'PENDING', 'EXECUTED', 'CANCELLED', 'REJECTED'].map(tab => {
           const count = orders.filter(o => tab === 'ALL' ? true : o.status === tab).length;
           return (
           <button 
             key={tab}
             onClick={() => setActiveTab(tab)} 
             className={`pb-3 border-b-2 transition-all capitalize ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-text-main/60 hover:text-text-main'}`}
           >
             {tab.toLowerCase()} ({count})
           </button>
         )})}
      </div>

      <div className="flex-1 bg-surface border border-border rounded-xl overflow-hidden flex flex-col relative">
          
          {isLoading && (
            <div className="absolute inset-x-0 top-0 h-1 bg-primary/20 overflow-hidden">
               <div className="h-full bg-primary animate-pulse w-1/2 rounded"></div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="border-b border-border bg-background/50 text-text-main/70 text-xs uppercase tracking-wider">
                  <th className="p-4 font-medium">Time / ID</th>
                  <th className="p-4 font-medium">Instrument</th>
                  <th className="p-4 font-medium text-center">Type</th>
                  <th className="p-4 font-medium text-center">Product</th>
                  <th className="p-4 font-medium text-right">Qty.</th>
                  <th className="p-4 font-medium text-right">Avg. Price</th>
                  <th className="p-4 font-medium text-right">Status</th>
                  <th className="p-4 font-medium text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-border/30 transition-colors group">
                    <td className="p-4">
                      <div className="text-sm font-medium text-text-main">{formatTime(order.createdAt)}</div>
                      <div className="text-[10px] text-text-main/40 mt-0.5" title={order._id}>{order._id.substring(0, 8)}...</div>
                    </td>
                    <td className="p-4">
                       <span className="font-bold text-text-main">{order.symbol}</span>
                       <span className="text-[10px] bg-border px-1.5 py-0.5 rounded text-text-main/60 ml-2">NSE</span>
                    </td>
                    <td className="p-4 text-center">
                       <span className={`text-xs font-medium px-2 py-1 rounded-sm ${order.type === 'BUY' ? 'bg-primary/10 text-primary' : 'bg-danger/10 text-danger'}`}>
                         {order.type}
                       </span>
                    </td>
                    <td className="p-4 text-center">
                       <span className="text-xs text-text-main/60 bg-background border border-border/50 px-2 py-1 rounded">
                         {order.orderType || 'MARKET'}
                       </span>
                    </td>
                    <td className="p-4 text-right tabular-nums text-text-main">{order.quantity}/<span className="text-text-main/50">{order.quantity}</span></td>
                    <td className="p-4 text-right tabular-nums text-text-main">₹{order.price.toFixed(2)}</td>
                    <td className="p-4 text-right flex justify-end">
                       <StatusBadge status={order.status} />
                    </td>
                    <td className="p-4 text-center">
                       {order.status === 'PENDING' ? (
                         <button className="text-xs text-text-main bg-background border border-border px-3 py-1.5 rounded hover:bg-border transition-colors">
                           Cancel
                         </button>
                       ) : (
                         <span className="text-xs text-text-main/30">-</span>
                       )}
                    </td>
                  </tr>
                ))}
                
                {filteredOrders.length === 0 && !isLoading && (
                  <tr>
                    <td colSpan="8" className="p-8 text-center text-text-main/50">
                       {!user ? 'Log in to view your orders.' : `No ${activeTab !== 'ALL' ? activeTab.toLowerCase() : ''} orders found.`}
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

export default Orders;
