'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Radar, Calendar, ArrowRight, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

export default function ActivationRadar() {
  const [location, setLocation] = useState<{lat: number, lon: number} | null>(null);
  const [nearbyEvents, setNearbyEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userWard, setUserWard] = useState<string | null>(null);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported");
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lon: longitude });
        
        try {
          // 1. Get Reverse Geocode (Ward)
          const geoInfo = await api.reverseGeocode(latitude, longitude);
          setUserWard(geoInfo.ward.name);
          
          // 2. Get Nearby Events
          const eventsData = await api.getNearbyEvents(latitude, longitude, 100); // 100km radius
          setNearbyEvents(eventsData.events);
        } catch (err) {
          console.error('Failed to fetch nearby data:', err);
          setError("Couldn't sync with the central registry.");
        } finally {
          setIsLoading(false);
        }
      },
      (err) => {
        setIsLoading(false);
        setError("Location access denied.");
      }
    );
  };

  return (
    <div className="modern-card p-8 flex flex-col h-full bg-black/40 backdrop-blur-xl border-white/5 overflow-hidden group">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Radar size={20} className={isLoading ? "animate-spin" : ""} />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tighter italic">Activation Radar</h3>
          </div>
          <button 
            onClick={detectLocation}
            disabled={isLoading}
            className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-primary transition-colors flex items-center gap-2"
          >
            {isLoading ? "Syncing..." : "Scan Area"} <Navigation size={12} />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {!location ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 flex flex-col items-center text-center justify-center"
            >
              <div className="w-20 h-20 rounded-full border border-white/5 flex items-center justify-center mb-6 relative">
                 <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping"></div>
                 <MapPin className="text-white/20" size={32} />
              </div>
              <p className="text-sm font-bold text-white/30 max-w-[200px]">
                Initiate a scan to find townhalls and activists in your ward.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                <div className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-1">Current Sector</div>
                <div className="text-lg font-black uppercase tracking-tight text-white">{userWard || "Unknown Territory"}</div>
              </div>

              <div className="space-y-4">
                <div className="text-[10px] font-black uppercase tracking-widest text-white/30 px-1">Nearby Activations ({nearbyEvents.length})</div>
                
                {nearbyEvents.length === 0 ? (
                  <div className="py-8 text-center text-[10px] font-black uppercase tracking-widest text-white/10">
                    No active events in 100km radius.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {nearbyEvents.map((event, i) => (
                      <div key={i} className="p-4 rounded-xl bg-white/2 border border-white/5 hover:border-primary/20 transition-all group/item">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-sm font-black uppercase tracking-tight text-white group-hover/item:text-primary transition-colors">{event.title}</h4>
                          <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full">{event.distance_km.toFixed(1)}km</span>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-bold text-white/40">
                           <div className="flex items-center gap-1"><Calendar size={10} /> {new Date(event.date).toLocaleDateString()}</div>
                           <div className="flex items-center gap-1"><MapPin size={10} /> {event.location_name}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-[10px] font-black uppercase tracking-widest text-red-500 text-center"
        >
          {error}
        </motion.div>
      )}

      {/* Decorative Radar background */}
      <div className="absolute -bottom-20 -right-20 w-64 h-64 border border-white/5 rounded-full pointer-events-none group-hover:border-primary/5 transition-colors duration-1000">
         <div className="absolute inset-8 border border-white/5 rounded-full"></div>
         <div className="absolute inset-16 border border-white/5 rounded-full"></div>
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-full bg-linear-to-b from-primary/20 to-transparent origin-top animate-radar-sweep"></div>
      </div>
    </div>
  );
}
