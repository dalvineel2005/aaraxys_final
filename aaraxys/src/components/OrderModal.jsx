import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const OrderModal = ({ isOpen, onClose, stock, type = 'BUY' }) => {
  const { user, refreshProfile } = useAuth();
  // Safe default values for initial render when stock might be null
  const [quantity, setQuantity] = useState(1);
  const [orderType, setOrderType] = useState('MARKET'); // MARKET / LIMIT
  const [limitPrice, setLimitPrice] = useState(stock ? stock.price : 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();
  
  // Early return must be AFTER hooks
  if (!isOpen || !stock) return null;
  
  const isBuy = type === 'BUY';
  const total = quantity * (orderType === 'MARKET' ? stock.price : limitPrice);

  const handleSubmit = async () => {
    if (!user) {
       addToast('Please login to place an order', 'error');
       return;
    }

    if (isBuy && total > user.availableMargin) {
       addToast('Insufficient margin for this trade', 'error');
       return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/orders', {
        symbol: stock.symbol,
        type,
        quantity,
        price: orderType === 'MARKET' ? stock.price : limitPrice,
        orderType
      });
      
      addToast(`${type} order placed for ${quantity} ${stock.symbol}`, 'success');
      refreshProfile(); // Refresh available margin
      onClose();
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to place order', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      
      <div className="bg-surface border border-border rounded-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className={`p-4 border-b border-border text-white flex justify-between items-center ${isBuy ? 'bg-primary' : 'bg-danger'}`}>
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              {type} {stock.symbol} 
              <span className="text-xs bg-black/20 px-1.5 py-0.5 rounded font-normal">NSE</span>
            </h3>
            <p className="text-sm opacity-90 mt-0.5">₹{stock.price.toFixed(2)} x 1 Qty</p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        
        {/* Body */}
        <div className="p-5 space-y-5">
           
           {/* Order Options */}
           <div className="flex p-1 bg-background rounded-lg border border-border/50">
             <button
               onClick={() => setOrderType('MARKET')}
               className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${orderType === 'MARKET' ? 'bg-surface text-text-main' : 'text-text-main/60 hover:text-text-main'}`}
             >
               Market
             </button>
             <button
               onClick={() => setOrderType('LIMIT')}
               className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${orderType === 'LIMIT' ? 'bg-surface text-text-main' : 'text-text-main/60 hover:text-text-main'}`}
             >
               Limit
             </button>
           </div>
           
           <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-xs font-medium text-text-main/70 mb-1.5">Quantity</label>
               <input 
                 type="number" 
                 min="1"
                 value={quantity}
                 onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                 className="w-full bg-background border border-border rounded-lg px-3 py-2 text-text-main focus:outline-none focus:border-primary transition-colors"
               />
             </div>
             <div>
               <label className="block text-xs font-medium text-text-main/70 mb-1.5">Price</label>
               <input 
                 type="number"
                 step="0.05"
                 value={orderType === 'MARKET' ? stock.price.toFixed(2) : limitPrice}
                 onChange={(e) => setLimitPrice(parseFloat(e.target.value))}
                 disabled={orderType === 'MARKET'}
                 className="w-full bg-background border border-border rounded-lg px-3 py-2 text-text-main focus:outline-none focus:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
               />
             </div>
           </div>
           
           <div className="space-y-3 pt-2">
             <div className="flex justify-between text-sm">
                <span className="text-text-main/60">Total order value</span>
                <span className="font-medium text-text-main">₹{total.toFixed(2)}</span>
             </div>
             <div className="flex justify-between text-sm">
                <span className="text-text-main/60">Available margin</span>
                <span className="font-medium text-text-main">{user ? `₹${user.availableMargin.toFixed(2)}` : 'Login required'}</span>
             </div>
           </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-border bg-background/50 flex gap-3">
           <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-border text-text-main font-medium hover:bg-border/50 transition-colors">
              Cancel
           </button>
           <button 
             onClick={handleSubmit}
             disabled={isSubmitting || (!user)}
             className={`flex-1 py-2.5 rounded-lg text-white font-medium transition-colors ${isBuy ? 'bg-primary hover:bg-primary-hover' : 'bg-danger hover:bg-red-700'} disabled:opacity-50`}
           >
              {isSubmitting ? 'Processing...' : type}
           </button>
        </div>

      </div>
    </div>
  );
};

export default OrderModal;
