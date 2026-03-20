'use client';

import { motion } from 'framer-motion';

interface StatCardProps {
  number: string;
  label: string;
  index: number;
}

export default function StatCard({ number, label, index }: StatCardProps) {
  return (
    <motion.div
      className="text-center py-10 px-6 group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <motion.div
        className="text-5xl md:text-7xl font-black mb-2 tracking-tighter text-white group-hover:text-primary transition-colors"
        initial={{ scale: 0.9 }}
        whileInView={{ scale: 1 }}
        transition={{
          delay: index * 0.1 + 0.2,
          type: 'spring',
          stiffness: 100,
        }}
        viewport={{ once: true }}
      >
        {number}
      </motion.div>
      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 group-hover:text-white transition-colors">
        {label}
      </div>
    </motion.div>
  );
}
