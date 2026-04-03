'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ArrowRight, Award, History, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { certUtils } from '@/lib/api';

export default function ClaimPage() {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;

    setIsVerifying(true);
    setError('');

    // Mock verification for now - in production this would check 
    // against an Admin-managed Registry or hardcoded event codes.
    // Let's accept some standard codes for now.
    const validCodes: Record<string, { event: string; date: string }> = {
      'VAR-TH-NZOIA': { event: 'Trans Nzoia Townhall', date: 'October 15, 2023' },
      'VAR-DUA-2024': { event: 'Democracy Activated Summit', date: 'March 12, 2024' },
      'VAR-TEST': { event: 'Alpha Test Activation', date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) }
    };

    setTimeout(() => {
      if (validCodes[code.toUpperCase()]) {
        const { event, date } = validCodes[code.toUpperCase()];
        const token = certUtils.generateToken(name, event, date);
        router.push(`/certificate?token=${token}`);
      } else {
        setError('Invalid activation code. Please check your credentials and try again.');
        setIsVerifying(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black pt-32 pb-20">
      <div className="max-w-xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 mx-auto mb-6"
          >
            <Award className="text-primary w-8 h-8" />
          </motion.div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter mb-4 italic">
            Claim Your <br />
            <span className="text-primary">Credentials</span>
          </h1>
          <p className="text-white/40 text-sm font-medium uppercase tracking-widest max-w-sm mx-auto">
            Institutionalizing participation through verified digital awarding systems.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="modern-card bg-white/5 border border-white/10 p-8 rounded-3xl"
        >
          <form onSubmit={handleClaim} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2 ml-1">Your Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="AS YOU WANT IT ON THE CERTIFICATE"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 font-bold uppercase tracking-widest text-xs focus:ring-1 focus:ring-primary focus:border-primary outline-hidden transition-all placeholder:text-white/10"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2 ml-1">Activation Code</label>
              <input 
                type="text" 
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="ENTER THE CODE FROM THE EVENT"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 font-bold uppercase tracking-widest text-xs focus:ring-1 focus:ring-primary focus:border-primary outline-hidden transition-all placeholder:text-white/10"
                required
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest p-4 rounded-xl flex items-start gap-3"
                >
                  <ShieldCheck size={14} className="mt-0.5 shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              type="submit"
              disabled={isVerifying}
              className="w-full bg-primary text-black font-black uppercase tracking-widest text-xs py-4 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-50"
            >
              {isVerifying ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                  Verifying Compliance...
                </span>
              ) : (
                <>Generate Certificate <ArrowRight size={14} /></>
              )}
            </button>
          </form>
        </motion.div>

        {/* Info Box */}
        <div className="mt-8 flex items-start gap-4 p-6 bg-white/5 border border-white/5 rounded-2xl">
          <Info size={16} className="text-primary mt-1 shrink-0" />
          <div className="space-y-2">
             <h4 className="text-[10px] font-black uppercase tracking-widest text-white/60">Digital Transparency</h4>
             <p className="text-[9px] font-medium leading-relaxed text-white/30 uppercase">
                Certificates are generated based on event completion verification. 
                They are cryptographically signed and non-transferable. 
                Save your link after generation for future access.
             </p>
          </div>
        </div>

      </div>
    </div>
  );
}
