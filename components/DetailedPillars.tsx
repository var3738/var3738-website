'use client';

import { motion } from 'framer-motion';
import { Zap, ShieldCheck, MessageSquare, ArrowRight } from 'lucide-react';

const PILLARS = [
  {
    id: 'PILLAR 1',
    title: 'Youth Civic Leadership Accelerator',
    description: '6-month hybrid fellowship for 150 high-potential youth. Focusing on democratic theory, public policy analysis, and ethical leadership.',
    tags: ['Civic Fellowship', 'Ethical Leadership', 'National Campaign'],
    icon: <Zap size={24} className="text-primary" />
  },
  {
    id: 'PILLAR 2',
    title: 'Digital Citizenship & Integrity Lab',
    description: '"Verify Before You Amplify" workshops for 500+ creators. Training on digital forensics and countering hate speech.',
    tags: ['Forensics', 'Media Literacy', 'Counter-Narratives'],
    icon: <ShieldCheck size={24} className="text-primary" />
  },
  {
    id: 'PILLAR 3',
    title: 'Community Dialogue for Peace',
    description: 'Establishing permanent Youth Peace Hubs in 10 sensitive counties. Facilitating the bottom-up National Youth Agenda process.',
    tags: ['Peace Hubs', 'Social Cohesion', 'Policy Manifestos'],
    icon: <MessageSquare size={24} className="text-primary" />
  }
];

export default function DetailedPillars() {
  return (
    <section className="w-full py-32 bg-background relative overflow-hidden px-4 border-t border-white/5">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-20">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-6">
            Institutional Pillars
          </div>
          <h2 className="text-5xl lg:text-7xl font-black mb-10 tracking-tighter leading-none">
            THE 3-STAGE <br />
            <span className="text-primary italic">PILLARS</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {PILLARS.map((pillar, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="modern-card p-10 flex flex-col h-full group"
            >
              <div className="text-[10px] font-black text-primary tracking-[0.2em] mb-8">{pillar.id}</div>
              <div className="mb-10 w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/30 transition-all">
                {pillar.icon}
              </div>
              <h3 className="text-2xl font-black mb-6 uppercase tracking-tighter leading-tight">
                {pillar.title}
              </h3>
              <p className="text-white/50 text-lg font-medium leading-relaxed mb-10 grow">
                {pillar.description}
              </p>
              <div className="flex flex-wrap gap-2 pt-6 border-t border-white/5">
                {pillar.tags.map((tag, tIdx) => (
                  <span key={tIdx} className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full text-white/40">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
