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
  tilt = 'none',
  className = "",
  priority = false
}: BrutalistImageProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const tiltClass = {
    left: '-rotate-2',
    right: 'rotate-2',
    none: 'rotate-0'
  }[tilt];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        onClick={() => setIsPreviewOpen(true)}
        className={`relative inline-block cursor-pointer ${tiltClass} ${className}`}
      >
        <div className="relative bg-white border-4 border-black neu-shadow-lg p-2 overflow-hidden">
          <div className="relative aspect-[4/3] w-full overflow-hidden border-2 border-black">
            <Image
              src={src}
              alt={alt}
              fill
              className="object-cover grayscale hover:grayscale-0 transition-all duration-500 hover:scale-110"
              priority={priority}
            />
          </div>
          {caption && (
            <div className="mt-2 text-center">
              <span className="bg-[#D0171D] text-white text-[10px] font-black uppercase px-2 py-0.5 border-2 border-black inline-block transform -rotate-1">
                {caption}
              </span>
            </div>
          )}
        </div>
      </motion.div>

      <ImagePreviewModal 
        src={isPreviewOpen ? src : null} 
        onClose={() => setIsPreviewOpen(false)} 
      />
    </>
  );
}
