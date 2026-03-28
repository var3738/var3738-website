'use client';

import { useState, useEffect } from 'react';
import PartnerCard from './PartnerCard';
import { motion } from 'framer-motion';
import { api, Partner } from '@/lib/api';
import { Loader2 } from 'lucide-react';

export default function PartnersSection({ title = "Engaged Partners", className = "" }: { title?: string, className?: string }) {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPartners() {
      try {
        const data = await api.getPartners();
        setPartners(data);
      } catch (err) {
        console.error('Failed to load partners:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadPartners();
  }, []);

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

        {isLoading ? (
          <div className="w-full flex justify-center py-10">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {partners.map((partner, idx) => (
              <PartnerCard 
                key={partner.id} 
                name={partner.name} 
                logo={partner.logo} 
                url={partner.url}
                index={idx} 
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
