import HeroSection from '@/components/HeroSection';
import LifecycleBento from '@/components/LifecycleBento';
import PartnersSection from '@/components/PartnersSection';
import TeamSection from '@/components/TeamSection';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* 3-Stage Lifecycle (Bento Grid) */}
      <LifecycleBento />

      {/* Impact Overview (Mini Section) */}
      <section className="w-full py-32 bg-background border-t border-border relative overflow-hidden">
        <div className="glow-orb top-0 right-0 opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { number: '1,000+', label: 'Youth Activated' },
              { number: '5', label: 'Wards Engaged' },
              { number: '75%', label: 'Civic Reach' },
              { number: '100%', label: 'Long-term Resilience' },
            ].map((stat, idx) => (
              <div key={idx} className="group">
                <div className="text-5xl font-black mb-2 group-hover:text-primary transition-colors">
                  {stat.number}
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-white/30">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <TeamSection />

      {/* Strategic Partners Section */}
      <PartnersSection />
    </>
  );
}
