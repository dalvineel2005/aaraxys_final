import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const MarketContext = createContext();

export const useMarketData = () => useContext(MarketContext);

export const MarketProvider = ({ children }) => {
  const [marketData, setMarketData] = useState([]);
  const [activeStock, setActiveStock] = useState(null);

  useEffect(() => {
    // Connect to the backend socket server
    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');

    socket.on('connect', () => {
      console.log('Connected to market data stream');
    });

    socket.on('market_update', (data) => {
      setMarketData(data);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from market data stream');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <MarketContext.Provider value={{ marketData, activeStock, setActiveStock }}>
      {children}
    </MarketContext.Provider>
  );
};

