'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import HeroSection from '@/components/HeroSection';
import StatCard from '@/components/StatCard';
import PartnersSection from '@/components/PartnersSection';

export default function ImpactPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <HeroSection
        headline="Impact Dashboard"
        subheadline="Tracking the movement's growth and civic mobilization across Kenya."
        imageSrc="/trans-nzoia-townhall/tnts-image03.jpeg"
      />

      {/* Advanced Analytics */}
      <section className="w-full py-32 bg-background border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Movement Health */}
            <div className="lg:col-span-2 space-y-8">
              <div className="modern-card p-12 relative overflow-hidden">
                <div className="glow-orb -top-20 -right-20 opacity-10"></div>
                <h3 className="text-3xl font-black mb-10 tracking-tighter italic uppercase">Movement Health</h3>
                <div className="space-y-10">
                  {[
                    { label: 'Voter Registration Conversion', value: '68%', color: 'bg-primary' },
                    { label: 'Ward Leader Retention', value: '92%', color: 'bg-white' },
                    { label: 'Digital Engagement Index', value: '45%', color: 'bg-primary/40' },
                  ].map((metric, i) => (
                    <div key={i} className="space-y-4">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
                        <span>{metric.label}</span>
                        <span className="text-white">{metric.value}</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: metric.value }}
                          transition={{ duration: 1, delay: i * 0.2 }}
                          className={`h-full ${metric.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Voter Density Grid (Mock) */}
              <div className="modern-card p-12">
                 <h3 className="text-3xl font-black mb-10 tracking-tighter italic uppercase">Activation Density</h3>
                 <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
                    {Array.from({ length: 48 }).map((_, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: i * 0.01 }}
                        className={`aspect-square rounded-[2px] ${i % 3 === 0 ? 'bg-primary' : i % 5 === 0 ? 'bg-primary/20' : 'bg-white/5'}`}
                      />
                    ))}
                 </div>
                 <div className="mt-8 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white/20">
                    <span>Trans Nzoia Coverage Map</span>
                    <span className="flex items-center gap-4">
                       <span className="flex items-center gap-1"><div className="w-2 h-2 bg-primary rounded-full"></div> High</span>
                       <span className="flex items-center gap-1"><div className="w-2 h-2 bg-white/5 rounded-full"></div> Baseline</span>
                    </span>
                 </div>
              </div>
            </div>

            {/* Mobilization Funnel */}
            <div className="modern-card p-12 flex flex-col justify-between">
              <div>
                <h3 className="text-3xl font-black mb-10 tracking-tighter italic uppercase underline decoration-primary decoration-4 underline-offset-8">The Funnel</h3>
                <div className="space-y-12 relative">
                  <div className="absolute left-6 top-4 bottom-4 w-px bg-white/10"></div>
                  {[
                    { step: 'Awareness', count: '50k+', desc: 'Digital Impressions' },
                    { step: 'Engagement', count: '12k+', desc: 'Active Discourse' },
                    { step: 'Activation', count: '1,000+', desc: 'In-person Townhalls' },
                    { step: 'Continuity', count: '450', desc: 'Secure Platform Gating' },
                  ].map((f, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.2 }}
                      className="relative pl-16"
                    >
                      <div className="absolute left-4 top-1 w-4 h-4 rounded-full bg-black border-2 border-primary z-10"></div>
                      <div className="text-2xl font-black tracking-tighter uppercase leading-none mb-1">{f.step}</div>
                      <div className="text-primary font-black text-xs mb-2">{f.count}</div>
                      <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">{f.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="pt-10">
                 <p className="text-xs text-white/40 font-medium italic border-l-2 border-primary pl-4">
                   "We don't measure likes; we measure institutional participation."
                 </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ward Granularity (Existing) */}
      <section className="w-full py-32 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-10 font-black tracking-tighter">WARD-LEVEL <br /><span className="text-primary italic">ENGAGEMENT</span></h2>
              <div className="space-y-6">
                 {['Saboti', 'Kiminini', 'Cherangany', 'Endebess', 'Kitale'].map((ward, i) => (
                   <div key={i} className="flex items-center justify-between p-6 modern-card group hover:border-primary/40 transition-all">
                      <span className="font-black uppercase tracking-widest group-hover:text-primary transition-colors">{ward}</span>
                      <span className="text-primary font-black uppercase tracking-widest text-[10px]">Activated</span>
                   </div>
                 ))}
              </div>
            </motion.div>
            
            <div className="modern-card p-4 relative aspect-square overflow-hidden rounded-full border-primary/20">
               <Image 
                 src="/trans-nzoia-townhall/tnts-image12.jpeg"
                 alt="Impact Focus"
                 fill
                 className="object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-1000"
               />
               <div className="absolute inset-0 bg-radial-to-t from-black via-transparent to-transparent"></div>
               <div className="relative z-10 h-full flex items-center justify-center text-center p-12">
                  <div className="bg-black/80 backdrop-blur-md p-10 border border-white/10 rounded-3xl">
                    <h3 className="text-5xl font-black mb-4 tracking-tighter italic">BLUEPRINT</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 leading-relaxed">
                      Trans Nzoia serves as the pilot for Kenya's national youth activation strategy.
                    </p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      <PartnersSection />
    </div>
  );
}
