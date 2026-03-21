'use client';

import { motion } from 'framer-motion';
import { Shield, Users, Search, Globe } from 'lucide-react';

const ALIGNMENTS = [
  {
    title: 'Democratic Governance',
    description: "Institutionalizing youth participation in electoral and civic processes to enhance democracy's legitimacy and inclusivity.",
    icon: <Globe size={24} className="text-primary" />
  },
  {
    title: 'Youth Leadership',
    description: 'Building capacity of ethical, informed, peace-oriented youth leaders through hands-on training and national platforms.',
    icon: <Users size={24} className="text-primary" />
  },
  {
    title: 'Counter Disinformation',
    description: 'Arming young Kenyans with digital literacy tools to resist malign narratives and hate speech, promoting pre-electoral cohesion.',
    icon: <Search size={24} className="text-primary" />
  },
  {
    title: 'Civil Society',
    description: 'Supporting a locally-grown, youth-led institution modeling transparency, accountability, and issue-based advocacy.',
    icon: <Shield size={24} className="text-primary" />
  }
];

export default function StrategicAlignment() {
  return (
    <section className="w-full py-32 bg-background relative overflow-hidden px-4 border-t border-white/5">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-20">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-6">
            Strategic Alignment
          </div>
          <h2 className="text-5xl lg:text-7xl font-black mb-10 tracking-tighter leading-none">
            SHARED OBJECTIVES <br />
            <span className="text-primary italic text-4xl lg:text-6xl">WITH U.S. EMBASSY</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {ALIGNMENTS.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="modern-card p-10 group hover:border-primary/30 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:bg-primary/10 group-hover:border-primary/30 transition-all">
                {item.icon}
              </div>
              <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <p className="text-white/50 text-lg font-medium leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
