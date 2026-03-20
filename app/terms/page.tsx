'use client';

import HeroSection from '@/components/HeroSection';
import { motion } from 'framer-motion';

export default function TermsOfActionPage() {
  return (
    <main className="min-h-screen bg-black">
      <HeroSection 
        headline="TERMS OF" 
        subheadline="ACTION" 
        imageSrc="/trans-nzoia-townhall/tnts-image02.jpeg"
      />
      
      <section className="w-full py-32 bg-background relative overflow-hidden px-4">
        <div className="glow-orb -bottom-20 -left-20 opacity-10"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-8">Codes of Conduct</div>
          <h2 className="text-5xl font-black mb-16 tracking-tighter italic uppercase underline decoration-primary decoration-4 underline-offset-8">
            Terms of <span className="text-white/20">Action</span>
          </h2>
          
          <div className="space-y-12 text-white/60 font-medium text-lg leading-relaxed">
            <div className="modern-card p-10 bg-white/2 border border-white/5">
              <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4 italic">01. Non-Violent Engagement</h3>
              <p>
                Participation in VAR 37-38 activities is predicated on the absolute commitment to non-violent, constitutional civic action as defined in Articles 37 (Right to Assemble) and 38 (Political Rights).
              </p>
            </div>

            <div className="space-y-8">
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic border-l-4 border-primary pl-6">Participation Rules</h3>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <span className="text-primary font-black">/</span>
                  <p><span className="text-white">Authentic Representation:</span> Participants must provide true and accurate information during registration to maintain the legitimacy of ward-level blocks.</p>
                </li>
                <li className="flex gap-4">
                  <span className="text-primary font-black">/</span>
                  <p><span className="text-white">Issue-Based Discourse:</span> All discourse within VAR platforms must remain issue-based, focusing on policy and governance rather than tribal or identity-based politics.</p>
                </li>
                <li className="flex gap-4">
                  <span className="text-primary font-black">/</span>
                  <p><span className="text-white">Collective Responsibility:</span> As a member of the VAR 37-38 movement, you share the responsibility of protecting the movement's integrity and promoting peaceful political evolution.</p>
                </li>
              </ul>
            </div>

            <div className="modern-card p-10 bg-white/2 border border-white/5">
              <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4 italic">02. Platform Usage</h3>
              <p>
                Access to the VAR technology suite (provided by Uamuzi) is a privilege granted to registered participants. Misuse of the platform for propaganda, misinformation, or illegal activities will result in immediate termination of access.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
