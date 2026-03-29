import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js';
import marketRoutes from './routes/marketRoutes.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const httpServer = createServer(app);
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',')
  : ['http://localhost:5173', 'http://localhost:3000'];

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/user', userRoutes);
app.use('/api/market', marketRoutes);

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
  { symbol: 'WIPRO', name: 'Wipro Ltd.', price: 480.15, change: 2.3, changePercent: 0.48, tags: ['Tech', 'Nifty 50'] },
  { symbol: 'HCLTECH', name: 'HCL Technologies', price: 1515.30, change: -5.4, changePercent: -0.35, tags: ['Tech', 'Nifty 50'] },
  { symbol: 'ASIANPAINT', name: 'Asian Paints', price: 2850.40, change: 12.5, changePercent: 0.44, tags: ['Nifty 50'] },
  { symbol: 'MARUTI', name: 'Maruti Suzuki', price: 11500.00, change: 250.0, changePercent: 2.22, tags: ['Nifty 50'] },
  { symbol: 'TATAMOTORS', name: 'Tata Motors', price: 950.25, change: 15.3, changePercent: 1.63, tags: ['Nifty 50', 'Holdings'] },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance', price: 6500.80, change: -45.0, changePercent: -0.68, tags: ['Nifty 50'] },
  { symbol: 'LT', name: 'Larsen & Toubro', price: 3450.20, change: 30.5, changePercent: 0.89, tags: ['Nifty 50'] },
  { symbol: 'ADANIENT', name: 'Adani Enterprises', price: 3120.45, change: 55.2, changePercent: 1.80, tags: ['Nifty 50'] },
  { symbol: 'SUNPHARMA', name: 'Sun Pharma', price: 1550.00, change: 10.4, changePercent: 0.68, tags: ['Nifty 50', 'WL 2'] },
  { symbol: 'NTPC', name: 'NTPC Ltd.', price: 345.60, change: 2.1, changePercent: 0.61, tags: ['Nifty 50'] },
  { symbol: 'ONGC', name: 'ONGC', price: 265.40, change: -1.5, changePercent: -0.56, tags: ['Nifty 50'] },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', price: 1750.20, change: 12.3, changePercent: 0.71, tags: ['Nifty 50'] },
  { symbol: 'AXISBANK', name: 'Axis Bank Ltd.', price: 1050.45, change: 5.6, changePercent: 0.54, tags: ['Nifty 50'] },
  { symbol: 'TITAN', name: 'Titan Company', price: 3650.00, change: -15.2, changePercent: -0.41, tags: ['Nifty 50', 'WL 1'] },
  { symbol: 'ULTRACEMCO', name: 'UltraTech Cement', price: 9800.50, change: 120.4, changePercent: 1.24, tags: ['Nifty 50'] },
  { symbol: 'JSWSTEEL', name: 'JSW Steel', price: 820.30, change: 8.5, changePercent: 1.05, tags: ['Nifty 50'] },
  { symbol: 'GRASIM', name: 'Grasim Industries', price: 2150.15, change: 12.6, changePercent: 0.59, tags: ['Nifty 50'] },
  { symbol: 'HINDALCO', name: 'Hindalco Industries', price: 540.25, change: -3.4, changePercent: -0.63, tags: ['Nifty 50'] },
  { symbol: 'BRITANNIA', name: 'Britannia Industries', price: 4950.40, change: 25.6, changePercent: 0.52, tags: ['Nifty 50'] },
  { symbol: 'NESTLEIND', name: 'Nestle India', price: 2550.80, change: 45.2, changePercent: 1.80, tags: ['Nifty 50'] },
  { symbol: 'BAJAJ-AUTO', name: 'Bajaj Auto', price: 8250.00, change: -150.0, changePercent: -1.78, tags: ['Nifty 50'] },
  { symbol: 'ADANIPORTS', name: 'Adani Ports', price: 1280.45, change: 12.3, changePercent: 0.97, tags: ['Nifty 50'] },
  { symbol: 'COALINDIA', name: 'Coal India', price: 445.60, change: 5.2, changePercent: 1.18, tags: ['Nifty 50'] },
  { symbol: 'TATASTEEL', name: 'Tata Steel', price: 145.20, change: 2.3, changePercent: 1.61, tags: ['Nifty 50', 'WL 2'] },
  { symbol: 'POWERGRID', name: 'Power Grid Corp.', price: 285.40, change: 1.5, changePercent: 0.53, tags: ['Nifty 50'] },
  { symbol: 'M&M', name: 'Mahindra & Mahindra', price: 1850.25, change: 12.4, changePercent: 0.67, tags: ['Nifty 50', 'Holdings'] },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', price: 2450.60, change: -15.4, changePercent: -0.62, tags: ['Nifty 50'] },
  { symbol: 'INDUSINDBK', name: 'IndusInd Bank', price: 1480.30, change: 8.5, changePercent: 0.58, tags: ['Nifty 50'] },
  { symbol: 'BAJAJFINSV', name: 'Bajaj Finserv', price: 1580.45, change: 12.6, changePercent: 0.80, tags: ['Nifty 50'] },
  { symbol: 'CIPLA', name: 'Cipla Ltd.', price: 1450.20, change: 5.4, changePercent: 0.37, tags: ['Nifty 50'] },
  { symbol: 'DIVISLAB', name: 'Divi\'s Laboratories', price: 3450.80, change: -25.0, changePercent: -0.72, tags: ['Nifty 50'] },
  { symbol: 'DRREDDY', name: 'Dr. Reddy\'s Labs', price: 6250.40, change: 45.2, changePercent: 0.73, tags: ['Nifty 50'] },
  { symbol: 'APOLLOHOSP', name: 'Apollo Hospitals', price: 6150.25, change: 85.6, changePercent: 1.41, tags: ['Nifty 50'] },
  { symbol: 'EICHERMOT', name: 'Eicher Motors', price: 3850.60, change: 12.4, changePercent: 0.32, tags: ['Nifty 50'] },
  { symbol: 'BPCL', name: 'Bharat Petroleum', price: 585.40, change: -5.2, changePercent: -0.88, tags: ['Nifty 50'] },
  { symbol: 'SBILIFE', name: 'SBI Life Insurance', price: 1480.20, change: 10.5, changePercent: 0.71, tags: ['Nifty 50'] },
  { symbol: 'HEROMOTOCO', name: 'Hero MotoCorp', price: 4450.45, change: 35.6, changePercent: 0.81, tags: ['Nifty 50'] },
  { symbol: 'LTIM', name: 'LTIMindtree Ltd.', price: 5150.80, change: -45.2, changePercent: -0.87, tags: ['Tech', 'Nifty 50'] },
];

