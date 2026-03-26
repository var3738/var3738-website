'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, ArrowRight, User, Mail, Phone, Lock, Hash, MapPin } from 'lucide-react';
import Portal from './Portal';
import { api, UserRole } from '@/lib/api';

interface RegistrationFormProps {
  wardName: string;
  onClose: () => void;
}

export default function RegistrationForm({ wardName, onClose }: RegistrationFormProps) {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeoLoading, setIsGeoLoading] = useState(false);
  
  const [counties, setCounties] = useState<{name: string, pcode: string}[]>([]);
  const [subCounties, setSubCounties] = useState<{name: string, pcode: string}[]>([]);
  const [wardsList, setWardsList] = useState<{name: string, pcode: string}[]>([]);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    nationalId: '',
    county: '',
    subCounty: '',
    ward: wardName,
    isYouthChampion: false,
  });

  const [pcodes, setPcodes] = useState({
    county: '',
    subCounty: '',
    ward: '',
  });

  // Fetch counties on mount
  useEffect(() => {
    async function fetchCounties() {
      try {
        const list = await api.getGeoBoundariesList(1);
        setCounties(list);
      } catch (err) {
        console.warn('Geo API not available, using fallback.');
        setCounties([{ name: 'Trans Nzoia', pcode: 'KE026' }]);
      }
    }
    fetchCounties();
  }, []);

  // Fetch sub-counties when county changes
  useEffect(() => {
    if (!pcodes.county) return;
    async function fetchSubCounties() {
      try {
        const list = await api.getGeoBoundariesList(2, pcodes.county);
        setSubCounties(list);
      } catch (err) {
        setSubCounties([{ name: 'Saboti', pcode: 'KE02601' }]);
      }
    }
    fetchSubCounties();
  }, [pcodes.county]);

  // Fetch wards when sub-county changes
  useEffect(() => {
    if (!pcodes.subCounty) return;
    async function fetchWards() {
      try {
        const list = await api.getGeoBoundariesList(3, pcodes.subCounty);
        setWardsList(list);
      } catch (err) {
        setWardsList([{ name: wardName, pcode: 'KE0260101' }]);
      }
    }
    fetchWards();
  }, [pcodes.subCounty, wardName]);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setIsError("Geolocation is not supported by your browser");
      return;
    }

    setIsGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const location = await api.reverseGeocode(latitude, longitude);
          setFormData(prev => ({
            ...prev,
            county: location.county.name,
            subCounty: location.sub_county.name,
            ward: location.ward.name,
          }));
          setPcodes({
            county: location.county.pcode,
            subCounty: location.sub_county.pcode,
            ward: location.ward.pcode,
          });
        } catch (err) {
          setIsError("Could not determine location automatically.");
        } finally {
          setIsGeoLoading(false);
        }
      },
      (error) => {
        setIsError("Location access denied.");
        setIsGeoLoading(false);
      }
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsError(null);
    setIsLoading(true);

    try {
      // 1. Register the user
      const user = await api.register({
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phoneNumber,
        password: formData.password,
        county: formData.county,
        sub_county: formData.subCounty,
        ward: formData.ward,
        role: (formData.isYouthChampion ? 'youth_champion' : 'guest') as UserRole,
      });

      // 2. Automatically login to get access token
      await api.login(formData.email, formData.password);

      // 3. Mark as submitted
      setIsSubmitted(true);
      
      setTimeout(() => {
        onClose();
        setIsSubmitted(false);
        setStep(1);
        setFormData({
          fullName: '',
          email: '',
          phoneNumber: '',
          password: '',
          nationalId: '',
          county: 'Trans Nzoia',
          subCounty: 'Saboti',
          ward: wardName,
          isYouthChampion: false,
        });
      }, 3000);
    } catch (error: any) {
      console.error('Registration failed:', error);
      setIsError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <Portal>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-100 overflow-y-auto px-4 py-10 md:py-20 flex justify-center items-start md:items-center">
        <motion.div
        className="modern-card max-w-xl w-full p-8 md:p-12 relative overflow-hidden"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
      >
        <div className="glow-orb -top-20 -right-20 opacity-20"></div>
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors z-20"
        >
          <X size={20} className="text-white" />
        </button>

        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative z-10"
            >
              {/* Header */}
              <div className="mb-12">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4">Activation Registry</div>
                <h2 className="text-4xl font-black mb-4 tracking-tighter leading-none italic">
                  SECURE YOUR SEAT <br />
                  <span className="text-white/20">AT {wardName}</span>
                </h2>
                
                <div className="flex gap-2 mt-8">
                  {[1, 2, 3, 4].map((s) => (
                    <div 
                      key={s} 
                      className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${s <= step ? 'bg-primary' : 'bg-white/5'}`}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Steps Content */}
              <div className="min-h-[220px] mb-12">
                {step === 1 && (
                  <motion.div variants={stepVariants} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="EX: JOHN DOE"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white focus:border-primary/50 focus:outline-none transition-all placeholder:text-white/10 font-bold uppercase tracking-tight"
                          required
                          autoFocus
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="EX: CITIZEN@VAR3738.ORG"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white focus:border-primary/50 focus:outline-none transition-all placeholder:text-white/10 font-bold uppercase tracking-tight"
                          required
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div variants={stepVariants} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          placeholder="+254 XXX XXX XXX"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white focus:border-primary/50 focus:outline-none transition-all placeholder:text-white/10 font-bold tracking-tight"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mb-4 pt-4 border-t border-white/5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Location Details</label>
                      <button 
                        type="button"
                        onClick={detectLocation}
                        disabled={isGeoLoading}
                        className="text-[9px] font-black uppercase tracking-widest text-primary flex items-center gap-2 hover:underline disabled:opacity-50"
                      >
                        {isGeoLoading ? 'Detecting...' : <><MapPin size={10} /> Detect Location</>}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {/* County Dropdown */}
                      <div className="space-y-2">
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                          <select
                            name="county"
                            value={pcodes.county}
                            onChange={(e) => {
                              const selected = counties.find(c => c.pcode === e.target.value);
                              setPcodes(prev => ({ ...prev, county: e.target.value, subCounty: '', ward: '' }));
                              setFormData(prev => ({ ...prev, county: selected?.name || '', subCounty: '', ward: '' }));
                            }}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white focus:border-primary/50 focus:outline-none transition-all font-bold uppercase tracking-tight appearance-none"
                            required
                          >
                            <option value="" className="bg-black">SELECT COUNTY</option>
                            {counties.map(c => (
                              <option key={c.pcode} value={c.pcode} className="bg-black">{c.name.toUpperCase()}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {/* Sub-County Dropdown */}
                        <div className="space-y-2">
                          <div className="relative">
                            <select
                              name="subCounty"
                              value={pcodes.subCounty}
                              onChange={(e) => {
                                const selected = subCounties.find(sc => sc.pcode === e.target.value);
                                setPcodes(prev => ({ ...prev, subCounty: e.target.value, ward: '' }));
                                setFormData(prev => ({ ...prev, subCounty: selected?.name || '', ward: '' }));
                              }}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:border-primary/50 focus:outline-none transition-all font-bold uppercase tracking-tight appearance-none"
                              required
                              disabled={!pcodes.county}
                            >
                              <option value="" className="bg-black">SUB-COUNTY</option>
                              {subCounties.map(sc => (
                                <option key={sc.pcode} value={sc.pcode} className="bg-black">{sc.name.toUpperCase()}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Ward Dropdown */}
                        <div className="space-y-2">
                          <div className="relative">
                            <select
                              name="ward"
                              value={pcodes.ward}
                              onChange={(e) => {
                                const selected = wardsList.find(w => w.pcode === e.target.value);
                                setPcodes(prev => ({ ...prev, ward: e.target.value }));
                                setFormData(prev => ({ ...prev, ward: selected?.name || '' }));
                              }}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:border-primary/50 focus:outline-none transition-all font-bold uppercase tracking-tight appearance-none"
                              required
                              disabled={!pcodes.subCounty}
                            >
                              <option value="" className="bg-black">WARD</option>
                              {wardsList.map(w => (
                                <option key={w.pcode} value={w.pcode} className="bg-black">{w.name.toUpperCase()}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">National ID (Optional)</label>
                      <div className="relative">
                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                        <input
                          type="text"
                          name="nationalId"
                          value={formData.nationalId}
                          onChange={handleInputChange}
                          placeholder="ID NUMBER"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white focus:border-primary/50 focus:outline-none transition-all placeholder:text-white/10 font-bold tracking-tight"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div variants={stepVariants} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Establish Security</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="••••••••"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white focus:border-primary/50 focus:outline-none transition-all placeholder:text-white/10"
                          required
                        />
                      </div>
                      <p className="text-[10px] text-white/20 ml-1">Minimum 8 characters with at least one symbol.</p>
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div variants={stepVariants} className="space-y-6">
                    <label className="flex items-start gap-6 p-6 bg-white/2 border border-white/10 rounded-2xl cursor-pointer hover:bg-white/5 hover:border-primary/30 transition-all group">
                      <div className="relative mt-1">
                        <input
                          type="checkbox"
                          id="champion"
                          name="isYouthChampion"
                          checked={formData.isYouthChampion}
                          onChange={handleInputChange}
                          className="w-6 h-6 border-2 border-white/10 bg-transparent rounded-md appearance-none checked:bg-primary checked:border-primary transition-all cursor-pointer"
                        />
                        {formData.isYouthChampion && <CheckCircle size={14} className="absolute top-1 left-1 text-white pointer-events-none" />}
                      </div>
                      <div>
                        <span className="font-black text-lg uppercase tracking-tighter block mb-1 group-hover:text-primary transition-colors">
                          Apply for Champion Certification
                        </span>
                        <p className="text-xs font-medium text-white/30 leading-relaxed">
                          Youth Champions lead townhall dialogues and drive civic mobilization. 
                          Check this to be considered for our leadership program.
                        </p>
                      </div>
                    </label>
                  </motion.div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex gap-4">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="crimson-btn-outline grow py-4 text-[10px] uppercase tracking-[0.2em]"
                  >
                    Previous
                  </button>
                )}
                {step < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={
                      (step === 1 && (!formData.fullName || !formData.email)) ||
                      (step === 2 && !formData.phoneNumber) ||
                      (step === 3 && !formData.password)
                    }
                    className="crimson-btn grow py-4 text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 disabled:opacity-20 transition-all font-black"
                  >
                    Connect <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="crimson-btn grow py-4 text-[10px] uppercase tracking-[0.2em] font-black flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isLoading ? 'Processing...' : 'Activate Profile'}
                  </button>
                )}
              </div>

              {isError && (
                <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-xl text-primary text-[10px] font-black uppercase tracking-widest text-center animate-shake">
                  {isError}
                </div>
              )}
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 relative z-10"
            >
              <div className="mb-10 inline-flex p-8 bg-primary/10 border border-primary/20 rounded-full text-primary">
                <CheckCircle size={64} />
              </div>
              <h3 className="text-4xl font-black italic uppercase tracking-tighter mb-4 leading-none">Registration <br /><span className="text-white/20">Authorized</span></h3>
              <p className="text-white/40 font-medium max-w-sm mx-auto">
                Welcome to the movement. Your digital seat at <span className="text-white">{wardName}</span> has been secured.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
    </Portal>
  );
}
