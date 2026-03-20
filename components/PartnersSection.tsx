'use client';

import PartnerCard from './PartnerCard';
import { motion } from 'framer-motion';

const PARTNERS = [
  { 
    name: 'Uamuzi Foundation', 
    logo: '/partners/uamuzi-logo.png', 
    url: 'https://www.uamuzi.org' 
  },
  { 
    name: 'CMD Kenya', 
    logo: '/partners/cmd-kenya.webp', 
    url: 'https://cmd-kenya.org/' 
  },
  { 
    name: 'U.S Embassy', 
    logo: '/partners/us-embassy.webp', 
    url: 'https://ke.usembassy.gov/' 
  },
];

export default function PartnersSection({ title = "Strategic Partners", className = "" }: { title?: string, className?: string }) {
  return (
    <section className={`w-full py-24 bg-black text-white border-y-8 border-black ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none inline-block">
            {title.split(' ').map((word, i) => (
               <span key={i} className={i % 2 !== 0 ? 'text-secondary' : 'text-white'}>{word} </span>
            ))}
          </h2>
          <div className="h-2 w-48 bg-secondary mx-auto mt-4 border-2 border-white"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {PARTNERS.map((partner, idx) => (
            <PartnerCard 
              key={partner.name} 
              name={partner.name} 
              logo={partner.logo} 
              url={partner.url}
              index={idx} 
            />
          ))}
        </div>

        <p className="text-center text-xl font-bold mt-16 text-white/60 max-w-2xl mx-auto uppercase tracking-wide italic">
          Powered by partnerships that believe in youth-led change. Real impact through strategic collaboration.
        </p>
      </div>
    </section>
  );
}
