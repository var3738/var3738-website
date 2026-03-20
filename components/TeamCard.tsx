'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface TeamCardProps {
  name: string;
  position: string;
  image: string;
}

export default function TeamCard({ name, position, image }: TeamCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="modern-card bg-black/40 backdrop-blur-sm group overflow-hidden border border-white/5"
    >
      <div className="relative aspect-4/5 w-full overflow-hidden bg-white/5">
        <Image
          src={`/team/${image}`}
          alt={name}
          fill
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
      </div>
      <div className="p-8">
        <h3 className="text-2xl font-black mb-1 uppercase tracking-tighter">
          {name}
        </h3>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
          {position}
        </p>
      </div>
    </motion.div>
  );
}
