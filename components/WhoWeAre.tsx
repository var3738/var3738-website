"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";

const IMAGES_COUNT = 3;
const IMAGES = Array.from({ length: IMAGES_COUNT }, (_, i) => {
  const num = (i + 1).toString().padStart(2, "0");
  console.log(num);
  return `/group-pics/group-pic-${num}.jpeg`;
});

export default function WhoWeAre() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full py-32 bg-black relative overflow-hidden px-4 border-t border-white/5">
      <div className="glow-orb -bottom-20 -left-20 opacity-10"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-6">
              The Movement
            </div>
            <h2 className="text-5xl lg:text-7xl font-black mb-10 tracking-tighter leading-none">
              WHO WE ARE: <br />
              <span className="text-primary italic">VAR 37-38</span>
            </h2>
            <div className="space-y-6 text-xl font-medium text-white/60 leading-relaxed">
              <p>
                VAR is a dynamic, youth-led civic movement built on
                transformative action. VAR 37-38 represents empowered youth
                utilizing constitutional rights to assemble
                <span className="text-white"> (Art. 37)</span> and channel
                energy into political action
                <span className="text-white"> (Art. 38)</span>.
              </p>
              <p>
                We represent a national network of digitally-savvy,
                grassroots-connected young Kenyans actively shaping a more
                participatory, accountable, and peaceful political future.
              </p>
            </div>
          </motion.div>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="modern-card p-4 relative aspect-video overflow-hidden"
            >
              <Image
                src={IMAGES[currentImageIndex]}
                alt="VAR 37-38 youth movement members engaging in civic dialogue"
                fill
                className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-x-0 bottom-0 p-8 bg-linear-to-t from-black to-transparent">
                {/* <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                  We are an amazing team :)
                </p> */}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="modern-card p-12 relative"
            >
              <div className="text-6xl font-black text-primary/50 absolute top-18 md:top-8 right-10 leading-none">
                75%
              </div>
              <h3 className="text-3xl font-black mb-8 uppercase tracking-tighter italic">
                Demographic Power
              </h3>
              <p className="text-white/60 text-lg font-medium leading-relaxed">
                Our core value: an intrinsic, trusted connection to Kenya's
                youth demographic—over 75% of the population—engaging them in
                their own spaces and cultural contexts.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
