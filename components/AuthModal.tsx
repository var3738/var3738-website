'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, ArrowRight, User, Mail, Phone, Lock, Hash, MapPin, LogIn } from 'lucide-react';
import Portal from './Portal';
import { api, UserRole } from '@/lib/api';

interface AuthModalProps {
  onClose: () => void;
  targetEventId?: number | null;
  targetEventName?: string | null;
  onSuccess?: (user: any) => void;
  initialMode?: 'login' | 'register';
}

export default function AuthModal({ 
  onClose, 
  targetEventId, 
  targetEventName,
  onSuccess,
  initialMode = 'login' 
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Registration Data
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    nationalId: '',
    county: '',
    subCounty: '',
    ward: '',
    isYouthChampion: false,
  });

  // Login Data
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (mode === 'register') {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    } else {
      setLoginData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsError(null);
    setIsLoading(true);

    try {
      let user;
      if (mode === 'login') {
        const auth = await api.login(loginData.email, loginData.password);
        user = await api.getMe();
      } else {
        user = await api.register({
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phoneNumber,
          national_id: formData.nationalId,
          password: formData.password,
          county: formData.county,
          sub_county: formData.subCounty,
          ward: formData.ward || targetEventName || '',
          role: (formData.isYouthChampion ? 'youth_champion' : 'guest') as UserRole,
        });
        await api.login(formData.email, formData.password);
      }

      // Automatically register for event if targeted
      if (targetEventId) {
        await api.registerForEvent(targetEventId, user.id);
      }

      setIsSuccess(true);
      if (onSuccess) onSuccess(user);
      
      setTimeout(() => {
        onClose();
      }, 2500);

    } catch (err: any) {
      setIsError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Portal>
      <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="modern-card max-w-xl w-full p-8 md:p-12 relative overflow-hidden"
        >
          <div className="glow-orb -top-20 -right-20 opacity-20"></div>
          
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors z-20"
          >
            <X size={20} className="text-white" />
          </button>

          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="mb-6 inline-flex p-6 bg-primary/10 rounded-full text-primary">
                  <CheckCircle size={48} />
                </div>
                <h2 className="text-3xl font-black uppercase tracking-tighter mb-2 italic">Identity Verified</h2>
                <p className="text-white/40 font-medium">
                  {targetEventId ? `Success! Your seat at ${targetEventName} is secured.` : 'Welcome back to the movement.'}
                </p>
              </motion.div>
            ) : (
              <div key="auth-form" className="relative z-10">
                <div className="mb-10 text-center">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4">Identity System</div>
                  <h2 className="text-4xl font-black tracking-tighter uppercase leading-none italic mb-8">
                    {mode === 'login' ? 'Welcome Back' : 'Join the Movement'}
                  </h2>
                  
                  <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                    <button 
                      onClick={() => setMode('login')}
                      className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${mode === 'login' ? 'bg-primary text-black' : 'text-white/40 hover:text-white'}`}
                    >
                      Login
                    </button>
                    <button 
                      onClick={() => setMode('register')}
                      className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${mode === 'register' ? 'bg-primary text-black' : 'text-white/40 hover:text-white'}`}
                    >
                      Register
                    </button>
                  </div>
                </div>

                <form onSubmit={handleAuth} className="space-y-6">
                  {mode === 'login' ? (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Email</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                          <input
                            type="email"
                            name="email"
                            value={loginData.email}
                            onChange={handleInputChange}
                            placeholder="EX: CITIZEN@VAR3738.ORG"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white focus:border-primary/50 focus:outline-none transition-all placeholder:text-white/10 font-bold uppercase tracking-tight"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Password</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                          <input
                            type="password"
                            name="password"
                            value={loginData.password}
                            onChange={handleInputChange}
                            placeholder="••••••••"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white focus:border-primary/50 focus:outline-none transition-all placeholder:text-white/10 font-bold tracking-tight"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Simplified Signup Flow for the AuthModal */
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="FULL NAME"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:border-primary/50 focus:outline-none placeholder:text-white/10 font-bold uppercase text-[10px] tracking-tight"
                          required
                        />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="EMAIL"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:border-primary/50 focus:outline-none placeholder:text-white/10 font-bold uppercase text-[10px] tracking-tight"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <input
                          type="text"
                          name="nationalId"
                          value={formData.nationalId}
                          onChange={handleInputChange}
                          placeholder="NATIONAL ID"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:border-primary/50 focus:outline-none placeholder:text-white/10 font-bold uppercase text-[10px] tracking-tight"
                          required
                        />
                         <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="PASSWORD"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:border-primary/50 focus:outline-none placeholder:text-white/10 font-bold uppercase text-[10px] tracking-tight"
                          required
                        />
                      </div>
                      <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
                        <p className="text-[10px] font-bold text-primary italic uppercase tracking-widest text-center">
                          Complete profile during first townhall attendance
                        </p>
                      </div>
                    </div>
                  )}

                  {isError && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[10px] font-bold uppercase tracking-widest text-center">
                      {isError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full crimson-btn py-5 text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isLoading ? 'Processing...' : (
                      <>
                        {mode === 'login' ? 'Authorize Identity' : 'Create Profile'}
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                  
                  {targetEventName && (
                    <p className="text-[8px] font-bold text-white/20 uppercase tracking-[0.2em] text-center mt-6 italic">
                      Proceeding will secure your representative seat for {targetEventName}
                    </p>
                  )}
                </form>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </Portal>
  );
}
