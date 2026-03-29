"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import EventCard from "@/components/EventCard";
import RegistrationForm from "@/components/RegistrationForm";
import EventFeedbackModal from "@/components/EventFeedbackModal";
import StatCard from "@/components/StatCard";
import TownhallGallery from "@/components/TownhallGallery";
import PartnersSection from "@/components/PartnersSection";
import { api } from "@/lib/api";
import Image from "next/image";
import { ChevronDown, MapPin } from "lucide-react";

const IMAGES_COUNT = 40;
const IMAGES = Array.from({ length: IMAGES_COUNT }, (_, i) => {
  const num = (i + 1).toString().padStart(2, "0");
  return `/trans-nzoia-townhall/tnts-image${num}.jpeg`;
});

const CONSTITUENCIES = [
  {
    name: "Cherangany",
    count: 7,
    wards: ["Sinyerere", "Makutano", "Kaplamai", "Motosiet", "Cherangany", "Suwerwa", "Chepsiro", "Kiptoror", "Sitatunga"]
  },
  {
    name: "Kiminini",
    count: 6,
    wards: ["Kiminini", "Waitaluk", "Sirende", "Hospital", "Sikhendu", "Nabiswa"]
  },
  {
    name: "Saboti",
    count: 5,
    wards: ["Kinyoro", "Matisi", "Tuwan", "Saboti", "Machewa"]
  },
  {
    name: "Kwanza",
    count: 4,
    wards: ["Kwanza", "Keiyo", "Bidii", "Kapomboi"]
  },
  {
    name: "Endebess",
    count: 3,
    wards: ["Endebess", "Matumbei", "Chepchoina"]
  }
];

export default function DemocracyActivatedClient() {
  const [activeConstituency, setActiveConstituency] = useState<string | null>(null);
  const [selectedWard, setSelectedWard] = useState<string | null>(null);
  const [feedbackEvent, setFeedbackEvent] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % IMAGES.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EventSeries",
    name: "Trans Nzoia Townhall Series",
    description:
      "A series of civic activations across Trans Nzoia to institutionalize youth power.",
    startDate: "2026-03-15",
    location: {
      "@type": "Place",
      name: "Trans Nzoia County",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kitale",
        addressRegion: "Trans Nzoia",
        addressCountry: "KE",
      },
    },
    organizer: {
      "@type": "NGO",
      name: "VAR 37/38",
      url: "https://var3738.org",
    },
  };

  const [wards, setWards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      try {
        const events = await api.getEvents();
        setWards(events);
      } catch (error) {
        console.error("Failed to load events:", error);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

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
                  <h3 className="text-xl font-black uppercase tracking-widest text-primary mb-2">
                    01. Streets (Connect)
                  </h3>
                  <p className="text-white/60 font-medium">
                    Led by VAR: Grassroots mobilization and lived-experience
                    storytelling.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-widest text-primary mb-2">
                    02. Ideology (Converse)
                  </h3>
                  <p className="text-white/60 font-medium">
                    Led by NEDP Youth League: Shifting from emotional politics
                    to issue-based policy dialogue.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-widest text-primary mb-2">
                    03. Technology (Continue)
                  </h3>
                  <p className="text-white/60 font-medium">
                    Powered by Uamuzi: Building digital long-term infrastructure
                    for civic power.
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { number: "11", label: "Locations" },
                { number: "1,000+", label: "Youth Targets" },
                { number: "KES 5M", label: "Pilot Budget" },
                { number: "3", label: "Core Partners" },
              ].map((stat, idx) => (
                <StatCard
                  key={idx}
                  number={stat.number}
                  label={stat.label}
                  index={idx}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Events Schedule */}
      <section className="w-full py-32 bg-background border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-20 text-center">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-6">
              Series Schedule
            </div>
            <h2 className="mb-6 font-black tracking-tighter uppercase leading-none">
              VAR Townhall Series<br />
              <span className="text-primary italic">Trans Nzoia Edition</span>
            </h2>
          </div>
          {/* Wards Explorer: Accordion Style */}
          <div className="mb-24 max-w-4xl mx-auto space-y-4">
            {CONSTITUENCIES.map((constituency, idx) => (
              <div key={constituency.name} className="modern-card overflow-hidden">
                <button
                  onClick={() => setActiveConstituency(activeConstituency === constituency.name ? null : constituency.name)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl border ${activeConstituency === constituency.name ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-white/5 border-white/10 text-white/30'} flex items-center justify-center transition-all`}>
                      <MapPin size={18} />
                    </div>
                    <div>
                      <h4 className={`text-xl font-black uppercase tracking-tighter transition-colors ${activeConstituency === constituency.name ? 'text-primary' : ''}`}>
                         {constituency.name} <span className="text-[10px] font-black italic ml-2 opacity-50">({constituency.count} Wards)</span>
                      </h4>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: activeConstituency === constituency.name ? 180 : 0 }}
                    className="text-white/20 group-hover:text-primary transition-colors"
                  >
                    <ChevronDown size={20} />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {activeConstituency === constituency.name && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-20 pb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 border-t border-white/5 pt-8 bg-white/2">
                        {constituency.wards.map((ward, wIdx) => (
                          <motion.div
                            key={ward}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: wIdx * 0.05 }}
                            className="flex items-center gap-2"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/30 shadow-[0_0_8px_rgba(var(--primary-rgb),0.3)]"></div>
                            <span className="text-sm font-bold text-white/60 tracking-tight">{ward}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loading ? (
              // Loading Skeleton
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="modern-card p-8 bg-black/40 h-[300px] animate-pulse"
                >
                  <div className="h-4 w-1/2 bg-white/5 mb-8 rounded"></div>
                  <div className="h-8 w-3/4 bg-white/5 mb-4 rounded"></div>
                  <div className="h-4 w-1/3 bg-white/5 mb-10 rounded"></div>
                  <div className="mt-auto h-12 w-full bg-white/5 rounded-xl"></div>
                </div>
              ))
            ) : wards.length > 0 ? (
              wards.map((ward) => (
                <EventCard
                  key={ward.id}
                  wardName={ward.ward || ward.title}
                  date={new Date(ward.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                  capacity={ward.registration_count || 0}
                  maxCapacity={ward.max_capacity}
                  onRegister={() => setSelectedWard(ward.title)}
                  onFeedback={() =>
                    setFeedbackEvent({ id: ward.id, name: ward.title })
                  }
                />
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-white/30 italic">
                No events scheduled at this moment. Stay tuned.
              </div>
            )}
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
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-10">
            Community Leadership
          </div>
          <h2 className="mb-10 font-black tracking-tighter text-5xl lg:text-7xl">
            BECOME A <br />
            <span className="text-primary italic">YOUTH CHAMPION</span>
          </h2>
          <p className="text-lg text-white/50 mb-12 font-medium leading-relaxed">
            Youth Champions are community leaders who co-facilitate townhalls
            and drive voter registration in their wards. They bridge government
            and grassroots, ensuring every voice is heard. Champions receive
            training, leadership development, and ongoing support.
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

      {/* Feedback Modal */}
      {feedbackEvent && (
        <EventFeedbackModal
          eventId={feedbackEvent.id}
          eventName={feedbackEvent.name}
          onClose={() => setFeedbackEvent(null)}
        />
      )}
    </div>
  );
}
