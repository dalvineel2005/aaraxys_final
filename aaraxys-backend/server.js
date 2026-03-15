import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // allow frontend access
    methods: ["GET", "POST"]
  }
});

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/user', userRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Aaraxys API is running...');
});

// Socket.io market simulation
const initialSymbols = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 175.40, change: 1.2, changePercent: 0.69, tags: ['WL 1', 'Tech'] },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 330.15, change: -2.3, changePercent: -0.69, tags: ['WL 1', 'Tech'] },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 215.30, change: 5.4, changePercent: 2.57, tags: ['WL 2', 'Holdings'] },
  { symbol: 'AMZN', name: 'Amazon.com', price: 135.20, change: 0.8, changePercent: 0.60, tags: ['WL 2', 'Tech'] },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 132.50, change: -0.4, changePercent: -0.30, tags: ['WL 1', 'Tech'] },
  { symbol: 'META', name: 'Meta Platforms', price: 305.10, change: 3.2, changePercent: 1.06, tags: ['WL 2', 'Tech'] },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 450.80, change: 12.5, changePercent: 2.85, tags: ['Holdings', 'Tech'] },
  { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2950.20, change: 15.5, changePercent: 0.52, tags: ['Nifty 50', 'Holdings'] },
  { symbol: 'TCS', name: 'Tata Consultancy Services', price: 4120.50, change: -20.1, changePercent: -0.48, tags: ['Nifty 50', 'Tech'] },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1445.60, change: 5.2, changePercent: 0.36, tags: ['Nifty 50'] },
  { symbol: 'INFY', name: 'Infosys Ltd.', price: 1650.30, change: 12.4, changePercent: 0.75, tags: ['Nifty 50', 'Tech', 'WL 1'] },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', price: 1080.40, change: 8.5, changePercent: 0.78, tags: ['Nifty 50'] },
  { symbol: 'SBIN', name: 'State Bank of India', price: 740.20, change: -3.5, changePercent: -0.47, tags: ['Nifty 50', 'WL 2'] },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel', price: 1210.80, change: 18.2, changePercent: 1.50, tags: ['Nifty 50'] },
  { symbol: 'ITC', name: 'ITC Ltd.', price: 410.50, change: 2.1, changePercent: 0.51, tags: ['Nifty 50', 'Holdings'] },
];

let marketData = [...initialSymbols];

setInterval(() => {
  marketData = marketData.map((stock) => {
    const fluctuation = (Math.random() - 0.5) * 1.5;
    const newPrice = Math.max(0.01, stock.price + fluctuation);
    const priceDiff = newPrice - stock.price;
    const newChange = stock.change + priceDiff;
    const basePrice = stock.price - stock.change;
    const newChangePercent = (newChange / basePrice) * 100;

    return {
      ...stock,
      price: Number(newPrice.toFixed(2)),
      change: Number(newChange.toFixed(2)),
      changePercent: Number(newChangePercent.toFixed(2)),
      direction: priceDiff > 0 ? 'up' : priceDiff < 0 ? 'down' : 'flat'
    };
  });
  io.emit('market_update', marketData);
}, 2000);

io.on('connection', (socket) => {
  console.log('Client connected to socket:', socket.id);
  // Send immediate data on connect
  socket.emit('market_update', marketData);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
