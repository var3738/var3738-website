'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';


const IMAGES_COUNT = 6;
const IMAGES = Array.from({ length: IMAGES_COUNT }, (_, i) => {
    const num = (i + 1).toString().padStart(2, '0');
    return `/activity-pics/dua/activity-pics-dua${num}.jpeg`;
  });


export default function DUAEventSection() {
   const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % IMAGES.length);
      }, 4000);
      console.log(IMAGES);
      return () => clearInterval(interval);
    }, []);


  return (
    <section className="w-full py-32 bg-background relative overflow-hidden px-4 border-t border-white/5">
      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <motion.div
           initial={{ opacity: 0, x: -30 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
        >
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-6">Global Recognition</div>
          <h2 className="text-5xl lg:text-7xl font-black mb-10 tracking-tighter leading-none">
            DUA FORUM <br /><span className="text-primary italic">2025</span>
          </h2>
          <p className="text-lg text-white/60 mb-8 font-medium leading-relaxed">
            VAR 37/38 was honored to be invited to the Democrat Union of Africa (DUA) Forum, hosted by KANU at the Radisson Blu Hotel, Nairobi Upper Hill. 
          </p>
          <p className="text-lg text-white/50 font-medium leading-relaxed">
            Our participation underscores the movement's growing influence and our commitment to engaging with established political institutions to drive issue-based dialogue and youth-centric policy reforms across the continent.
          </p>
        </motion.div>
        
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           className="relative aspect-square w-full rounded-2xl border border-white/10 bg-white/5 overflow-hidden group shadow-2xl"
        >
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <Image 
                src={IMAGES[currentImageIndex]}
                alt="VAR 37/38 at DUA Forum"
                fill
                className="object-cover opacity-80"
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
