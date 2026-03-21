'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeroSection from '@/components/HeroSection';
import EventCard from '@/components/EventCard';
import RegistrationForm from '@/components/RegistrationForm';
import StatCard from '@/components/StatCard';
import TownhallGallery from '@/components/TownhallGallery';
import PartnersSection from '@/components/PartnersSection';
import Image from 'next/image';

const IMAGES_COUNT = 40;
const IMAGES = Array.from({ length: IMAGES_COUNT }, (_, i) => {
    const num = (i + 1).toString().padStart(2, '0');
    return `/trans-nzoia-townhall/tnts-image${num}.jpeg`;
});

export default function DemocracyActivatedClient() {
  const [selectedWard, setSelectedWard] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % IMAGES.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EventSeries',
    'name': 'Trans Nzoia Townhall Series',
    'description': 'A series of civic activations across Trans Nzoia to institutionalize youth power.',
    'startDate': '2026-03-15',
    'location': {
      '@type': 'Place',
      'name': 'Trans Nzoia County',
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': 'Kitale',
        'addressRegion': 'Trans Nzoia',
        'addressCountry': 'KE'
      }
    },
    'organizer': {
      '@type': 'NGO',
      'name': 'VAR 37/38',
      'url': 'https://var3738.org'
    }
  };

  const wards = [
    { name: 'Saboti', date: 'March 15, 2026', capacity: 45, maxCapacity: 100 },
    { name: 'Mowlem', date: 'March 17, 2026', capacity: 62, maxCapacity: 100 },
    { name: 'Chepchoina', date: 'March 19, 2026', capacity: 38, maxCapacity: 100 },
    { name: 'Kapkoi', date: 'March 21, 2026', capacity: 71, maxCapacity: 100 },
    { name: 'Kwanza', date: 'March 23, 2026', capacity: 54, maxCapacity: 100 },
    { name: 'Cherenganyi', date: 'March 25, 2026', capacity: 85, maxCapacity: 100 },
    { name: 'Kaplamai', date: 'March 27, 2026', capacity: 42, maxCapacity: 100 },
    { name: 'Sirende', date: 'March 29, 2026', capacity: 91, maxCapacity: 100 },
    { name: 'Sikhendu', date: 'March 31, 2026', capacity: 67, maxCapacity: 100 },
    { name: 'Matisi', date: 'April 02, 2026', capacity: 78, maxCapacity: 100 },
    { name: 'Kitale Town', date: 'April 04, 2026', capacity: 95, maxCapacity: 100 },
  ];

  return (
    <div className="bg-background text-foreground min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero Section */}
      <HeroSection
        headline="Democracy Activated: Trans Nzoia Pilot"
        subheadline="Ideology Meets Technology | From the Streets to the Ballot. Converting protest energy into structured democratic participation."
        imageSrc="/trans-nzoia-townhall/tnts-image05.jpeg"
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
                The Triple <br />
                <span className="text-primary italic">Pillar Model</span>
              </h2>
              <div className="space-y-8 mb-12">
                <div>
                  <h3 className="text-xl font-black uppercase tracking-widest text-primary mb-2">01. Streets (Connect)</h3>
                  <p className="text-white/60 font-medium">Led by VAR: Grassroots mobilization and lived-experience storytelling.</p>
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-widest text-primary mb-2">02. Ideology (Converse)</h3>
                  <p className="text-white/60 font-medium">Led by NEDP Youth League: Shifting from emotional politics to issue-based policy dialogue.</p>
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-widest text-primary mb-2">03. Technology (Continue)</h3>
                  <p className="text-white/60 font-medium">Powered by Uamuzi: Building digital long-term infrastructure for civic power.</p>
                </div>
              </div>
            </motion.div>
            
            <div className="grid grid-cols-2 gap-4">
               {[
                 { number: '11', label: 'Locations' },
                 { number: '1,000+', label: 'Youth Targets' },
                 { number: 'KES 5M', label: 'Pilot Budget' },
                 { number: '3', label: 'Core Partners' },
               ].map((stat, idx) => (
                 <StatCard key={idx} number={stat.number} label={stat.label} index={idx} />
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* Events Schedule */}
      <section className="w-full py-32 bg-background border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-20 text-center">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-6">Series Schedule</div>
            <h2 className="mb-6 font-black tracking-tighter uppercase leading-none">Townhall <br /><span className="text-white/20 italic">Activations</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
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

      
      {/* Townhall Gallery */}
      <TownhallGallery />


      {/* The Champion Framework */}
      <section className="w-full py-32 bg-black border-y border-white/5 relative overflow-hidden">
        {/* Background Slideshow */}
        <div className="absolute inset-0 w-full h-full opacity-40">
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
                alt="Champion Framework"
                fill
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="absolute inset-0 bg-black/70 z-0"></div>
        <div className="glow-orb -bottom-20 -left-20 opacity-10 z-0"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-10">Community Leadership</div>
          <h2 className="mb-10 font-black tracking-tighter text-5xl lg:text-7xl">BECOME A <br /><span className="text-primary italic">YOUTH CHAMPION</span></h2>
          <p className="text-lg text-white/50 mb-12 font-medium leading-relaxed">
            Youth Champions are community leaders who co-facilitate townhalls and drive voter registration in their wards. They bridge government and grassroots, ensuring every voice is heard. Champions receive training, leadership development, and ongoing support.
          </p>
          <button 
            onClick={() => setSelectedWard("Youth Champion Program")}
            className="crimson-btn px-12 py-5 text-[10px] uppercase tracking-[0.2em]"
          >
            Apply for Certification
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
