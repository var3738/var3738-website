"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const IMAGES_COUNT = 40;
const IMAGES = Array.from({ length: IMAGES_COUNT }, (_, i) => {
    const num = (i + 1).toString().padStart(2, '0');
    return `/trans-nzoia-townhall/tnts-image${num}.jpeg`;
  });

const TRACKS = [
  {
    id: "01",
    title: "Election Integrity & Observation",
    content:
      "Deployed trained youth observers for November 2025 by-elections, providing independent oversight.",
  },
  {
    id: "02",
    title: '"Variant Voices" Podcast',
    content:
      "Digital platform fostering substantive, issue-based political discourse, moving away from tribal politics.",
  },
  {
    id: "03",
    title: "Youth Dialogue Forums",
    content:
      'County-level "Barazas" convening youth for intergenerational dialogue essential for stability.',
  },
  {
    id: "04",
    title: "Grassroots Network",
    content:
      "National presence ensures initiatives have local legitimacy and reach beyond Nairobi.",
  },
];

export default function ProvenTrackRecord() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

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
              <span className="text-primary italic">TRACK RECORD</span>
            </h2>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="modern-card p-4 relative aspect-video overflow-hidden w-full"
          >
            <AnimatePresence mode="popLayout">
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0"
              >
                <Image
                  src={IMAGES[currentImageIndex]}
                  alt={`Track Record ${currentImageIndex + 1}`}
                  fill
                  className="object-cover opacity-60"
                />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent z-10"></div>
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
                <span className="text-4xl font-black text-primary/20 group-hover:text-primary transition-colors">
                  {track.id}
                </span>
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
