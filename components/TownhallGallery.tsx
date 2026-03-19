'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X } from 'lucide-react';

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

        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
            >
              <motion.div
                layoutId={selectedImage}
                className="relative max-w-5xl w-full aspect-[4/3] neu-card bg-white overflow-hidden cursor-default"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={selectedImage}
                  alt="Full size preview"
                  fill
                  className="object-contain"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 w-12 h-12 bg-white border-4 border-black rounded-xl flex items-center justify-center neu-shadow active:shadow-none transition-all z-20"
                >
                  <X className="w-6 h-6 text-black" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
