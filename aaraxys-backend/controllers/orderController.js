import Order from '../models/Order.js';
import User from '../models/User.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const { symbol, type, quantity, price, orderType } = req.body;

    if (!symbol || !type || !quantity || !price) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Get user to check margin
    const user = await User.findById(req.user._id);
    const orderValue = quantity * price;

    if (type === 'BUY' && user.availableMargin < orderValue) {
      return res.status(400).json({ message: 'Insufficient margin for this trade' });
    }

    // In a real system, checking SELL requires checking current Holdings,
    // For this mock presentation, we assume sells are allowed (shorting/holding).
    if (type === 'SELL') {
      const pastOrders = await Order.find({ user: req.user._id, symbol, status: 'EXECUTED' });
      let holdings = 0;
      pastOrders.forEach(o => {
        if (o.type === 'BUY') holdings += o.quantity;
        else if (o.type === 'SELL') holdings -= o.quantity;
      });

      if (holdings < quantity) {
        return res.status(400).json({ message: 'Insufficient holdings to sell' });
      }
    }
    
    // Create the order
    const order = await Order.create({
      user: req.user._id,
      symbol,
      type,
      quantity,
      price,
      orderType: orderType || 'MARKET',
      status: 'EXECUTED' // Mocking immediate execution
    });

    // Deduct/Add Margin based on trade
    if (type === 'BUY') {
      user.availableMargin -= orderValue;
    } else if (type === 'SELL') {
      user.availableMargin += orderValue;
    }
    
    await user.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user portfolio (calculated from orders)
// @route   GET /api/portfolio
// @access  Private
export const getPortfolio = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id, status: 'EXECUTED' });
    
    const holdingsMap = new Map();

    orders.forEach(order => {
      const { symbol, type, quantity, price } = order;
      
      if (!holdingsMap.has(symbol)) {
        holdingsMap.set(symbol, { symbol, quantity: 0, totalCost: 0 });
      }

      const holding = holdingsMap.get(symbol);

      if (type === 'BUY') {
        holding.quantity += quantity;
        holding.totalCost += (quantity * price);
      } else if (type === 'SELL') {
        // Simplified FIFO / average cost reduction
        holding.quantity -= quantity;
        // In a real app we'd realize P&L here
        holding.totalCost -= (quantity * price); 
      }
    });

    // Format output
    const portfolio = Array.from(holdingsMap.values())
      .filter(h => h.quantity > 0) // Only show active holdings
      .map(h => ({
        symbol: h.symbol,
        quantity: h.quantity,
        avgPrice: h.totalCost / h.quantity
      }));

    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
