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
      className="glass-card text-center py-10 rounded-2xl group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
    >
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <motion.div
        className="text-4xl md:text-5xl font-black gradient-text mb-2"
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{
          delay: index * 0.1 + 0.2,
          type: 'spring',
          stiffness: 100,
        }}
        viewport={{ once: true }}
      >
        {number}
      </motion.div>
      <div className="text-xs md:text-sm font-bold tracking-widest uppercase text-muted-foreground group-hover:text-foreground transition-colors">
        {label}
      </div>
    </motion.div>
  );
}
