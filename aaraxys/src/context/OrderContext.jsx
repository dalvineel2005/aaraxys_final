import React, { createContext, useContext, useState } from 'react';
import OrderModal from '../components/OrderModal';

const OrderContext = createContext();

export const useOrder = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [orderStock, setOrderStock] = useState(null);
  const [orderType, setOrderType] = useState('BUY');

  const openOrderModal = (stock, type = 'BUY') => {
    setOrderStock(stock);
    setOrderType(type);
    setIsOpen(true);
  };

  const closeOrderModal = () => {
    setIsOpen(false);
    setTimeout(() => {
      setOrderStock(null);
    }, 300); // Wait for exit animation
  };

  return (
    <OrderContext.Provider value={{ openOrderModal, closeOrderModal }}>
      {children}
      <OrderModal 
        isOpen={isOpen} 
        onClose={closeOrderModal} 
        stock={orderStock} 
        type={orderType} 
      />
    </OrderContext.Provider>
  );
};