let marketData = [...initialSymbols];

const usStocks = ['AAPL', 'MSFT', 'TSLA', 'AMZN', 'GOOGL', 'META', 'NVDA', 'LTIM'];
const finnhubKey = process.env.FINNHUB_API_KEY;
const avKey = process.env.ALPHAVANTAGE_API_KEY;
let currentUpdateIndex = 0;

// Hybrid Strategy: Fetch 1 stock roughly every 1.1s to respect Finnhub's 60/min limit
setInterval(async () => {
  if (!finnhubKey || finnhubKey === 'your_finnhub_api_key_here') return;

  const stockIndex = currentUpdateIndex % marketData.length;
  const stock = marketData[stockIndex];
  // Map Indian NSE stocks using .NS suffix for Yahoo/Finnhub format
  let querySymbol = usStocks.includes(stock.symbol) ? stock.symbol : `${stock.symbol}.NS`;
  
  let priceUpdated = false;

  try {
      // Primary API: Finnhub
      const fhRes = await fetch(`https://finnhub.io/api/v1/quote?symbol=${querySymbol}&token=${finnhubKey}`);
      if (fhRes.ok) {
          const data = await fhRes.json();
          // Check if data is valid (c is current price)
          if (data.c && data.c !== 0) {
             stock.price = data.c;
             stock.change = data.d;
             stock.changePercent = data.dp;
             stock.direction = data.d > 0 ? 'up' : data.d < 0 ? 'down' : 'flat';
             priceUpdated = true;
          }
      }
      
      // Backup API: Alpha Vantage 
      if (!priceUpdated && avKey && avKey !== 'your_alphavantage_api_key_here') {
           const avSymbol = usStocks.includes(stock.symbol) ? stock.symbol : `${stock.symbol}.BSE`; // AV often uses BSE for Indian
           const avRes = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${avSymbol}&apikey=${avKey}`);
           const avData = await avRes.json();
           const quote = avData['Global Quote'];
           
           if (quote && quote['05. price']) {
               const newPrice = parseFloat(quote['05. price']);
               const newChange = parseFloat(quote['09. change']);
               const newChangePercent = parseFloat(quote['10. change percent'].replace('%', ''));
               stock.price = newPrice;
               stock.change = newChange;
               stock.changePercent = newChangePercent;
               stock.direction = newChange > 0 ? 'up' : newChange < 0 ? 'down' : 'flat';
           }
      }

  } catch (e) {
      console.error(`Error fetching hybrid quote for ${stock.symbol}:`, e.message);
  }
  
  // Emit state to connected clients
  io.emit('market_update', marketData);
  
  currentUpdateIndex++;
}, 1100);

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
