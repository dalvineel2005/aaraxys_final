import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TrendingUp, Shield, BarChart2, Activity, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Landing = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  const features = [
    { icon: <TrendingUp size={24} className="text-primary" />, title: 'Lightning Fast', desc: 'Execute trades in milliseconds. Never miss a market movement.' },
    { icon: <Shield size={24} className="text-primary" />, title: 'Bank-grade Security', desc: '256-bit encryption ensuring your funds and data are always secure.' },
    { icon: <BarChart2 size={24} className="text-primary" />, title: 'Advanced Charting', desc: 'Dozens of indicators and drawing tools for technical analysis.' },
  ];

  return (
    <div className="min-h-screen bg-background text-text-main flex flex-col font-sans transition-colors duration-300">
      
      {/* Navbar */}
      <nav className="h-20 border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-6 lg:px-12">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Aaraxys Logo" className="w-10 h-10 object-contain rounded-xl shadow-sm" />
          <span className="text-2xl font-bold tracking-tight">ARAYXS</span>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2 mr-2 rounded-full text-text-main/70 hover:bg-border/60 hover:text-text-main transition-all"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun size={20} strokeWidth={1.5} /> : <Moon size={20} strokeWidth={1.5} />}
          </button>
          
          <button onClick={() => navigate('/login')} className="px-5 py-2 hover:text-primary transition-colors">Login</button>
          <button onClick={() => navigate('/signup')} className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors">Sign Up</button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center pt-24 pb-20 px-6 sm:px-12 text-center w-full max-w-6xl mx-auto">
        
        {/* Core Headline */}
        <h1 className="text-4xl md:text-[52px] font-medium text-text-main leading-tight tracking-tight mb-4">
          Invest in everything
        </h1>
        <h1 className="text-4xl md:text-[52px] font-medium text-text-main/60 leading-tight tracking-tight mb-6">
          Online platform to invest in stocks, derivatives, mutual funds, and more
        </h1>
        
        <button onClick={() => navigate('/signup')} className="mt-8 px-8 py-3 bg-primary text-white text-lg font-medium rounded hover:bg-primary-hover transition-colors mb-20">
          Sign up now
        </button>

        {/* Hero Image Mockup Area */}
        <div className="w-full max-w-5xl rounded-xl border border-border overflow-hidden bg-background flex flex-col mb-24 relative shadow-2xl">
           
           {/* Mock Header for the image */}
           <div className="w-full h-12 bg-surface flex items-center justify-between px-4 border-b border-border z-10 sticky top-0">
              <div className="flex gap-2">
                 <div className="w-3 h-3 rounded-full bg-danger"></div>
                 <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                 <div className="w-3 h-3 rounded-full bg-success"></div>
              </div>
              <div className="text-xs text-text-main/40 font-medium tracking-widest leading-none">ARAYXS TERMINAL</div>
              <div className="w-12"></div> {/* Spacer for centering */}
           </div>

           {/* Placeholder for actual screenshot or app illustration */}
           <div className="w-full bg-background relative overflow-hidden flex items-start">
               <img src={isDarkMode ? "/aaraxys_hero_dark.png" : "/aaraxys_hero.png"} alt="ARAYXS Trading Dashboard Interface" className="w-full h-auto object-cover object-top" />
           </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full text-left max-w-5xl mx-auto pb-12">
          {features.map((feature, idx) => (
            <div key={idx} className="flex gap-4 group">
               <div className="w-12 h-12 shrink-0 bg-primary/5 rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                 {feature.icon}
               </div>
               <div>
                 <h3 className="text-lg font-medium mb-2 text-text-main">{feature.title}</h3>
                 <p className="text-text-main/60 leading-relaxed text-sm">{feature.desc}</p>
               </div>
            </div>
          ))}
        </div>
        
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-border mt-auto w-full">
         <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center text-sm text-text-main/50">
            <p>© 2026 ARAYXS Technologies Pvt. Ltd. All rights reserved.</p>
            <div className="flex gap-6 mt-4 sm:mt-0">
               <Link to="/terms" className="hover:text-text-main transition-colors">Terms</Link>
               <Link to="/privacy" className="hover:text-text-main transition-colors">Privacy</Link>
               <Link to="/contact" className="hover:text-text-main transition-colors">Contact</Link>
            </div>
         </div>
      </footer>

    </div>
  );
};

export default Landing;
