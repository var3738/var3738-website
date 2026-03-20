'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import HeroSection from '@/components/HeroSection';
import EventCard from '@/components/EventCard';
import RegistrationForm from '@/components/RegistrationForm';
import StatCard from '@/components/StatCard';
import TownhallGallery from '@/components/TownhallGallery';
import PartnersSection from '@/components/PartnersSection';

export default function DemocracyActivatedPage() {
  const [selectedWard, setSelectedWard] = useState<string | null>(null);

  const wards = [
    { name: 'Saboti', date: 'March 15, 2026', capacity: 45, maxCapacity: 100 },
    { name: 'Kiminini', date: 'March 17, 2026', capacity: 62, maxCapacity: 100 },
    { name: 'Webuye East', date: 'March 19, 2026', capacity: 38, maxCapacity: 100 },
    { name: 'Webuye West', date: 'March 21, 2026', capacity: 71, maxCapacity: 100 },
    { name: 'Bumula', date: 'March 23, 2026', capacity: 54, maxCapacity: 100 },
    { name: 'Kanduyi', date: 'March 25, 2026', capacity: 85, maxCapacity: 100 },
    { name: 'Kimilili', date: 'March 27, 2026', capacity: 42, maxCapacity: 100 },
    { name: 'Bungoma', date: 'March 29, 2026', capacity: 91, maxCapacity: 100 },
    { name: 'Kabuchai', date: 'March 31, 2026', capacity: 67, maxCapacity: 100 },
  ];

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Hero Section */}
      <HeroSection
        headline="Democracy Activated: The Trans Nzoia Series"
        subheadline="Converting protest energy into civic oversight and voter registration. One movement. Unstoppable momentum."
      />

      {/* Strategic Vision */}
      <section className="w-full py-32 relative overflow-hidden">
        <div className="glow-orb top-20 right-0 opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-10 font-black tracking-tighter">
                Systemic <br />
                <span className="text-primary italic">Activation</span>
              </h2>
              <p className="text-xl text-white/60 mb-8 font-medium leading-relaxed">
                From March through May, we activate democracy across nine wards in Trans Nzoia. Youth champions mobilize their communities for townhall discussions where people directly engage with government accountability and electoral participation.
              </p>
              <div className="flex flex-col gap-6">
                 {[
                   'Voter Registration Drives',
                   'Civic Oversight Training',
                   'Policy Dialogue Series',
                   'Digital Engagement Onboarding'
                 ].map((item, i) => (
                   <div key={i} className="flex items-center gap-4 group">
                      <div className="w-2 h-2 rounded-full bg-primary group-hover:scale-150 transition-transform"></div>
                      <span className="text-sm font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">
                        {item}
                      </span>
                   </div>
                 ))}
              </div>
            </motion.div>
            
            <div className="grid grid-cols-2 gap-4">
               {[
                 { number: '9', label: 'Wards' },
                 { number: '1,000+', label: 'Expected' },
                 { number: '100%', label: 'Commitment' },
                 { number: '3', label: 'Partners' },
               ].map((stat, idx) => (
                 <StatCard key={idx} number={stat.number} label={stat.label} index={idx} />
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* Townhall Gallery */}
      <TownhallGallery />

      {/* Events Schedule */}
      <section className="w-full py-32 bg-background border-t border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-20 text-center">
            <h2 className="mb-6 font-black tracking-tighter">Townhall Schedule</h2>
            <p className="text-white/40 font-medium uppercase tracking-[0.3em] text-[10px]">Secure Your Seat in the Movement</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {wards.map((ward) => (
              <EventCard
                key={ward.name}
                wardName={ward.name}
                date={ward.date}
                capacity={ward.capacity}
                maxCapacity={ward.maxCapacity}
                onRegister={() => setSelectedWard(ward.name)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* The Champion Framework */}
      <section className="w-full py-32 bg-black border-y border-border relative overflow-hidden">
        <div className="glow-orb -bottom-20 -left-20 opacity-10"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="mb-10 font-black tracking-tighter">Become a Youth Champion</h2>
          <p className="text-lg text-white/50 mb-12 font-medium leading-relaxed">
            Youth Champions are community leaders who co-facilitate townhalls and drive voter registration in their wards. They bridge government and grassroots, ensuring every voice is heard. Champions receive training, leadership development, and ongoing support.
          </p>
          <button 
            onClick={() => setSelectedWard("Youth Champion Program")}
            className="crimson-btn-outline px-12 py-5"
          >
            Apply for the Program
          </button>
        </div>
      </section>

      <PartnersSection />

      {/* Registration Modal */}
      {selectedWard && (
        <RegistrationForm
          wardName={selectedWard}
          onClose={() => setSelectedWard(null)}
        />
      )}
    </div>
  );
}
