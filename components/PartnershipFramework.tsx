'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, BarChart3, LineChart, Target, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import StrategicAlignment from './StrategicAlignment';

export default function PartnershipFramework() {
  const [showAlignment, setShowAlignment] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (showAlignment) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [showAlignment]);
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
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="crimson-btn text-[10px] uppercase tracking-[0.2em] px-10 py-5">
                Initiate Dialogue
              </button>
              <button 
                onClick={() => setShowAlignment(true)}
                className="crimson-btn-outline text-[10px] uppercase tracking-[0.2em] px-10 py-5"
              >
                View Shared Objectives
              </button>
            </div>
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

      {/* Strategic Alignment Modal */}
      {mounted && createPortal(
        <AnimatePresence>
          {showAlignment && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-10">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAlignment(false)}
                className="absolute inset-0 bg-black/90 backdrop-blur-xl"
              />

              {/* Modal Container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-7xl max-h-[90vh] overflow-y-auto modern-card bg-background border border-white/10 p-6 md:p-12 no-scrollbar"
              >
                {/* Close Button */}
                <button
                  onClick={() => setShowAlignment(false)}
                  className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:text-black transition-all z-50 text-white"
                >
                  <X size={20} />
                </button>

                <div className="relative pt-8">
                  <StrategicAlignment isModal />
                </div>

                <div className="mt-12 pt-8 border-t border-white/5 text-center">
                   <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Partnership Framework &copy; 2026</p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}
