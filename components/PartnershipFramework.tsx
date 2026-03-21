'use client';

import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, LineChart, Target } from 'lucide-react';

export default function PartnershipFramework() {
  return (
    <section className="w-full py-32 bg-black relative overflow-hidden px-4 border-y border-white/5">
      <div className="glow-orb -bottom-20 -right-20 opacity-10"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-6">
              Call to Action
            </div>
            <h2 className="text-5xl lg:text-7xl font-black mb-10 tracking-tighter leading-none">
              PARTNERSHIP <br />
              <span className="text-primary italic">FRAMEWORK</span>
            </h2>
            <p className="text-white/60 text-xl font-medium leading-relaxed mb-12">
              VAR is ready to serve as a key implementing partner for youth and democracy objectives in Kenya. 
              By investing in VAR, you invest directly in the energy, intellect, and democratic aspirations of Kenya's youth.
            </p>
            <button className="crimson-btn text-[10px] uppercase tracking-[0.2em] px-10 py-5">
              Initiate Dialogue
            </button>
          </motion.div>

          <div className="grid grid-cols-1 gap-6">
            {[
              { 
                title: 'Joint Strategic Committee', 
                desc: 'Bi-annual meetings for strategic review and coordination.',
                icon: <Target size={20} className="text-primary" />
              },
              { 
                title: 'Integrated Work Planning', 
                desc: "Aligning VAR's activity calendar with partner programmatic cycles.",
                icon: <LineChart size={20} className="text-primary" />
              },
              { 
                title: 'Monitoring & Evaluation', 
                desc: 'Quarterly reports with impact metrics and narrative analysis.',
                icon: <BarChart3 size={20} className="text-primary" />
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="modern-card p-8 flex items-center gap-8 group"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary/10 transition-all shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-lg font-black uppercase tracking-tighter mb-1">{item.title}</h4>
                  <p className="text-sm font-medium text-white/40">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
