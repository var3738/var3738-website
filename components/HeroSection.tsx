'use client';

import { motion } from 'framer-motion';

interface HeroSectionProps {
  headline: string;
  subheadline?: string;
  backgroundColor?: string;
  textColor?: string;
}

export default function HeroSection({
  headline,
  subheadline,
  backgroundColor = 'aurora-bg',
  textColor = 'text-foreground',
}: HeroSectionProps) {
  return (
    <section className={`w-full ${backgroundColor} ${textColor} py-24 md:py-40 border-b border-white/5 overflow-hidden relative`}>
      {/* Dynamic Aurora Orbs */}
      <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute -bottom-24 -right-24 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-balance mb-8 leading-[0.95]">
            <span className="gradient-text">{headline}</span>
          </h1>
        </motion.div>

        {subheadline && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-2xl mb-12"
          >
            <p className="text-xl md:text-2xl font-medium text-muted-foreground leading-relaxed balance">
              {subheadline}
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button className="premium-button text-lg px-10 py-4">
            Start Building Now
          </button>
          <button className="px-10 py-4 rounded-full border border-white/10 glass-card font-bold hover:bg-white/5 transition-all">
            Watch Video
          </button>
        </motion.div>
      </div>
    </section>
  );
}
