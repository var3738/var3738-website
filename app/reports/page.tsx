'use client';

import { motion } from 'framer-motion';
import HeroSection from '@/components/HeroSection';
import StatCard from '@/components/StatCard';
import PartnersSection from '@/components/PartnersSection';

const WARD_FINDINGS = [
  {
    ward: 'Matisi',
    issues: ['CDF Ineffectiveness', 'Voter Frustration', 'Ethnic Favoritism', 'Boundary Disputes'],
    summary: 'One of the most complex governance regions with high political exploitation of unemployed youth.'
  },
  {
    ward: 'Sikhendu',
    issues: ['Maternal Health Cutbacks', 'School Fee Barriers', 'Gender-Based Violence'],
    summary: 'Significant social barriers affecting families and access to education.'
  },
  {
    ward: 'Saboti',
    issues: ['Youth Unemployment', 'Limited Credit Access', 'Resource Mismanagement'],
    summary: 'Economic stagnation remains a primary concern for the youth population.'
  },
  {
    ward: 'Chepchoina',
    issues: ['ID Regularities', 'Electoral Trust', 'Foreign Participation Allegations'],
    summary: 'Critical challenges in electoral administration and citizen identity verification.'
  },
  {
    ward: 'Kitale Town (Polytechnic)',
    issues: ['Academic Facility Gaps', 'Skepticism of Tech Voting', 'Relatable Civic Ed Needs'],
    summary: 'The student population demands more relatable, youth-culture-oriented civic education.'
  }
];

export default function ReportsPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <HeroSection
        headline="Strategic Reports & Findings"
        subheadline="Evidence-based insights from the Trans Nzoia Pilot. Tracking the intersection of governance and democratic participation."
        imageSrc="/trans-nzoia-townhall/tnts-image06.jpeg"
      />

      {/* Main Implications */}
      <section className="w-full py-32 relative overflow-hidden">
        <div className="glow-orb top-0 right-0 opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-10 font-black tracking-tighter">
                Key <br />
                <span className="text-primary italic">Implications</span>
              </h2>
              <div className="grid grid-cols-1 gap-6">
                 {[
                   'Declining trust in electoral institutions',
                   'Widespread socio-economic frustration',
                   'Youth disillusionment with political processes',
                   'Structural barriers to voter registration'
                 ].map((item, i) => (
                   <div key={i} className="flex items-center gap-4 p-6 bg-white/5 border border-white/10 rounded-2xl group hover:border-primary/20 transition-all">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span className="text-lg font-black uppercase tracking-tighter text-white/60 group-hover:text-white transition-colors">
                        {item}
                      </span>
                   </div>
                 ))}
              </div>
            </motion.div>
            
            <div className="modern-card p-12">
              <h3 className="text-3xl font-black mb-10 uppercase tracking-tighter italic">Movement Conclusion</h3>
              <p className="text-white/50 text-xl font-medium leading-relaxed mb-10">
                VAR's findings highlight a population deeply concerned about governance and integrity. Our "From the Streets to the Ballot" initiative is the direct response to rebuild public confidence and empower citizens.
              </p>
              <div className="flex gap-4">
                 <StatCard number="11" label="Wards Studied" index={0} />
                 <StatCard number="2026" label="Analysis Year" index={1} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ward Granularity */}
      <section className="w-full py-32 bg-black border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-20">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-6">Ward Granularity</div>
            <h2 className="text-5xl font-black tracking-tighter uppercase leading-none">Field <br /><span className="text-white/20 italic">Intelligence</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {WARD_FINDINGS.map((finding, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="modern-card p-10 flex flex-col h-full group"
              >
                <h3 className="text-2xl font-black mb-6 uppercase tracking-tighter text-primary">{finding.ward}</h3>
                <p className="text-white/60 font-medium mb-8 grow italic">&ldquo;{finding.summary}&rdquo;</p>
                <div className="space-y-3 pt-6 border-t border-white/5">
                  {finding.issues.map((issue, iIdx) => (
                    <div key={iIdx} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-primary/40 rounded-full"></div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{issue}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <PartnersSection />
    </div>
  );
}
