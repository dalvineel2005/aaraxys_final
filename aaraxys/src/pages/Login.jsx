import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Activity, Eye, EyeOff } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { login, googleLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    try {
      const res = await googleLogin(credentialResponse.credential);
      if (res.success) {
        addToast('Google login successful!', 'success');
        navigate('/dashboard');
      } else {
        addToast(res.message || 'Google login failed.', 'error');
      }
    } catch (error) {
      addToast(error.message || 'Google login failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        addToast('Login successful!', 'success');
        navigate('/dashboard');
      } else {
        addToast(res.message || 'Login failed. Please check your credentials.', 'error');
      }
    } catch (error) {
      addToast(error.message || 'Login failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 transition-colors duration-300">
      
      <div className="w-full max-w-md bg-surface border border-border rounded-xl overflow-hidden p-8 animate-in fade-in zoom-in-95 duration-500">
        
        <div className="flex flex-col items-center mb-8">
          <img src="/logo.png" alt="ARAYXS Logo" className="w-16 h-16 object-contain rounded-xl shadow-sm mb-4" />
          <h2 className="text-2xl font-bold tracking-tight text-text-main">Login to ARAYXS</h2>
          <p className="text-sm text-text-main/60 mt-1">Enter your details to access your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-text-main/70 mb-1.5">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              placeholder="email@example.com"
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1.5">
               <label className="block text-sm font-medium text-text-main/70">Password</label>
               <a href="#" className="text-xs text-primary hover:text-primary-hover font-medium transition-colors">Forgot password?</a>
            </div>
            <div className="relative group">
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border border-border rounded-lg pl-4 pr-12 py-3 text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="Enter password"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-main/40 hover:text-text-main/70 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full py-2.5 mt-2 text-white rounded-lg font-medium text-sm transition-colors ${isLoading ? 'bg-primary/50' : 'bg-primary hover:bg-primary-hover'}`}
          >
            {isLoading ? 'Logging in...' : 'Login securely'}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center space-x-2">
            <div className="h-px bg-border flex-1"></div>
            <span className="text-xs text-text-main/50 uppercase tracking-wider font-medium">Or continue with</span>
            <div className="h-px bg-border flex-1"></div>
        </div>

        <div className="mt-6 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => addToast('Google Login Failed', 'error')}
              theme="filled_black"
              shape="pill"
            />
        </div>

        <div className="mt-8 pt-6 border-t border-border text-center text-sm">
          <span className="text-text-main/60">Don't have an account? </span>
          <button onClick={() => navigate('/signup')} className="text-primary font-bold hover:text-primary-hover transition-colors">Sign up now</button>
        </div>

      </div>
      
    </div>
  );
};

export default Login;
