'use client';

import { motion } from 'framer-motion';
import MerchGrid from '@/components/MerchGrid';
import { ShoppingBag } from 'lucide-react';

export default function MerchPage() {
  return (
    <main className="min-h-screen pt-40 pb-20 bg-background overflow-hidden selection:bg-primary selection:text-black">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="max-w-3xl mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 text-primary mb-6"
          >
            <div className="h-px w-8 bg-primary"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Official Store</span>
            <ShoppingBag size={14} />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter uppercase"
          >
            Wear the <span className="text-primary italic">Republic</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-white/50 leading-relaxed font-bold tracking-tight"
          >
            Support the movement. High-integrity merchandise designed for the next generation of leadership. 
            All proceeds fund grassroot civic activation.
          </motion.p>
        </div>

        {/* Collection Grid */}
        <div className="mb-20">
          <div className="flex justify-between items-end mb-12 border-b border-white/10 pb-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Latest Drop / 2026</h2>
          </div>
          <MerchGrid />
        </div>
      </div>
    </main>
  );
}
