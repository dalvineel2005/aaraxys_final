import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { MarketProvider } from './context/MarketContext';
import { ToastProvider } from './context/ToastContext';
import { OrderProvider } from './context/OrderContext';
import { AuthProvider } from './context/AuthContext'; // Added AuthProvider import
import DashboardLayout from './components/Layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Markets from './pages/Markets';
import TradingTerminal from './pages/TradingTerminal';
import Portfolio from './pages/Portfolio';
import Orders from './pages/Orders';
import Funds from './pages/Funds';
import Profile from './pages/Profile';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Contact from './pages/Contact';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

function App() {
  return (
    <ThemeProvider>
      <MarketProvider>
        <ToastProvider>
          <AuthProvider>
            <OrderProvider>
              <Router>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Landing />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/contact" element={<Contact />} />

                  {/* Dashboard Routes wrapper */}
                  <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/markets" element={<Markets />} />
                    <Route path="/trade" element={<TradingTerminal />} />
                    <Route path="/portfolio" element={<Portfolio />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/funds" element={<Funds />} />
                    <Route path="/profile" element={<Profile />} />
                  </Route>
                </Routes>
              </Router>
            </OrderProvider>
          </AuthProvider>
        </ToastProvider>
      </MarketProvider>
    </ThemeProvider>
  );
}

export default App;
