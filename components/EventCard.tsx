'use client';

import { motion } from 'framer-motion';

interface EventCardProps {
  wardName: string;
  date: string;
  capacity: number;
  maxCapacity: number;
  onRegister: () => void;
}

export default function EventCard({
  wardName,
  date,
  capacity,
  maxCapacity,
  onRegister,
}: EventCardProps) {
  const capacityPercentage = (capacity / maxCapacity) * 100;

  return (
    <motion.div
      className="glass-card flex flex-col min-h-80 p-8 rounded-3xl group"
      whileHover={{ y: -10 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
        <div className="w-24 h-24 bg-primary rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="mb-8 relative z-10">
        <h3 className="text-3xl md:text-4xl font-black mb-3 gradient-text">{wardName}</h3>
        <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-muted-foreground">
          {date}
        </div>
      </div>

      {/* Capacity Bar */}
      <div className="mb-10 flex-grow relative z-10">
        <div className="flex justify-between items-end mb-4">
          <span className="text-xs font-bold uppercase tracking-tighter text-muted-foreground">Availability</span>
          <span className="text-lg font-black text-foreground">
            {capacity}<span className="text-muted-foreground text-sm font-medium">/{maxCapacity}</span>
          </span>
        </div>
        <div className="w-full h-3 bg-white/5 rounded-full relative overflow-hidden ring-1 ring-white/10">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-secondary shadow-[0_0_10px_rgba(157,82,255,0.5)]"
            initial={{ width: 0 }}
            whileInView={{ width: `${capacityPercentage}%` }}
            transition={{ duration: 1.5, ease: "circOut" }}
          />
        </div>
      </div>

      {/* CTA Button */}
      <button
        onClick={onRegister}
        className="premium-button w-full text-center font-bold text-base mt-auto"
      >
        Claim Your Spot
      </button>
    </motion.div>
  );
}
