'use client';

import { motion } from 'framer-motion';
import HeroSection from '@/components/HeroSection';
import PartnersSection from '@/components/PartnersSection';
import Image from 'next/image';

export default function TechPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <HeroSection 
        headline="Digital Resilience & Sovereignty"
        subheadline="Leveraging the Uamuzi platform to translate digital energy into structured, secure civic power."
        imageSrc="/trans-nzoia-townhall/tnts-image08.jpeg"
      />

      <section className="w-full py-32">
        <div className="max-w-7xl mx-auto px-4">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="relative aspect-square modern-card overflow-hidden">
                 <Image 
                   src="/partners/uamuzi-logo.png" 
                   alt="Uamuzi Platform" 
                   fill 
                   className="object-contain p-20 grayscale group-hover:grayscale-0 transition-all"
                 />
                 <div className="absolute inset-0 bg-primary/5"></div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="mb-10 font-black tracking-tighter">THE UAMUZI <br /><span className="text-primary italic">INTEGRATION</span></h2>
                <p className="text-xl text-white/50 mb-12 font-medium leading-relaxed">
                  Technology is the backbone of our continuity. By leveraging the Uamuzi Platform, we ensure that youth energy isn't just captured during events, but sustained through digital continuity.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {[
                     'Secure Data Capture',
                     'Real-time Verification',
                     'Distributed Oversight',
                     'Transparent Governance'
                   ].map((feature, i) => (
                     <div key={i} className="modern-card p-6 bg-white/5 text-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">{feature}</span>
                     </div>
                   ))}
                </div>
              </motion.div>
           </div>
        </div>
      </section>

      <PartnersSection />
    </div>
  );
}
