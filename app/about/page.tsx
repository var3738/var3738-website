'use client';

import { motion } from 'framer-motion';
import { Shield, Users, Search, Globe, Zap, Heart, ArrowRight, BarChart3, Radio, FileText, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <main className="pt-20 bg-background text-white selection:bg-primary selection:text-black">
      {/* 1. Hero: The Manifesto */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden px-4 py-32 border-b border-white/5">
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none z-100" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-primary mb-12 block">
              The Viable Alternative Republic
            </span>
            <h1 className="text-6xl md:text-[10rem] font-black mb-12 tracking-tighter leading-[0.8] italic uppercase">
              Power <br />
              <span className="text-primary not-italic ">is Not</span> <br />
              Activated.
            </h1>
            <p className="text-white/40 max-w-2xl mx-auto text-xl font-medium leading-relaxed uppercase tracking-tight">
              37: Assembly & Petition. 38: Political Rights. <br />
              The constitutional engine of Kenyas youth demographic.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. The Mandate: Constitutional Deep Dive */}
      <section className="py-32 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
               <h2 className="text-5xl font-black mb-12 tracking-tighter leading-none italic uppercase">
                 The <span className="text-primary not-italic">Mandate</span>
               </h2>
               <div className="space-y-12">
                 <div className="relative pl-12 border-l-2 border-primary/20 hover:border-primary transition-colors">
                   <span className="absolute left-0 top-0 text-primary font-black -translate-x-1/2 bg-background px-2">37</span>
                   <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">Assemblage & Voice</h3>
                   <p className="text-white/50 text-lg leading-relaxed">
                     "Every person has the right, peaceably and unarmed, to assemble, to demonstrate, 
                     to picket, and to present petitions to public authorities." 
                     <br /><br />
                     VAR recognizes that the street is the ultimate lab for democracy. We provide the 
                     structured framework to ensure this energy is converted into institutionalized 
                     oversight, not just discarded momentum.
                   </p>
                 </div>
                 <div className="relative pl-12 border-l-2 border-secondary/20 hover:border-secondary transition-colors">
                   <span className="absolute left-0 top-0 text-secondary font-black -translate-x-1/2 bg-background px-2">38</span>
                   <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">Democratic Choice</h3>
                   <p className="text-white/50 text-lg leading-relaxed">
                     "Every citizen is free to make political choices... to participate in the activities 
                     of a political party and to campaign for a cause."
                     <br /><br />
                     We translate the "freedoms" of Art 38 into "capacities." From voter registration 
                     caravans to door-to-door mobilization, we ensure youth are the primary architects 
                     of the ballot.
                   </p>
                 </div>
               </div>
            </div>
            <div className="relative aspect-square">
               <div className="absolute inset-0 bg-primary/5 rounded-full blur-[120px] animate-pulse-slow" />
               <div className="modern-card h-full p-1 w-full bg-linear-to-br from-white/10 to-transparent">
                  <div className="h-full w-full bg-black flex items-center justify-center p-12 text-center">
                     <p className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase text-white/10 select-none pointer-events-none">
                        Viable <br /> Alternative <br /> Republic
                     </p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Evidence: The 2025 Observer Report */}
      <section className="py-32 bg-linear-to-b from-black to-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="mb-20">
             <span className="text-primary font-bold text-xs uppercase tracking-widest mb-4 block">Proven Track Record</span>
             <h2 className="text-5xl lg:text-7xl font-black mb-8 tracking-tighter italic uppercase">
               October 2025 <br />
               <span className="text-primary not-italic">By-Elections Observation</span>
             </h2>
             <p className="text-white/40 max-w-2xl text-xl font-medium">
               VAR is a recognized domestic observer. In 2025, we deployed teams to monitor four critical by-elections, proving our ability to provide non-partisan, citizen-led oversight.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { location: "Baringo County", impact: "Smooth Tallying Oversight", fact: "3 Physical Observers" },
              { location: "Nyamaiya Ward", impact: "Countered Disinformation", fact: "2 Physical Observers" },
              { location: "Mbeere North", impact: "Voter Support Monitoring", fact: "Siakago Center Focus" },
              { location: "Kabuchai Ward", impact: "Logistical Evaluation", fact: "Electoral Compliance" },
            ].map((report, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="modern-card p-8 bg-white/2 hover:bg-white/5 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                  <BarChart3 size={20} />
                </div>
                <h4 className="text-xl font-black mb-2 uppercase tracking-tighter">{report.location}</h4>
                <p className="text-xs font-black text-primary uppercase tracking-widest mb-4">{report.impact}</p>
                <div className="pt-4 border-t border-white/5 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{report.fact}</div>
              </motion.div>
            ))}
          </div>

          <div className="mt-20 p-12 modern-card bg-primary/5 border border-primary/20">
            <h3 className="text-2xl font-black mb-8 uppercase tracking-tighter">Strategic Reforms Proposed:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="space-y-4">
                  <CheckCircle2 className="text-primary" size={24} />
                  <p className="text-sm font-bold text-white/70">Door-to-door voter registration, integrating census methodology into electoral rolls.</p>
               </div>
               <div className="space-y-4">
                  <CheckCircle2 className="text-primary" size={24} />
                  <p className="text-sm font-bold text-white/70">Recognition of National IDs as sufficient proof for registration upon turnng 18.</p>
               </div>
               <div className="space-y-4">
                  <CheckCircle2 className="text-primary" size={24} />
                  <p className="text-sm font-bold text-white/70">Outsourced IEBC training to jurisdictions with proven records of free elections.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Strategic Pillars: Digital & Leadership */}
      <section className="py-32 px-4 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Pillar: Strategy */}
            <div className="lg:col-span-2 space-y-12">
               <div>
                  <span className="text-primary font-bold text-xs uppercase tracking-widest mb-4 block">Institutional Strategy</span>
                  <h2 className="text-5xl font-black mb-8 tracking-tighter italic uppercase underline underline-offset-8 decoration-primary/30">
                    The Leadership <br /> Accelerator
                  </h2>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <motion.div className="p-10 modern-card bg-white/2" whileHover={{ y: -5 }}>
                     <Zap className="text-primary mb-6" size={32} />
                     <h3 className="text-xl font-black mb-4 uppercase tracking-tighter italic">Civic Leadership Fellowship</h3>
                     <p className="text-white/50 text-sm leading-relaxed">
                        A 6-month hybrid program for 150 high-potential youth from all regions. 
                        Curriculum covering democratic theory, policy analysis, and ethical community organizing.
                     </p>
                  </motion.div>
                  <motion.div className="p-10 modern-card bg-white/2" whileHover={{ y: -5 }}>
                     <Search className="text-primary mb-6" size={32} />
                     <h3 className="text-xl font-black mb-4 uppercase tracking-tighter italic">Verify Before You Amplify</h3>
                     <p className="text-white/50 text-sm leading-relaxed">
                        Training 500+ youth content creators and influencers on digital forensics, source 
                        verification, and countering malign narratives.
                     </p>
                  </motion.div>
               </div>

               <div className="relative aspect-21/9 rounded-[2.5rem] overflow-hidden mb-20 border border-white/10 bg-white/5">
                  <div className="shrink-0 text-7xl font-black text-white/10 italic">10</div>
                  <p className="text-white/60 font-bold leading-relaxed uppercase tracking-tight">
                    Establishment of permanent <span className="text-white">Youth Peace Hubs</span> in election-sensitive counties 
                    as early-warning and community mediation centers.
                  </p>
               </div>
            </div>

            {/* Sidebar: Media & Discourse */}
            <div className="lg:border-l lg:border-white/5 lg:pl-12 space-y-12">
               <div>
                  <h3 className="text-2xl font-black mb-6 uppercase tracking-tighter italic text-primary">Discourse Center</h3>
                  <div className="modern-card p-8 bg-linear-to-br from-primary/10 to-transparent">
                     <Radio className="text-primary mb-6 animate-pulse" size={32} />
                     <h4 className="text-lg font-black mb-2 uppercase tracking-tighter">Variant Voices</h4>
                     <p className="text-white/50 text-xs leading-relaxed mb-6">
                        A specialized podcast and digital platform fostering substantive, issue-based political discourse. 
                        Moving youth from tribal identity politics to issue-based policy engagement.
                     </p>
                     <div className="flex gap-2">
                        <span className="text-[8px] font-black uppercase bg-primary/20 text-primary px-3 py-1 rounded-full border border-primary/30">Podcasting</span>
                        <span className="text-[8px] font-black uppercase bg-primary/20 text-primary px-3 py-1 rounded-full border border-primary/30">Policy</span>
                     </div>
                  </div>
               </div>

               <div className="p-8 border-2 border-dashed border-white/10 rounded-3xl">
                  <span className="text-[10px] font-black uppercase text-white/30 tracking-widest block mb-4">The National Agenda</span>
                  <p className="text-white/50 text-sm italic leading-relaxed">
                    "Facilitating the bottom-up National Youth Agenda process to present policy priorities to political parties nationwide."
                  </p>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Partnership: Global Continuity */}
      <section className="py-32 bg-black">
        <div className="max-w-4xl mx-auto px-4 text-center">
           <Heart className="text-primary mx-auto mb-12" size={48} />
           <h2 className="text-5xl md:text-7xl font-black mb-12 tracking-tighter italic uppercase leading-none">
             A Partnership <br />
             <span className="text-primary not-italic">for Democracy.</span>
           </h2>
           <p className="text-white/50 text-lg mb-12 font-medium leading-relaxed">
             VAR 37-38 aligns strategic youth and democracy objectives with institutional partners like the <span className="text-white underline decoration-primary decoration-2 underline-offset-4">U.S. Embassy in Kenya</span>. 
             By investing in VAR, partners invest in the energy and democratic aspirations of Kenya's most vital asset: its youth.
           </p>
           <div className="flex justify-center gap-12 border-t border-white/5 pt-12">
              <div className="text-center">
                 <div className="text-xl font-black italic mb-1 uppercase">Jan 14 2026</div>
                 <div className="text-[8px] font-black text-white/30 uppercase tracking-[0.3em]">Strategy Framework Release</div>
              </div>
              <div className="text-center">
                 <div className="text-xl font-black italic mb-1 uppercase">150+ Leaders</div>
                 <div className="text-[8px] font-black text-white/30 uppercase tracking-[0.3em]">Fellowship Enrollment Target</div>
              </div>
           </div>
        </div>
      </section>
    </main>
  );
}
