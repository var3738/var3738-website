'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface PartnerCardProps {
  name: string;
  logo: string;
  url: string;
  index: number;
}

export default function PartnerCard({ name, logo, url, index }: PartnerCardProps) {
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="modern-card flex flex-col items-center justify-center p-8 bg-black/40 backdrop-blur-sm group cursor-pointer h-48"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <div className="relative w-full h-20 mb-4 overflow-hidden md:grayscale group-hover:grayscale-0 transition-all duration-700">
        <Image
          src={logo}
          alt={name}
          fill
          className="object-contain"
        />
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 group-hover:text-primary transition-colors">
        {name}
      </p>
    </motion.a>
  );
}
