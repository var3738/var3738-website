'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ImagePreviewModalProps {
  src: string | null;
  onClose: () => void;
}

export default function ImagePreviewModal({ src, onClose }: ImagePreviewModalProps) {
  return (
    <AnimatePresence>
      {src && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-100 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
        >
          <motion.div
            initial={{ scale: 0.9, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 40 }}
            className="relative w-full h-full flex items-center justify-center cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full">
              <Image
                src={src}
                alt="Full size preview"
                fill
                className="object-contain"
                priority
              />
            </div>
            <button
              onClick={onClose}
              className="absolute top-0 right-0 md:-top-4 md:-right-4 w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 transition-all z-110 backdrop-blur-md"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </motion.div>
          
          {/* Subtle info text */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 select-none">
            Click anywhere to close
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
