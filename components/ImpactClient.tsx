'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import HeroSection from '@/components/HeroSection';
import StatCard from '@/components/StatCard';
import PartnersSection from '@/components/PartnersSection';
import PulseMap from '@/components/geo/PulseMap';
import ActivationRadar from '@/components/geo/ActivationRadar';
import DataExportPortal from '@/components/geo/DataExportPortal';

export default function ImpactClient() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <HeroSection
        headline="Impact Dashboard"
        subheadline="Tracking the movement's growth and civic mobilization across Kenya."
        imageSrc="/trans-nzoia-townhall/tnts-image03.jpeg"
      />

      {/* Main Visualization Grid */}
      <section className="w-full py-32 bg-background border-t border-white/5 relative overflow-hidden">
        <div className="glow-orb top-0 right-0 opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-32">
             <div className="lg:col-span-2 h-[600px]">
                <PulseMap />
             </div>
             <div className="h-[600px]">
                <ActivationRadar />
             </div>
          </div>

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
            </div>
          </div>
        </div>
      </section>

      {/* Data Sovereignty Section */}
      <section className="w-full py-32 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <DataExportPortal />
        </div>
      </section>

      <PartnersSection />
    </div>
  );
}
