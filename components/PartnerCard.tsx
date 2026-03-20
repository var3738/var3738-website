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
      className="neu-card flex flex-col items-center justify-center p-8 bg-white group cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <div className="relative w-full aspect-video mb-4 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110">
        <Image
          src={logo}
          alt={name}
          fill
          className="object-contain"
        />
      </div>
      <h3 className="font-black text-xl text-black border-t-2 border-black pt-4 w-full text-center group-hover:bg-primary group-hover:text-white transition-colors uppercase italic tracking-tighter">
        {name}
      </h3>
    </motion.a>
  );
}
