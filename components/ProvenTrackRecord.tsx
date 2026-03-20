'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const TRACKS = [
  {
    id: '01',
    title: 'Election Integrity & Observation',
    content: 'Deployed trained youth observers for November 2025 by-elections, providing independent oversight.'
  },
  {
    id: '02',
    title: '"Variant Voices" Podcast',
    content: 'Digital platform fostering substantive, issue-based political discourse, moving away from tribal politics.'
  },
  {
    id: '03',
    title: 'Youth Dialogue Forums',
    content: 'County-level "Barazas" convening youth for intergenerational dialogue essential for stability.'
  },
  {
    id: '04',
    title: 'Grassroots Network',
    content: 'National presence ensures initiatives have local legitimacy and reach beyond Nairobi.'
  }
];

export default function ProvenTrackRecord() {
  return (
    <section className="w-full py-32 bg-black relative overflow-hidden px-4 border-t border-white/5">
      <div className="glow-orb -top-20 -right-20 opacity-10"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-end mb-20">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-6">
              Execution Excellence
            </div>
            <h2 className="text-5xl lg:text-7xl font-black mb-10 tracking-tighter leading-none">
              PROVEN <br />
              <span className="text-white/20 italic">TRACK RECORD</span>
            </h2>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="modern-card p-4 relative aspect-video overflow-hidden w-full"
          >
            <Image 
              src="/trans-nzoia-townhall/tnts-image11.jpeg"
              alt="Track Record"
              fill
              className="object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent"></div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
          {TRACKS.map((track, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-black p-12 group hover:bg-white/2 transition-colors"
            >
              <div className="flex items-start gap-6">
                <span className="text-4xl font-black text-primary/20 group-hover:text-primary transition-colors">{track.id}</span>
                <div>
                  <h3 className="text-2xl font-black mb-6 uppercase tracking-tighter">
                    {track.title}
                  </h3>
                  <p className="text-white/50 text-lg font-medium leading-relaxed">
                    {track.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
