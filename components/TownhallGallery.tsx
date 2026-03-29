'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import ImagePreviewModal from './ImagePreviewModal';
import { api, GalleryItem } from '@/lib/api';
import { Loader2 } from 'lucide-react';

const IMAGES_COUNT = 44;
const INITIAL_COUNT = 12;

export default function TownhallGallery() {
  const [displayCount, setDisplayCount] = useState(INITIAL_COUNT);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const data = await api.getGallery();
        setGallery(data);
      } catch (err) {
        console.error('Failed to fetch gallery', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchGallery();
  }, []);

  // Merge hardcoded images as fallback/baseline if gallery is small
  const hardcodedImages = Array.from({ length: IMAGES_COUNT }, (_, i) => {
    const num = (i + 1).toString().padStart(2, '0');
    return `/trans-nzoia-townhall/tnts-image${num}.jpeg`;
  }).map((url, idx) => ({ id: `hc-${idx}`, image_url: url, title: 'Townhall Highlight' }));

  const allImages = gallery.length > 0 ? gallery : hardcodedImages;
  const displayedImages = allImages.slice(0, displayCount);
  const totalCount = allImages.length;

  return (
    <section className="w-full py-32 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-20 text-center lg:text-left">
           <h2 className="mb-6 font-black tracking-tighter">
             Voices <br />
             <span className="text-primary italic">Captured</span>
           </h2>
           <p className="text-white/40 max-w-xl text-lg font-medium">
             Full-color highlights from our Trans Nzoia series. Authentic moments of civic activation and community leadership.
           </p>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {displayedImages.map((item, idx) => (
            <motion.div
              key={item.id}
              layoutId={item.image_url}
              onClick={() => setSelectedImage(item.image_url)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx % 4 * 0.1 }}
              viewport={{ once: true }}
              className="relative break-inside-avoid modern-card overflow-hidden group cursor-pointer"
            >
              <Image
                src={item.image_url}
                alt={item.title || `Townhall moment ${idx + 1}`}
                width={500}
                height={500}
                className="w-full object-contain bg-black/20 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-x-0 bottom-0 p-4 bg-linear-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                 <span className="text-[10px] font-black uppercase tracking-widest text-primary">View Full Scale</span>
              </div>
            </motion.div>
          ))}
        </div>

        <ImagePreviewModal 
          src={selectedImage} 
          onClose={() => setSelectedImage(null)} 
        />

        {displayCount < totalCount && (
          <div className="mt-20 text-center">
            <button
              onClick={() => setDisplayCount(prev => Math.min(prev + 12, totalCount))}
              className="crimson-btn-outline px-12"
            >
              Load More Moments
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
