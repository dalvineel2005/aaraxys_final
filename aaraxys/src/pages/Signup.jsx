import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

const Signup = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { register, googleLogin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    try {
      const res = await googleLogin(credentialResponse.credential);
      if (res.success) {
        addToast('Account created successfully!', 'success');
        navigate('/dashboard');
      } else {
        addToast(res.message || 'Registration failed', 'error');
      }
    } catch (error) {
       addToast(error.message || 'Registration failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (step === 1) {
      if (firstName && lastName && email && mobile) {
        setStep(2);
      } else {
        addToast('Please fill in all required fields for step 1', 'warning');
      }
    } else {
      if (firstName && lastName && email && mobile && password) {
        setIsLoading(true);
        const name = `${firstName} ${lastName}`;
        try {
          const res = await register(name, email, password);
          if (res.success) {
            addToast('Account created successfully!', 'success');
            navigate('/dashboard');
          } else {
            addToast(res.message || 'Registration failed', 'error');
          }
        } catch (error) {
           addToast(error.message || 'Registration failed', 'error');
        } finally {
          setIsLoading(false);
        }
      } else {
        addToast('Please fill in all fields', 'warning');
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 transition-colors duration-300">
      
      <div className="w-full max-w-md bg-surface border border-border rounded-xl overflow-hidden p-8 animate-in fade-in zoom-in-95 duration-500">
        
        <div className="flex flex-col items-center mb-6">
          <img src="/logo.png" alt="ARAYXS Logo" className="w-16 h-16 object-contain rounded-xl shadow-sm mb-4" />
          <h2 className="text-2xl font-bold tracking-tight text-text-main">
            {step === 1 ? 'Open an Account' : 'Secure your Account'}
          </h2>
          <p className="text-sm text-text-main/60 mt-1 text-center">
            {step === 1 ? 'Join ARAYXS today and get ready to trade.' : 'Create a strong password to protect your investments.'}
          </p>
        </div>

        <div className="flex items-center gap-2 mb-8">
           <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-border'}`}></div>
           <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-border'}`}></div>
        </div>

        <form onSubmit={handleSignup} className="space-y-5 animate-in slide-in-from-right duration-300">
          
          {step === 1 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-text-main/70 mb-1.5">First Name</label>
                   <input required value={firstName} onChange={(e) => setFirstName(e.target.value)} type="text" className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-main focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none" placeholder="John" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-text-main/70 mb-1.5">Last Name</label>
                   <input required value={lastName} onChange={(e) => setLastName(e.target.value)} type="text" className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-main focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none" placeholder="Doe" />
                 </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-main/70 mb-1.5">Email Address</label>
                <input required value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-main focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none" placeholder="john.doe@example.com" />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-main/70 mb-1.5">Mobile Number (India)</label>
                <div className="flex">
                  <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-border bg-background text-text-main/60 sm:text-sm font-medium">
                    +91
                  </span>
                  <input required value={mobile} onChange={(e) => setMobile(e.target.value)} type="tel" pattern="[0-9]{10}" className="flex-1 w-full bg-background border border-border rounded-r-lg px-4 py-3 text-text-main focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none" placeholder="98765 43210" />
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label className="block text-sm font-medium text-text-main/70 mb-1.5">Create Password</label>
                <div className="relative group">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg pl-4 pr-12 py-3 text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    placeholder="Min. 8 characters"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-main/40 hover:text-text-main/70 transition-colors">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <div className="bg-success/5 p-4 rounded-lg border border-success/20">
                 <h4 className="text-sm font-medium text-success flex items-center gap-2 mb-2"><CheckCircle2 size={16}/> Details verified successfully</h4>
                 <p className="text-xs text-text-main/60">An OTP will be sent to your phone and email to complete registration in the next step.</p>
              </div>
            </>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full py-2.5 mt-2 text-white rounded-lg font-medium text-sm transition-colors ${isLoading ? 'bg-primary/50' : 'bg-primary hover:bg-primary-hover'}`}
          >
            {isLoading ? 'Processing...' : (step === 1 ? 'Continue' : 'Create Account')}
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
          <span className="text-text-main/60">Already have an account? </span>
          <button onClick={() => navigate('/login')} className="text-primary font-bold hover:text-primary-hover transition-colors">Log in</button>
        </div>

      </div>
    </div>
  );
};

export default Signup;
