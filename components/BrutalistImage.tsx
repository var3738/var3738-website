'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';
import ImagePreviewModal from './ImagePreviewModal';

interface BrutalistImageProps {
  src: string;
  alt: string;
  caption?: string;
  tilt?: 'left' | 'right' | 'none';
  className?: string;
  priority?: boolean;
}

export default function BrutalistImage({
  src,
  alt,
  caption,
  className = "",
  priority = false
}: BrutalistImageProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        onClick={() => setIsPreviewOpen(true)}
        className={`relative inline-block cursor-pointer group rounded-xl overflow-hidden border border-white/10 bg-white/5 ${className}`}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-contain bg-black/40 group-hover:scale-105 transition-transform duration-700"
            priority={priority}
          />
        </div>
        {caption && (
          <div className="absolute bottom-4 left-4 right-4 z-20">
            <span className="bg-primary/90 backdrop-blur-sm text-white text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest border border-primary/20">
              {caption}
            </span>
          </div>
        )}
      </motion.div>

      <ImagePreviewModal 
        src={isPreviewOpen ? src : null} 
        onClose={() => setIsPreviewOpen(false)} 
      />
    </>
  );
}
