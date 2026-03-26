'use client';

import { motion } from 'framer-motion';

interface EventCardProps {
  wardName: string;
  date: string;
  capacity: number;
  maxCapacity: number;
  onRegister: () => void;
  onFeedback?: () => void;
}

export default function EventCard({
  wardName,
  date,
  capacity,
  maxCapacity,
  onRegister,
  onFeedback,
}: EventCardProps) {
  const capacityPercentage = (capacity / maxCapacity) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="modern-card flex flex-col p-8 bg-black/40 backdrop-blur-sm group relative overflow-hidden h-full"
    >
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />

      {/* Header */}
      <div className="mb-10 relative z-10">
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2">
          Townhall Series
        </div>
        <h3 className="text-3xl font-black mb-1 uppercase tracking-tighter transition-colors group-hover:text-primary">
          {wardName}
        </h3>
        <p className="text-white/40 font-medium text-sm">
          {date}
        </p>
      </div>

      {/* Capacity Section */}
      <div className="mb-12 flex-grow relative z-10">
        <div className="flex justify-between items-end mb-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Seat Availability</span>
          <span className="text-lg font-black">
            {capacity}<span className="text-white/20 text-xs font-bold ml-1">/{maxCapacity}</span>
          </span>
        </div>
        <div className="w-full h-1 bg-white/5 rounded-full relative overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            whileInView={{ width: `${capacityPercentage}%` }}
            transition={{ duration: 1.5, ease: "circOut" }}
          />
        </div>
      </div>

      {/* CTA Button */}
      <div className="flex gap-4 w-full">
        <button
          onClick={onRegister}
          className="crimson-btn flex-1 text-xs uppercase tracking-widest py-4"
        >
          Secure a Seat
        </button>
        {onFeedback && (
          <button
            onClick={onFeedback}
            className="flex-1 px-4 py-4 bg-white/5 text-white/60 text-xs font-black uppercase tracking-widest rounded-md border border-white/10 hover:bg-white/10 hover:text-white transition-colors"
          >
            Leave Feedback
          </button>
        )}
      </div>
    </motion.div>
  );

}
