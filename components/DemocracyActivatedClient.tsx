"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import EventCard from "@/components/EventCard";
import AuthModal from "@/components/AuthModal";
import { LogIn, LogOut, ShieldCheck, User as UserIcon, Award, Search, Share2, PlusCircle, XCircle } from "lucide-react";
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
  const [user, setUser] = useState<any>(null);
  const [userCertificates, setUserCertificates] = useState<any[]>([]);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [claimCredentialId, setClaimCredentialId] = useState('');
  const [isClaiming, setIsClaiming] = useState(false);
  const [authModal, setAuthModal] = useState<{ isOpen: boolean, mode: 'login' | 'register', event?: any } | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const currentUser = await api.getMe();
        setUser(currentUser);
        // Also fetch user certificates
        const certs = await api.getCertificates({ user_id: currentUser.id });
        setUserCertificates(certs);
      } catch (err) {
        setUser(null);
      }
    }
    checkAuth();
  }, []);

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimCredentialId.trim() || !user) return;
    
    setIsClaiming(true);
    try {
      await api.claimCertificate(claimCredentialId);
      const updatedCerts = await api.getCertificates({ user_id: user.id });
      setUserCertificates(updatedCerts);
      setClaimCredentialId('');
      setIsClaimModalOpen(false);
      alert('Certificate successfully claimed and linked to your profile!');
    } catch (err: any) {
      alert(err.message || 'Failed to claim certificate. Please check the ID.');
    } finally {
      setIsClaiming(false);
    }
  };

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

          {/* User Auth Bar */}
          <div className="mb-12 flex justify-center">
            <div className="modern-card p-1.5 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-2">
               {user ? (
                 <div className="flex items-center gap-6 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <ShieldCheck size={16} />
                      </div>
                      <div>
                        <div className="text-[8px] font-black text-white/30 uppercase tracking-widest leading-none mb-1">Authenticated</div>
                        <div className="text-[10px] font-bold uppercase tracking-tighter text-white">{user.full_name}</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => { api.logout(); setUser(null); }}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-white/5 rounded-lg transition-colors text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-red-500"
                    >
                      <LogOut size={12} /> Logout
                    </button>
                 </div>
               ) : (
                 <button 
                   onClick={() => setAuthModal({ isOpen: true, mode: 'login' })}
                   className="flex items-center gap-3 px-8 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all group"
                 >
                    <LogIn size={14} className="text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Identify Yourself to Register</span>
                 </button>
               )}
            </div>
          </div>

          {/* User Awards Gallery */}
          {user && (
            <div className="mb-24 max-w-4xl mx-auto">
               <div className="flex justify-between items-center mb-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <Award size={20} />
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tighter">Your Awarded Certificates</h3>
                  </div>
                  <button 
                    onClick={() => setIsClaimModalOpen(true)}
                    className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.2em] border border-white/10 hover:border-primary/50 px-4 py-2 rounded-full transition-all"
                  >
                    <PlusCircle size={14} className="text-primary" /> Claim Missing
                  </button>
               </div>

               {userCertificates.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {userCertificates.map((cert: any) => (
                      <motion.div 
                        key={cert.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="modern-card p-6 bg-white/5 border border-white/10 group relative overflow-hidden"
                      >
                         <Award className="absolute -bottom-4 -right-4 w-24 h-24 text-primary/5 group-hover:text-primary/10 transition-colors" />
                         <div className="relative z-10 flex justify-between items-start">
                            <div>
                               <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">{cert.event_name}</div>
                               <div className="text-xl font-black uppercase tracking-tighter mb-4 italic">{cert.recipient_name}</div>
                               <div className="flex items-center gap-3 text-white/30 text-[9px] font-bold uppercase tracking-widest">
                                  <span>ID: {cert.credential_id}</span>
                                  <span>•</span>
                                  <span>Issued: {new Date(cert.issue_date).toLocaleDateString()}</span>
                               </div>
                            </div>
                            <div className="flex gap-2">
                               <button 
                                 onClick={() => window.open(`/certificate?id=${cert.credential_id}`, '_blank')}
                                 className="p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all"
                               >
                                  <Search size={16} className="text-white" />
                               </button>
                               <button 
                                 onClick={() => {
                                   navigator.clipboard.writeText(`${window.location.origin}/certificate?id=${cert.credential_id}`);
                                   alert('Credential Link Copied!');
                                 }}
                                 className="p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all"
                               >
                                  <Share2 size={16} className="text-white" />
                               </button>
                            </div>
                         </div>
                      </motion.div>
                    ))}
                 </div>
               ) : (
                 <div className="modern-card py-16 text-center bg-white/5 border border-white/10 border-dashed">
                    <Award size={40} className="mx-auto text-white/5 mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20">No certificates found linked to your profile.</p>
                    <button 
                      onClick={() => setIsClaimModalOpen(true)}
                      className="mt-6 text-[10px] font-bold text-primary hover:underline uppercase tracking-widest"
                    >
                      Manually claim using a Credential ID
                    </button>
                 </div>
               )}
            </div>
          )}

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
                  isLoggedIn={!!user}
                  onRegister={() => {
                    if (user) {
                      // Already logged in - attempt to register directly
                      api.registerForEvent(ward.id, user.id)
                        .then(() => alert(`Success! You have claimed a seat for ${ward.title}`))
                        .catch(err => alert(err.message || 'Registration failed'));
                    } else {
                      // Login first
                      setAuthModal({ isOpen: true, mode: 'register', event: ward });
                    }
                  }}
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

      {/* Authentication Modal */}
      {authModal?.isOpen && (
        <AuthModal
          initialMode={authModal.mode}
          targetEventId={authModal.event?.id}
          targetEventName={authModal.event?.title || authModal.event?.ward}
          onClose={() => setAuthModal(null)}
          onSuccess={(u) => setUser(u)}
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
      {/* Claim Modal */}
      {isClaimModalOpen && (
         <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[150] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="modern-card max-w-md w-full p-10 relative bg-background border border-white/10"
            >
               <button 
                 onClick={() => setIsClaimModalOpen(false)}
                 className="absolute top-6 right-6 text-white/40 hover:text-white"
               >
                 <XCircle size={24} />
               </button>
               <div className="text-center mb-10">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4">Manual Registry Claim</div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter italic">Found a Record?</h3>
                  <p className="text-[10px] font-medium text-white/30 tracking-widest mt-2 uppercase">Enter the Credential ID from your award</p>
               </div>
               <form onSubmit={handleClaim} className="space-y-6">
                  <input 
                    type="text"
                    value={claimCredentialId}
                    onChange={(e) => setClaimCredentialId(e.target.value.toUpperCase())}
                    placeholder="EX: VAR-2026-XXXX"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:border-primary/50 focus:outline-none placeholder:text-white/10 font-bold uppercase tracking-tight text-center"
                    required
                  />
                  <button 
                    type="submit"
                    disabled={isClaiming || !claimCredentialId}
                    className="w-full crimson-btn py-5 text-[10px] font-black uppercase tracking-[0.2em] disabled:opacity-50"
                  >
                    {isClaiming ? 'Verifying...' : 'Claim & Link to Profile'}
                  </button>
               </form>
            </motion.div>
         </div>
      )}
    </div>
  );
}
