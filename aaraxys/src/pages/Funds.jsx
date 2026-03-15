import React, { useState } from 'react';
import { Wallet, Plus, ArrowUpRight, ArrowDownRight, History } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

const Funds = () => {
  const { user, refreshProfile } = useAuth();
  const { addToast } = useToast();
  const [amount, setAmount] = useState('');
  const [action, setAction] = useState('DEPOSIT');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTransaction = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      addToast('Please enter a valid amount', 'warning');
      return;
    }

    if (action === 'WITHDRAW' && Number(amount) > (user?.availableMargin || 0)) {
      addToast('Insufficient funds for withdrawal', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      await api.post('/user/funds', { amount: Number(amount), action });
      addToast(`${action === 'DEPOSIT' ? 'Deposit' : 'Withdrawal'} successful!`, 'success');
      setAmount('');
      refreshProfile();
    } catch (error) {
      addToast(error.response?.data?.message || 'Transaction failed', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6 h-full flex flex-col animate-in fade-in duration-500 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-main tracking-tight flex items-center gap-2">
           <Wallet className="text-primary" /> Funds
        </h1>
        <p className="text-text-main/60 mt-1">Manage your account balance and margins.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Balance Overview */}
        <div className="col-span-1 lg:col-span-2 bg-surface border border-border rounded-xl p-6">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
              <div>
                 <p className="text-text-main/60 font-medium mb-1">Available Margin</p>
                 <div className="text-4xl font-bold text-primary tabular-nums tracking-tight">
                    {user ? `₹${user.availableMargin.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '₹0.00'}
                 </div>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                 <button onClick={() => setAction('DEPOSIT')} className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg font-medium transition-colors border ${action === 'DEPOSIT' ? 'bg-success text-white border-success' : 'bg-transparent text-text-main border-border hover:bg-border/50'}`}>
                   Add Funds
                 </button>
                 <button onClick={() => setAction('WITHDRAW')} className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg font-medium transition-colors border ${action === 'WITHDRAW' ? 'bg-primary text-white border-primary' : 'bg-transparent text-text-main border-border hover:bg-border/50'}`}>
                   Withdraw
                 </button>
              </div>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-border pt-6 mt-auto">
              <div>
                <p className="text-xs text-text-main/50 mb-1 rounded bg-background inline-block px-1">Opening Balance</p>
                <p className="font-medium text-text-main">{user ? `₹${user.availableMargin.toLocaleString('en-IN')}` : '₹0.00'}</p>
              </div>
              <div>
                <p className="text-xs text-text-main/50 mb-1 rounded bg-background inline-block px-1">Payin</p>
                <p className="font-medium text-text-main">₹0.00</p>
              </div>
              <div>
                <p className="text-xs text-text-main/50 mb-1 rounded bg-background inline-block px-1">Payout</p>
                <p className="font-medium text-text-main">₹0.00</p>
              </div>
              <div>
                <p className="text-xs text-text-main/50 mb-1 rounded bg-background inline-block px-1">Span Margin</p>
                <p className="font-medium text-text-main text-danger">₹0.00</p>
              </div>
           </div>
        </div>

        {/* Action Panel */}
        <div className="col-span-1 bg-surface border border-border rounded-xl p-6 flex flex-col">
           <h3 className="font-bold text-lg text-text-main mb-6 flex items-center gap-2">
              {action === 'DEPOSIT' ? <ArrowDownRight className="text-success" /> : <ArrowUpRight className="text-primary" />}
              {action === 'DEPOSIT' ? 'Deposit Funds' : 'Withdraw Funds'}
           </h3>
           
           <div className="flex-1 space-y-5">
             <div>
               <label className="block text-sm font-medium text-text-main/70 mb-2">Amount (₹)</label>
               <input 
                 type="number" 
                 value={amount}
                 onChange={(e) => setAmount(e.target.value)}
                 placeholder="Enter amount"
                 className="w-full bg-background border border-border rounded-lg px-4 py-3 text-lg text-text-main focus:outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary"
               />
               
               <div className="flex gap-2 mt-3">
                 {[1000, 5000, 10000].map(val => (
                   <button 
                     key={val} 
                     onClick={() => setAmount(val.toString())}
                     className="px-3 py-1 text-xs border border-border rounded-full hover:bg-border/40 text-text-main/70 transition-colors"
                   >
                     +₹{val}
                   </button>
                 ))}
               </div>
             </div>
             
             {action === 'DEPOSIT' && (
               <div className="space-y-3">
                 <p className="text-sm font-medium text-text-main/70">Payment Method</p>
                 <div className="p-3 border border-primary/30 bg-primary/5 rounded-lg flex items-center justify-between cursor-pointer">
                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 bg-white rounded flex items-center justify-center border border-border/50 text-xs font-bold text-blue-800">UPI</div>
                     <div>
                       <p className="text-sm font-medium text-text-main">UPI</p>
                       <p className="text-xs text-text-main/50">Instant • Zero fee</p>
                     </div>
                   </div>
                   <div className="w-4 h-4 rounded-full border-4 border-primary"></div>
                 </div>
                 <div className="p-3 border border-border rounded-lg flex items-center justify-between cursor-pointer hover:bg-border/30 transition-colors">
                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 bg-white rounded flex items-center justify-center border border-border/50 text-xs font-bold text-gray-800">NB</div>
                     <div>
                       <p className="text-sm font-medium text-text-main">Netbanking</p>
                       <p className="text-xs text-text-main/50">~10 mins • ₹9 fee</p>
                     </div>
                   </div>
                   <div className="w-4 h-4 rounded-full border border-border"></div>
                 </div>
               </div>
             )}
           </div>

           <button 
             onClick={handleTransaction}
             disabled={isProcessing || !user}
             className={`w-full py-3.5 mt-6 rounded-lg font-bold text-white transition-all ${action === 'DEPOSIT' ? 'bg-success hover:bg-green-700' : 'bg-primary hover:bg-primary-hover'} disabled:opacity-50`}
           >
              {isProcessing ? 'Processing...' : (action === 'DEPOSIT' ? 'Proceed to Pay' : 'Confirm Withdrawal')}
           </button>
        </div>

      </div>
    </div>
  );
};

export default Funds;
