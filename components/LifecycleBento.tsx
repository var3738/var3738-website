'use client';

import { motion } from 'framer-motion';
import { Heart, Zap, Globe, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const STAGES = [
  {
    id: '01',
    title: 'STREETS (Connect)',
    description: 'Grassroots mobilization and lived-experience storytelling. Engaging youth where they are, from the streets to the communities.',
    icon: <Heart className="text-primary" size={24} />,
    color: 'from-primary/20 to-transparent',
    link: '/democracy-activated'
  },
  {
    id: '02',
    title: 'IDEOLOGY (Converse)',
    description: 'Shifting from emotional politics to issue-based policy dialogue. Strategic workshops and townhall discussions.',
    icon: <Zap className="text-primary" size={24} />,
    color: 'from-primary/20 to-transparent',
    link: '/agenda'
  },
  {
    id: '03',
    title: 'TECHNOLOGY (Continue)',
    description: 'Digital continuity and data capture via the Uamuzi Platform. Building the long-term infrastructure for civic power.',
    icon: <Globe className="text-primary" size={24} />,
    color: 'from-primary/20 to-transparent',
    link: '/tech'
  }
];

export default function LifecycleBento() {
  return (
    <section className="w-full py-32 bg-background relative overflow-hidden px-4">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-20 text-center lg:text-left">
           <h2 className="mb-6 font-black tracking-tighter">
             The 3-Stage <br />
             <span className="text-primary italic">Lifecycle</span>
           </h2>
           <p className="text-white/40 max-w-xl text-lg font-medium">
             An integrated framework designed to transition grassroots energy into institutionalized civic oversight.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STAGES.map((stage, idx) => (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="modern-card group p-10 flex flex-col justify-between h-[450px] relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-linear-to-br ${stage.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                    {stage.icon}
                  </div>
                  <span className="text-6xl font-black text-white/5 group-hover:text-primary/10 transition-colors">
                    {stage.id}
                  </span>
                </div>
                
                <h3 className="text-2xl font-black mb-6 group-hover:text-primary transition-colors">
                  {stage.title}
                </h3>
                <p className="text-white/50 leading-relaxed font-medium">
                  {stage.description}
                </p>
              </div>

              <Link 
                href={stage.link}
                className="relative z-10 inline-flex items-center gap-2 font-black uppercase tracking-widest text-[10px] text-primary hover:gap-4 transition-all"
              >
                Learn More <ArrowRight size={14} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
