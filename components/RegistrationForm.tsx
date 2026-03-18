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
    phoneNumber: '',
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
    if (step < 3) setStep(step + 1);
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
        phoneNumber: '',
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        className="glass-card max-w-md w-full p-8 rounded-[2.5rem] relative"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors text-muted-foreground"
        >
          <X size={20} />
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
                <h2 className="text-3xl font-black mb-2 leading-tight">Register for <span className="gradient-text">{wardName}</span></h2>
                <div className="flex gap-2 mt-4">
                  {[1, 2, 3].map((s) => (
                    <div 
                      key={s} 
                      className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${s <= step ? 'bg-primary' : 'bg-white/10'}`}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Steps Content */}
              <div className="min-h-[120px] mb-10">
                {step === 1 && (
                  <motion.div variants={stepVariants} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Enter your name"
                        className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white/10 transition-all font-medium"
                        required
                        autoFocus
                      />
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div variants={stepVariants} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Phone Number</label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="+254 XXX XXX XXX"
                        className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white/10 transition-all font-medium"
                        required
                        autoFocus
                      />
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div variants={stepVariants} className="space-y-6">
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/20">
                      <div className="relative mt-1">
                        <input
                          type="checkbox"
                          id="champion"
                          name="isYouthChampion"
                          checked={formData.isYouthChampion}
                          onChange={handleInputChange}
                          className="w-6 h-6 rounded-lg bg-white/5 border-2 border-primary/50 text-primary focus:ring-primary/30 cursor-pointer appearance-none checked:bg-primary"
                        />
                        {formData.isYouthChampion && <CheckCircle size={14} className="absolute top-1 left-1 text-white pointer-events-none" />}
                      </div>
                      <div>
                        <label htmlFor="champion" className="font-bold text-base cursor-pointer block mb-1">
                          Apply as Youth Champion
                        </label>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Champions help lead townhall discussions and mobilize their local communities.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-4">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 px-4 py-4 font-bold rounded-2xl border border-white/10 bg-white/5 text-foreground hover:bg-white/10 transition-colors"
                  >
                    Back
                  </button>
                )}
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={
                      (step === 1 && !formData.fullName) ||
                      (step === 2 && !formData.phoneNumber)
                    }
                    className="flex-1 premium-button disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="flex-1 premium-button"
                  >
                    Submit Registration
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
              className="text-center py-10"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="mb-6 inline-flex p-4 rounded-full bg-primary/20 text-primary"
              >
                <CheckCircle size={64} />
              </motion.div>
              <h3 className="text-3xl font-black mb-3 italic">Success!</h3>
              <p className="text-muted-foreground max-w-[240px] mx-auto">
                You're registered for {wardName}. We'll contact you soon!
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
