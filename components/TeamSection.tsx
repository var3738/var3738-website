'use client';

import { useState, useEffect } from 'react';
import TeamCard from './TeamCard';
import { api, TeamMember } from '@/lib/api';
import { Loader2 } from 'lucide-react';

export default function TeamSection() {
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
    <section className="w-full py-32 bg-background relative overflow-hidden">
      <div className="glow-orb top-0 right-0 opacity-5"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-20">
           <h2 className="mb-6 font-black tracking-tighter">
             The <br />
             <span className="text-primary italic">Leadership</span> Structure
           </h2>
           <p className="text-white/40 max-w-xl text-lg font-medium">
             A professional coalition of builders, dreamers, and agitators. Redefining power through structured civic engagement.
           </p>
        </div>

        {isLoading ? (
          <div className="w-full flex justify-center py-10">
            <Loader2 className="animate-spin text-primary" size={32} />
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
    </section>
  );
}
