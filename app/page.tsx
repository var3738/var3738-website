import { Heart, Zap, Globe } from 'lucide-react';
import HeroSection from '@/components/HeroSection';
import LiveImpactTicker from '@/components/LiveImpactTicker';
import PillarsGrid from '@/components/PillarsGrid';
import TiltButton from '@/components/TiltButton';
import TeamSection from '@/components/TeamSection';
import BrutalistImage from '@/components/BrutalistImage';

export default function Home() {
  const impactItems = [
    '1,000+ YOUTHS TARGETED',
    'TRANS NZOIA PILOT',
    'ART. 37 & 38 ACTIVATED',
    '75% OF POPULATION',
    'DEMOCRACY ACTIVATED',
    'GENERATIONAL CHANGE',
  ];

  const pillars = [
    {
      title: 'Streets',
      description: 'Grassroots mobilization harnessing Article 37 rights to connect youth voices directly to civic power. From community organizing to electoral participation.',
      icon: <Heart size={32} className="text-white" />,
      accentColor: 'bg-gradient-to-br from-primary to-secondary',
    },
    {
      title: 'Ideology',
      description: 'Structured policy dialogue with NEDP ensuring youth voices shape national development priorities. Transforming demands into democratic demands.',
      icon: <Zap size={32} className="text-white" />,
      accentColor: 'bg-gradient-to-br from-secondary to-primary',
    },
    {
      title: 'Technology',
      description: 'Digital onboarding via Uamuzi Tech creating seamless pathways for civic engagement. Making democracy accessible to all through innovation.',
      icon: <Globe size={32} className="text-white" />,
      accentColor: 'bg-gradient-to-br from-primary via-secondary to-primary',
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <HeroSection
        headline="FROM THE STREETS TO THE BALLOT"
        subheadline="VAR 37-38: The Voice of a Generation. Institutionalizing youth energy into democratic power."
      />

      {/* Live Impact Banner */}
      <LiveImpactTicker items={impactItems} />

      {/* The Pillars Section */}
      <section className="w-full py-16 md:py-24 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 flex justify-between items-end">
          <h2 className="text-3xl md:text-4xl font-black text-balance">
            The Three Pillars of Change
          </h2>
          <BrutalistImage 
            src="/trans-nzoia-townhall/tnts-image04.jpeg" 
            alt="Pillars Action"
            caption="STRATEGY"
            tilt="right"
            className="hidden md:block w-32 -mb-8"
          />
        </div>
        <PillarsGrid pillars={pillars} />
      </section>

      {/* CTA Section */}
      <section className="w-full bg-gradient-to-r from-primary/10 via-card to-secondary/10 py-16 md:py-24 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-6 text-balance text-foreground">
            Ready to Activate Democracy?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-muted-foreground">
            Join over 1,000 youths transforming protest energy into electoral power. Register for your ward's townhall today.
          </p>
          <TiltButton className="text-lg md:text-xl px-8 py-4">
            Register for the Townhall
          </TiltButton>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full bg-background py-16 md:py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { number: '1,000+', label: 'Youths Engaged' },
              { number: '9', label: 'Wards Activated' },
              { number: '75%', label: 'Community Reach' },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="stamp-card text-center py-12 relative overflow-hidden"
              >
                <div className="text-4xl md:text-5xl font-black text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-lg font-bold text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Floating Stat Decoration */}
        <BrutalistImage 
          src="/trans-nzoia-townhall/tnts-image05.jpeg" 
          alt="Stat Highlight"
          caption="NUMBERS"
          tilt="left"
          className="absolute top-0 right-10 w-40 z-0 opacity-20 hover:opacity-100 transition-opacity"
        />
        {/* Additional BrutalistImage for Stats Section */}
        <BrutalistImage 
          src="/trans-nzoia-townhall/tnts-image02.jpeg" 
          alt="Stats Detail"
          caption="IMPACT"
          tilt="right"
          className="absolute bottom-0 left-10 w-40 z-0 opacity-20 hover:opacity-100 transition-opacity hidden md:block"
        />
      </section>

      {/* Team Section */}
      <TeamSection />

      {/* Mission Statement */}
      <section className="w-full bg-black text-background py-16 md:py-24 border-y-4 border-foreground overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl md:text-5xl font-black mb-8 italic uppercase tracking-tighter text-secondary leading-none">
              The Mission <br />
              <span className="text-white">Unfolds.</span>
            </h2>
            <p className="text-lg md:text-xl font-bold leading-tight mb-8 text-white/80">
              We're not just organizing; we're institutionalizing change. From the first Town Hall to national policy influence, our movement is defined by youth energy and strategic foresight.
            </p>
            <p className="text-lg leading-relaxed text-white/70">
              VAR 37-38 is building the institutional infrastructure to transform Kenyan democracy. We convert the energy of youth-led protest movements into electoral power and sustained civic engagement. Articles 37 and 38 of the Kenyan Constitution guarantee every person's right to participate in governance. We're making that right a living reality, one townhall, one ward, one community at a time.
            </p>
          </div>
          <div className="order-1 md:order-2 flex justify-center">
             <BrutalistImage 
               src="/group-pics/group-pic1.jpeg" 
               alt="Team Group"
               caption="THE CORE TEAM"
               tilt="right"
               className="w-full max-w-md"
             />
          </div>
        </div>
      </section>
    </>
  );
}
