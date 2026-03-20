'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface HeroSectionProps {
  headline?: string;
  subheadline?: string;
  backgroundColor?: string;
  textColor?: string;
}

export default function HeroSection({
  headline = "Institutionalizing Youth Power: From the Streets to the Ballot.",
  subheadline = "Transforming Kenya’s youthful energy into structured civic participation and electoral power.",
}: HeroSectionProps) {
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
            <button className="px-10 py-4 rounded-lg border border-white/10 hover:bg-white/5 transition-colors font-bold uppercase tracking-widest text-sm">
              Impact Dashboard
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative aspect-square w-full rounded-2xl border border-white/10 bg-white/5 overflow-hidden group shadow-2xl"
        >
          <Image
            src="/group-pics/group-pic2.jpeg"
            alt="VAR 37-38 Movement"
            fill
            className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000"
            priority
          />
          <div className="absolute inset-x-0 bottom-0 p-10 pt-32 bg-linear-to-t from-black via-black/40 to-transparent">
             <h3 className="text-2xl font-black mb-2 italic">Trans Nzoia Series</h3>
             <p className="text-white/50 font-medium">Institutionalizing the youth voice into formal systemic power.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
