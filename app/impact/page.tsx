'use client';

import { motion } from 'framer-motion';
import HeroSection from '@/components/HeroSection';
import StatCard from '@/components/StatCard';
import PartnersSection from '@/components/PartnersSection';

export default function ImpactPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <HeroSection 
        headline="Impact Dashboard: The Trans Nzoia Pilot."
        subheadline="Data-driven insights into the activation of youth civic power and electoral participation."
      />

      <section className="w-full py-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
             {[
               { number: '1,000+', label: 'Activated Youth' },
               { number: '5', label: 'Engagement Wards' },
               { number: '85%', label: 'Retention Rate' },
               { number: '10k+', label: 'Community Gated' },
             ].map((stat, idx) => (
               <div key={idx} className="modern-card p-10 bg-black/40 backdrop-blur-sm text-center">
                  <div className="text-5xl font-black text-primary mb-4">{stat.number}</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-white/30">{stat.label}</div>
               </div>
             ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
             <motion.div
               initial={{ opacity: 0, x: -30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
             >
               <h2 className="mb-10 font-black tracking-tighter">WARD-LEVEL <br /><span className="text-primary italic">ENGAGEMENT</span></h2>
               <div className="space-y-6">
                  {['Saboti', 'Kiminini', 'Cherangany', 'Endebess', 'Kitale'].map((ward, i) => (
                    <div key={i} className="flex items-center justify-between p-6 modern-card">
                       <span className="font-black uppercase tracking-widest">{ward}</span>
                       <span className="text-primary font-black uppercase tracking-widest">Activated</span>
                    </div>
                  ))}
               </div>
             </motion.div>
             
             <div className="modern-card p-12 bg-white/5 relative overflow-hidden group">
                <div className="glow-orb top-0 left-0 opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <h3 className="text-2xl font-black mb-8 italic uppercase">Pilot Summary</h3>
                <p className="text-white/60 font-medium leading-relaxed mb-8">
                  The Trans Nzoia Pilot serves as the blueprint for our national rollout. By focusing on ward-level mobilization, we've established a scalable infrastructure for youth civic power.
                </p>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     whileInView={{ width: '75%' }}
                     transition={{ duration: 1.5 }}
                     className="h-full bg-primary"
                   />
                </div>
                <div className="mt-4 flex justify-between text-[10px] font-black uppercase tracking-widest">
                   <span>Coverage</span>
                   <span>75%</span>
                </div>
             </div>
          </div>
        </div>
      </section>

      <PartnersSection />
    </div>
  );
}
