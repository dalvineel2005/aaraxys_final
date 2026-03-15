import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto dismiss
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ToastCard = ({ toast, onDismiss }) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success': return <CheckCircle2 size={20} className="text-success" />;
      case 'error': return <XCircle size={20} className="text-danger" />;
      case 'warning': return <AlertCircle size={20} className="text-orange-500" />;
      default: return <Info size={20} className="text-primary" />;
    }
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-4 min-w-[300px] flex items-start gap-3 pointer-events-auto animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="mt-0.5">{getIcon()}</div>
      <div className="flex-1">
        <p className="text-sm font-medium text-text-main leading-tight">{toast.message}</p>
      </div>
      <button 
        onClick={onDismiss}
        className="text-text-main/40 hover:text-text-main/80 transition-colors p-0.5"
      >
        <X size={16} />
      </button>
    </div>
  );
};
