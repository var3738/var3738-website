'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';

interface RegistrationFormProps {
  wardName: string;
  onClose: () => void;
}

export default function RegistrationForm({ wardName, onClose }: RegistrationFormProps) {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    nationalId: '',
    ward: wardName,
    isYouthChampion: false,
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
        ward: wardName,
        isYouthChampion: false,
      });
    }, 2000);
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-none flex items-center justify-center z-50 p-4">
      <motion.div
        className="neu-card max-w-lg w-full p-8 md:p-12 relative bg-[#fdfde1]"
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 40 }}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-12 h-12 bg-white border-4 border-black rounded-xl flex items-center justify-center neu-shadow active:shadow-none transition-all"
        >
          <X size={24} className="text-black" />
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
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              {/* Header */}
              <div className="mb-10">
                <h2 className="text-4xl font-black mb-4 leading-tight uppercase italic tracking-tighter">
                  Register for <span className="bg-primary px-3 border-4 border-black inline-block transform rotate-1">{wardName}</span>
                </h2>
                <div className="flex gap-3 mt-6">
                  {[1, 2, 3, 4].map((s) => (
                    <div 
                      key={s} 
                      className={`h-4 flex-1 border-4 border-black transition-all duration-500 ${s <= step ? 'bg-secondary' : 'bg-white'}`}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Steps Content */}
              <div className="min-h-[160px] mb-10">
                {step === 1 && (
                  <motion.div variants={stepVariants} className="space-y-4">
                    <div>
                      <label className="block text-sm font-black uppercase tracking-widest text-black/60 mb-3 ml-2">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="ENTER YOUR NAME"
                        className="neu-input"
                        required
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-black uppercase tracking-widest text-black/60 mb-3 ml-2">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="NAME@EXAMPLE.COM"
                        className="neu-input"
                        required
                      />
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div variants={stepVariants} className="space-y-4">
                    <div>
                      <label className="block text-sm font-black uppercase tracking-widest text-black/60 mb-3 ml-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="+254 XXX XXX XXX"
                        className="neu-input"
                        required
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-black uppercase tracking-widest text-black/60 mb-3 ml-2">National ID (Optional)</label>
                      <input
                        type="text"
                        name="nationalId"
                        value={formData.nationalId}
                        onChange={handleInputChange}
                        placeholder="ENTER ID NUMBER"
                        className="neu-input"
                      />
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div variants={stepVariants} className="space-y-4">
                    <div>
                      <label className="block text-sm font-black uppercase tracking-widest text-black/60 mb-3 ml-2">Create Password</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="MIN. 8 CHARACTERS"
                        className="neu-input"
                        required
                        autoFocus
                      />
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div variants={stepVariants} className="space-y-6">
                    <div className="flex items-start gap-6 p-6 bg-white border-4 border-black neu-shadow">
                      <div className="relative mt-1">
                        <input
                          type="checkbox"
                          id="champion"
                          name="isYouthChampion"
                          checked={formData.isYouthChampion}
                          onChange={handleInputChange}
                          className="w-8 h-8 border-4 border-black bg-white appearance-none checked:bg-primary cursor-pointer transition-colors"
                        />
                        {formData.isYouthChampion && <CheckCircle size={20} className="absolute top-1 left-1 text-black pointer-events-none" />}
                      </div>
                      <div>
                        <label htmlFor="champion" className="font-black text-xl uppercase italic cursor-pointer block mb-2">
                          Become a Champion
                        </label>
                        <p className="text-sm font-bold text-black/60 leading-tight">
                          Champions help lead townhall discussions and mobilize their local communities.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-6">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="neu-button-outline flex-1 text-lg"
                  >
                    Back
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
                    className="neu-button flex-1 text-lg disabled:opacity-50 disabled:grayscale"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="neu-button-secondary flex-1 text-lg"
                  >
                    Register now
                  </button>
                )}
              </div>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="text-center py-12"
            >
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="mb-8 inline-flex p-6 bg-primary border-4 border-black neu-shadow-lg"
              >
                <CheckCircle size={80} className="text-black" />
              </motion.div>
              <h3 className="text-5xl font-black italic uppercase tracking-tighter mb-4">You're in!</h3>
              <p className="text-xl font-bold text-black/60 max-w-sm mx-auto leading-tight">
                Welcome to the movement. We'll contact you at {wardName}.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
