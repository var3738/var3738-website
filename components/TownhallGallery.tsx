'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';
import ImagePreviewModal from './ImagePreviewModal';

const IMAGES_COUNT = 45;
const INITIAL_COUNT = 12;

export default function TownhallGallery() {
  const [displayCount, setDisplayCount] = useState(INITIAL_COUNT);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Generate image paths: tnts-image01.jpeg to tnts-image45.jpeg
  const images = Array.from({ length: IMAGES_COUNT }, (_, i) => {
    const num = (i + 1).toString().padStart(2, '0');
    return `/trans-nzoia-townhall/tnts-image${num}.jpeg`;
  });

  const displayedImages = images.slice(0, displayCount);

  return (
    <section className="w-full py-24 bg-[#ffc0ad]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="text-6xl font-black mb-4 italic uppercase tracking-tighter leading-none">
            Movement in <span className="bg-[#D0171D] text-white px-4 border-4 border-black inline-block transform rotate-1">Action</span>
          </h2>
          <p className="text-xl font-bold max-w-2xl text-black/70">
            Moments from our very first Town Hall series in Trans Nzoia. Voices heard, energy captured, democracy activated.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedImages.map((src, idx) => (
            <motion.div
              key={src}
              layoutId={src}
              onClick={() => setSelectedImage(src)}
              initial={{ opacity: 0, scale: 0.9, rotate: idx % 2 === 0 ? -2 : 2 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              whileHover={{ 
                scale: 1.05, 
                rotate: idx % 2 === 0 ? 2 : -2,
                zIndex: 10
              }}
              transition={{ duration: 0.3 }}
              viewport={{ once: true }}
              className="relative aspect-square neu-card overflow-hidden bg-white group cursor-pointer"
            >
              <Image
                src={src}
                alt={`Townhall moment ${idx + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 border-4 border-black pointer-events-none"></div>
            </motion.div>
          ))}
        </div>

        <ImagePreviewModal 
          src={selectedImage} 
          onClose={() => setSelectedImage(null)} 
        />

        {displayCount < IMAGES_COUNT && (
          <div className="mt-16 text-center">
            <button
              onClick={() => setDisplayCount(prev => Math.min(prev + 12, IMAGES_COUNT))}
              className="neu-button bg-[#022855] text-white text-xl hover:scale-105 active:scale-95 transition-all"
            >
              Load More Moments
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
