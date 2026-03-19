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
      className="neu-card bg-white group overflow-hidden"
    >
      <div className="relative h-80 w-full overflow-hidden border-b-4 border-black bg-accent/20">
        <Image
          src={`/team/${image}`}
          alt={name}
          fill
          className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
        />
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-black mb-1 uppercase italic tracking-tighter">
          {name}
        </h3>
        <p className="text-sm font-black uppercase tracking-widest text-[#D0171D]">
          {position}
        </p>
      </div>
    </motion.div>
  );
}
