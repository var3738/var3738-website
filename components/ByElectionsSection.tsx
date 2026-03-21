'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const IMAGES_COUNT = 9;
const IMAGES = Array.from({ length: IMAGES_COUNT }, (_, i) => {
    const num = (i + 1).toString().padStart(2, '0');
    return `/activity-pics/baringo/activity-pics-baringo${num}.jpeg`;
  });


export default function ByElectionsSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full py-32 bg-black relative overflow-hidden px-4 border-t border-white/5">
      <div className="glow-orb top-0 right-0 opacity-10"></div>
      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        
        {/* Images on the Left this time */}
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           className="relative aspect-4/3 w-full rounded-2xl border border-white/10 bg-white/5 overflow-hidden group shadow-2xl order-2 lg:order-1"
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
                alt="VAR By-Elections Observation"
                fill
                className="object-cover opacity-80"
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Text on the Right */}
        <motion.div
           initial={{ opacity: 0, x: 30 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
           className="order-1 lg:order-2"
        >
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-6">Electoral Integrity</div>
          <h2 className="text-5xl lg:text-7xl font-black mb-10 tracking-tighter leading-none">
            BY-ELECTION <br /><span className="text-primary italic">OBSERVATION</span>
          </h2>
          <p className="text-lg text-white/60 mb-6 font-medium leading-relaxed">
            In October 2025, VAR 37/38 deployed trained independent observers across Baringo, Embu (Mbeere North), Nyamira, and Bungoma counties. 
          </p>
          <ul className="space-y-6 mb-8">
            <li className="flex items-start gap-4">
              <span className="text-primary font-black mt-1">01</span>
              <div>
                <h4 className="font-bold text-white mb-1">Independent Monitoring</h4>
                <p className="text-white/50 text-sm">Direct observation of polling, counting, and tallying procedures to safeguard electoral transparency.</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-primary font-black mt-1">02</span>
              <div>
                <h4 className="font-bold text-white mb-1">Security & Environment Assessment</h4>
                <p className="text-white/50 text-sm">Detailed reporting on police conduct, political interference, and voter intimidation to hold institutions accountable.</p>
              </div>
            </li>
          </ul>
          <p className="text-sm text-white/40 italic pl-4 border-l-2 border-primary/50">
            "VAR emphasizes that political actors bear primary responsibility for creating an environment conducive to free and fair elections."<br className="mb-2"/> - VAR Observation Report, 2025
          </p>
        </motion.div>
      </div>
    </section>
  );
}
