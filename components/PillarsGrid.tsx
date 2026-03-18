'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface Pillar {
  title: string;
  description: string;
  icon?: React.ReactNode;
  accentColor?: string;
}

interface PillarsGridProps {
  pillars: Pillar[];
}

export default function PillarsGrid({ pillars }: PillarsGridProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <section className="w-full py-16 md:py-24 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {pillars.map((pillar, idx) => (
            <motion.div
              key={idx}
              className="glass-card min-h-[400px] flex flex-col p-10 rounded-[2.5rem] group relative"
              variants={cardVariants}
              whileHover={{ y: -12 }}
            >
              {/* Animated Inner Glow */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-[80px] group-hover:bg-primary/20 transition-all duration-700"></div>

              {/* Icon/Accent */}
              {pillar.icon && (
                <div className="relative mb-10">
                  <div className={`w-20 h-20 ${pillar.accentColor || 'bg-gradient-to-br from-primary to-secondary'} rounded-2xl flex items-center justify-center text-white relative z-10 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-500`}>
                    {pillar.icon}
                  </div>
                  <div className={`absolute inset-0 w-20 h-20 ${pillar.accentColor || 'bg-primary'} blur-2xl opacity-20 group-hover:opacity-40 transition-opacity`}></div>
                </div>
              )}

              {/* Title */}
              <h3 className="text-3xl font-black mb-6 leading-tight group-hover:gradient-text transition-all duration-300">
                {pillar.title}
              </h3>

              {/* Description */}
              <p className="text-base leading-relaxed flex-grow text-muted-foreground group-hover:text-foreground/80 transition-colors">
                {pillar.description}
              </p>

              {/* Bottom Accent */}
              <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                  Core Pillar
                </span>
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
