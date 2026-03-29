'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Users } from 'lucide-react';
import Portal from './Portal';
import { api, TeamMember } from '@/lib/api';
import TeamCard from './TeamCard';

interface TeamOverlayProps {
  onClose: () => void;
}

export default function TeamOverlay({ onClose }: TeamOverlayProps) {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTeam() {
      try {
        const data = await api.getTeamMembers();
        setTeam(data);
      } catch (err) {
        console.error('Failed to load team members:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadTeam();
  }, []);

  return (
    <Portal>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-xl"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-6xl max-h-[90vh] bg-background/40 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="p-6 sm:p-8 border-b border-white/5 flex items-center justify-between bg-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                <Users className="text-primary w-5 h-5" />
              </div>
              <div>
                 <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tighter">
                   The <span className="text-primary italic">Leadership</span> Structure
                 </h2>
                 <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Coalition of Builders & Dreamers</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-white/50 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
            {isLoading ? (
              <div className="w-full flex flex-col items-center justify-center py-32 gap-4">
                <Loader2 className="animate-spin text-primary" size={32} />
                <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Decrypting Personnel Data...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {team.map((member) => (
                  <TeamCard
                    key={member.id}
                    name={member.name}
                    position={member.position}
                    image={member.image_url}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-white/5 border-t border-white/5 flex justify-center">
            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-white/20">Viable Alternative Republic (VAR) 37/38 © Internal Directive</p>
          </div>
        </motion.div>
      </div>
    </Portal>
  );
}
