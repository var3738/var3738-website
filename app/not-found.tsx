'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="glow-orb top-[-10%] left-[-10%] opacity-20"></div>
      <div className="glow-orb bottom-[-10%] right-[-10%] opacity-20"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl w-full text-center relative z-10"
      >
        <div className="relative inline-block mb-12">
          <span className="text-[180px] md:text-[240px] font-black text-white/5 leading-none tracking-tighter select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
             <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">
               Lost in the <br />
               <span className="text-primary">Movement?</span>
             </h2>
          </div>
        </div>

        <p className="text-xl text-white/40 font-medium mb-12 max-w-md mx-auto">
          The page you're looking for has moved beyond the streets. It might be part of our next activation.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="crimson-btn px-10 py-5 flex items-center justify-center gap-2 group">
            <Home size={18} />
            <span className="text-[10px] uppercase tracking-[0.2em]">Return Home</span>
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="crimson-btn-outline px-10 py-5 flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} />
            <span className="text-[10px] uppercase tracking-[0.2em]">Go Back</span>
          </button>
        </div>
      </motion.div>

      {/* Decorative lines */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-white/5 -translate-y-1/2"></div>
      <div className="absolute top-0 left-1/2 w-px h-full bg-white/5 -translate-x-1/2"></div>
    </div>
  );
}
