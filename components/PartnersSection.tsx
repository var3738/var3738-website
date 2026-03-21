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
  {
    name: 'IEBC',
    logo: '/partners/IEBC_Emblem-nobg.png', // Placeholder if NED logo missing, but user said "NED"
    url: 'https://www.iebc.or.ke/'
  },
  {
    name: 'Allan Chesang Foundation',
    logo: '/partners/allan-chesang-foundation-logo.png', // Placeholder if NED logo missing, but user said "NED"
    url: 'https://acfkenya.com/'
  }
];

export default function PartnersSection({ title = "Engaged Partners", className = "" }: { title?: string, className?: string }) {
  return (
    <section className={`w-full py-32 bg-background border-y border-border relative ${className}`}>
      <div className="glow-orb top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter">
            {title}
          </h2>
          <p className="text-white/40 font-medium uppercase tracking-widest text-xs">
            Institutionalizing change with global support
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
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
      </div>
    </section>
  );
}
