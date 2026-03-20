'use client';

import { motion } from 'framer-motion';
import React, { useState } from 'react';
import Image from 'next/image';
import ImagePreviewModal from './ImagePreviewModal';

interface CreativeNeuCardProps {
  title: React.ReactNode;
  subtitle?: string;
  mainText?: string;
  image?: string;
  hoverText?: string;
  accentColor?: string;
  secondaryColor?: string;
  floatingShapes?: {
    topRight?: 'circle' | 'square';
    bottomLeft?: 'circle' | 'square';
    topRightColor?: string;
    bottomLeftColor?: string;
  };
  className?: string;
}

export default function CreativeNeuCard({
  title,
  subtitle,
  mainText,
  image,
  hoverText = "POWER",
  accentColor = "bg-primary",
  secondaryColor = "text-secondary",
  floatingShapes = {
    topRight: 'circle',
    bottomLeft: 'square',
    topRightColor: 'bg-secondary',
    bottomLeftColor: 'bg-accent'
  },
  className = ""
}: CreativeNeuCardProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
        className={`relative ${className}`}
      >
        <div className="relative w-full aspect-square bg-white border-4 border-black rounded-[3rem] neu-shadow-lg p-10 flex flex-col justify-center items-center overflow-hidden">
          {/* Browser Top Bar */}
          <div className="absolute top-0 left-0 w-full h-12 bg-black flex items-center px-6 gap-2">
            <div className="w-3 h-3 bg-[#ff6b6b] rounded-full border-2 border-white"></div>
            <div className="w-3 h-3 bg-primary rounded-full border-2 border-white"></div>
            <div className="w-3 h-3 bg-accent rounded-full border-2 border-white"></div>
          </div>
          
          {/* Main Content Area */}
          <div 
            onClick={() => image && setIsPreviewOpen(true)}
            className={`w-48 h-48 ${accentColor} border-4 border-black rounded-full flex items-center justify-center relative overflow-hidden group ${image ? 'cursor-pointer' : ''}`}
          >
             {image ? (
               <Image 
                 src={image} 
                 alt="Creative Card Feature" 
                 fill 
                 className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110" 
               />
             ) : (
               <span className="text-8xl font-black italic transform -rotate-12 select-none">{mainText}</span>
             )}
             <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500 flex items-center justify-center">
                <span className="text-white text-4xl font-black italic uppercase">{hoverText}</span>
             </div>
          </div>

          {/* Text Content */}
          <div className="mt-12 text-center text-4xl font-black leading-tight uppercase">
            {title}
            {subtitle && (
              <>
                <br />
                <span className={`${secondaryColor} italic`}>{subtitle}</span>
              </>
            )}
          </div>
        </div>
        
        {/* Decorative floating blocks */}
        {floatingShapes.bottomLeft && (
          <div className={`absolute -bottom-8 -left-8 w-24 h-24 ${floatingShapes.bottomLeftColor} border-4 border-black ${floatingShapes.bottomLeft === 'circle' ? 'rounded-full' : 'rounded-2xl'} rotate-12 neu-shadow animate-bounce-slow`}></div>
        )}
        {floatingShapes.topRight && (
          <div className={`absolute -top-8 -right-8 w-32 h-32 ${floatingShapes.topRightColor} border-4 border-black ${floatingShapes.topRight === 'circle' ? 'rounded-full' : 'rounded-2xl'} -rotate-6 neu-shadow animate-pulse-slow`}></div>
        )}
      </motion.div>

      <ImagePreviewModal 
        src={isPreviewOpen && image ? image : null} 
        onClose={() => setIsPreviewOpen(false)} 
      />
    </>
  );
}
