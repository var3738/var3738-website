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
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative max-w-5xl w-full aspect-[4/3] bg-white border-8 border-black neu-shadow-lg overflow-hidden cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={src}
              alt="Full size preview"
              fill
              className="object-contain"
            />
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-12 h-12 bg-white border-4 border-black rounded-xl flex items-center justify-center neu-shadow active:shadow-none transition-all z-20"
            >
              <X className="w-6 h-6 text-black" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
