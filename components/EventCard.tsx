import { useState, useEffect } from 'react';
import { api, Feedback } from '@/lib/api';
import { MessageSquare, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

interface EventCardProps {
  eventId: number;
  wardName: string;
  date: string;
  capacity: number;
  maxCapacity: number;
  onRegister: () => void;
  onFeedback?: () => void;
  isLoggedIn?: boolean;
}

export default function EventCard({
  eventId,
  wardName,
  date,
  capacity,
  maxCapacity,
  onRegister,
  onFeedback,
  isLoggedIn = false,
}: EventCardProps) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  
  const capacityPercentage = (capacity / maxCapacity) * 100;

  useEffect(() => {
    if (showFeedback && feedbacks.length === 0) {
      loadFeedback();
    }
  }, [showFeedback]);

  async function loadFeedback() {
    setLoadingFeedback(true);
    try {
      const data = await api.getFeedback(eventId);
      setFeedbacks(data);
    } catch (error) {
      console.error("Failed to load feedback:", error);
    } finally {
      setLoadingFeedback(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="modern-card flex flex-col p-8 bg-black/40 backdrop-blur-sm group relative overflow-hidden h-full"
    >
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />

      {/* Header */}
      <div className="mb-8 relative z-10">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2">
              Townhall Series
            </div>
            <h3 className="text-3xl font-black mb-1 uppercase tracking-tighter transition-colors group-hover:text-primary leading-tight">
              {wardName}
            </h3>
            <p className="text-white/40 font-medium text-sm">
              {date}
            </p>
          </div>
          {feedbacks.length > 0 && (
            <div className="flex items-center gap-1 bg-primary/5 px-2 py-1 rounded border border-primary/10">
              <Star size={10} className="text-primary fill-primary" />
              <span className="text-[10px] font-black text-primary">
                {(feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length).toFixed(1)}
              </span>
            </div>
          )}
        </div>
        
        {isLoggedIn && (
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
            <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
            <span className="text-[8px] font-black uppercase tracking-widest text-primary">Identity Authorized</span>
          </div>
        )}
      </div>

      {/* Capacity Section */}
      <div className="mb-8 flex-grow relative z-10">
        <div className="flex justify-between items-end mb-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Seat Availability</span>
          <span className="text-lg font-black">
            {capacity}<span className="text-white/20 text-xs font-bold ml-1">/{maxCapacity}</span>
          </span>
        </div>
        <div className="w-full h-1 bg-white/5 rounded-full relative overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            whileInView={{ width: `${capacityPercentage}%` }}
            transition={{ duration: 1.5, ease: "circOut" }}
          />
        </div>
      </div>

      {/* Ground Intel Section */}
      <div className="mb-8 relative z-10">
        <button 
          onClick={() => setShowFeedback(!showFeedback)}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors mb-4"
        >
          <MessageSquare size={14} /> 
          Ground Intel {feedbacks.length > 0 && `(${feedbacks.length})`}
          {showFeedback ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>

        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-3 pt-2">
                {loadingFeedback ? (
                  <div className="text-[9px] font-bold uppercase tracking-widest text-white/20 animate-pulse">Loading intel...</div>
                ) : feedbacks.length > 0 ? (
                  feedbacks.slice(0, 3).map(fb => (
                    <div key={fb.id} className="p-3 bg-white/5 rounded border border-white/5">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              size={8} 
                              className={i < fb.rating ? "text-primary fill-primary" : "text-white/10"} 
                            />
                          ))}
                        </div>
                        <div className="text-[8px] font-mono text-white/20">{new Date(fb.created_at).toLocaleDateString()}</div>
                      </div>
                      <p className="text-[10px] font-bold text-white/60 leading-tight italic">"{fb.comment}"</p>
                    </div>
                  ))
                ) : (
                  <div className="text-[9px] font-bold uppercase tracking-widest text-white/20">No intel acquired yet.</div>
                )}
                {feedbacks.length > 3 && (
                  <div className="text-[8px] font-black uppercase text-center text-white/20 tracking-widest mt-2">+ {feedbacks.length - 3} more records</div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CTA Button */}
      <div className="flex gap-4 w-full relative z-10">
        <button
          onClick={onRegister}
          className={`flex-1 text-[10px] uppercase tracking-[0.2em] py-4 rounded-md transition-all ${isLoggedIn ? 'bg-primary text-black font-black hover:bg-white' : 'crimson-btn'}`}
        >
          {isLoggedIn ? 'Claim Seat' : 'Secure Seat'}
        </button>
        {onFeedback && (
          <button
            onClick={onFeedback}
            className="flex-1 px-4 py-4 bg-white/5 text-white/60 text-[10px] font-black uppercase tracking-widest rounded-md border border-white/10 hover:bg-white/10 hover:text-white transition-colors"
          >
            Feedback
          </button>
        )}
      </div>
    </motion.div>
  );
}
