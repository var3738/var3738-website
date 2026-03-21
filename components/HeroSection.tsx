'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface HeroSectionProps {
  headline?: string;
  subheadline?: string;
  imageSrc?: string; // Added imageSrc prop
  backgroundColor?: string;
  textColor?: string;
}


const IMAGES_COUNT = 20;
const IMAGES = Array.from({ length: IMAGES_COUNT }, (_, i) => {
    const num = (i + 1).toString().padStart(2, '0');
    return `/activity-pics/press/activity-pics${num}.jpeg`;
  });

export default function HeroSection({
  headline = "Empowering the Next Generation of Kenyan Leaders", // Updated default headline
  subheadline = "Institutionalizing youth power through civic engagement, digital resilience, and ideological clarity.", // Updated default subheadline

}: HeroSectionProps) {

const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center bg-background overflow-hidden px-4 py-32 border-b border-border">
      {/* Background Orbs */}
      <div className="glow-orb -top-20 -left-20 opacity-20"></div>
      <div className="glow-orb top-1/2 -right-20 opacity-10 blur-[120px]"></div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-8">
             <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
             Strategic Civic Engagement
          </div>
          <h1 className="mb-10 block tracking-tight">
            {headline}
          </h1>
          <p className="text-xl md:text-2xl text-white/60 mb-12 max-w-xl font-medium leading-tight">
            {subheadline}
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="crimson-btn text-lg px-10 py-4">
              Explore Our Strategy
            </button>
            <Link href="/impact">
            <button className="px-10 py-4 rounded-lg border border-white/10 hover:bg-white/5 transition-colors font-bold uppercase tracking-widest text-sm">
              Impact Dashboard
            </button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative aspect-square w-full rounded-2xl border border-white/10 bg-white/5 overflow-hidden group shadow-2xl"
        >
          <Image
            src={IMAGES[currentImageIndex]}
            alt="Youth leaders and participants at the VAR Trans Nzoia Townhall Series"
            fill
            className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000"
            priority
          />
          <div className="absolute inset-x-0 bottom-0 p-10 pt-32 bg-linear-to-t from-black via-black/40 to-transparent">
             <h3 className="text-2xl font-black mb-2 italic">VAR 37–38: Youth in Action</h3>
             <p className="text-white/50 font-medium">A youth-led civic movement mobilizing constitutional rights to organize, advocate, and drive accountable, peaceful political change across Kenya.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
