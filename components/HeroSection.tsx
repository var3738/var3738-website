'use client';

import { motion } from 'framer-motion';
import CreativeNeuCard from './CreativeNeuCard';

interface HeroSectionProps {
  headline: string;
  subheadline?: string;
  backgroundColor?: string;
  textColor?: string;
}

export default function HeroSection({
  headline,
  subheadline,
  backgroundColor = 'bg-background',
  textColor = 'text-foreground',
}: HeroSectionProps) {
  return (
    <section className={`w-full ${backgroundColor} ${textColor} py-20 px-4 md:py-32 overflow-hidden relative border-b-4 border-black`}>
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 text-left"
        >
          <div className="inline-block px-4 py-2 bg-secondary border-4 border-black font-black uppercase tracking-widest mb-8 neu-shadow transform -rotate-2">
            Movement in Action
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black italic uppercase leading-[0.85] mb-8 tracking-tighter">
            {headline.split(' ').map((word, i) => (
              <span key={i} className={i % 2 === 1 ? 'bg-primary px-4 py-1 border-4 border-black inline-block transform rotate-1 m-1' : ''}>
                {word}{' '}
              </span>
            ))}
          </h1>
          
          {subheadline && (
            <p className="text-xl md:text-2xl font-bold leading-tight mb-12 max-w-xl">
              {subheadline}
            </p>
          )}
          
          <div className="flex flex-wrap gap-6">
            <button className="neu-button text-lg px-10 py-4 transform hover:-translate-x-1 hover:-translate-y-1 active:translate-x-1 active:translate-y-1 transition-all">
              Start building
            </button>
            <button className="neu-button-outline text-lg px-10 py-4 transform hover:-translate-x-1 hover:-translate-y-1 active:translate-x-1 active:translate-y-1 transition-all">
              Learn more
            </button>
          </div>
        </motion.div>

        <div className="flex-1 relative hidden lg:block">
          <CreativeNeuCard 
            mainText="VAR"
            hoverText="POWER"
            title="YOUTH-LED"
            subtitle="REVOLUTION"
            className="w-full"
          />
        </div>
      </div>
    </section>
  );
}
