'use client';

import { motion } from 'framer-motion';
import HeroSection from '@/components/HeroSection';
import PartnersSection from '@/components/PartnersSection';

export default function AgendaPage() {
  const priorities = [
    { title: 'Systemic Representation', desc: 'Transitioning from protest-based demands to sustained representation in formal governance structures.' },
    { title: 'Generational Policy', desc: 'Crafting policies that reflect the specific needs and aspirations of Kenyas 75% youth population.' },
    { title: 'Accountability Frameworks', desc: 'Establishing digital and physical mechanisms for real-time oversight of elected representatives.' },
    { title: 'Economic Integration', desc: 'Linking civic participation with economic empowerment strategies for the youth.' }
  ];

  return (
    <div className="bg-background text-foreground min-h-screen">
      <HeroSection 
        headline="National Youth Agenda: Movement-to-System."
        subheadline="A professional framework for shifting KENYA from emotional politics to issue-based dialogue."
      />

      <section className="w-full py-32 bg-background relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
           <motion.div
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="mb-20"
           >
              <h2 className="mb-10 font-black tracking-tighter">Strategic <br /><span className="text-primary italic">Priorities</span></h2>
              <div className="space-y-12">
                 {priorities.map((item, i) => (
                   <div key={i} className="group border-l border-white/10 pl-8 hover:border-primary transition-colors">
                      <h3 className="text-2xl font-black mb-4 group-hover:text-primary transition-colors">{item.title}</h3>
                      <p className="text-white/50 font-medium leading-relaxed">{item.desc}</p>
                   </div>
                 ))}
              </div>
           </motion.div>

           <div className="modern-card p-12 bg-white/5 border border-primary/20">
              <h3 className="text-3xl font-black mb-8 italic">The Roadmap</h3>
              <div className="space-y-8">
                 {[
                   { step: 'Activation', status: 'In Progress' },
                   { step: 'Legislation', status: 'Q3 2026' },
                   { step: 'Integration', status: '2027' }
                 ].map((node, i) => (
                   <div key={i} className="flex items-center justify-between">
                      <span className="font-black uppercase tracking-widest">{node.step}</span>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${node.status === 'In Progress' ? 'border-primary text-primary' : 'border-white/10 text-white/20'}`}>
                        {node.status}
                      </span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </section>

      <PartnersSection />
    </div>
  );
}
