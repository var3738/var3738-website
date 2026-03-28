import HeroSection from '@/components/HeroSection';
import LifecycleBento from '@/components/LifecycleBento';
import PartnersSection from '@/components/PartnersSection';
import TeamSection from '@/components/TeamSection';
import WhoWeAre from '@/components/WhoWeAre';
import StrategicAlignment from '@/components/StrategicAlignment';
import ProvenTrackRecord from '@/components/ProvenTrackRecord';
import DetailedPillars from '@/components/DetailedPillars';
import PartnershipFramework from '@/components/PartnershipFramework';
import DUAEventSection from '@/components/DUAEventSection';
import ByElectionsSection from '@/components/ByElectionsSection';
import LatestDispatches from '@/components/LatestDispatches';

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    'name': 'VAR 37/38',
    'legalName': 'Viable Alternative Republic',
    'url': 'https://var3738.org',
    'logo': 'https://var3738.org/icon.svg',
    'foundingDate': '2024',
    'founders': [
      {
        '@type': 'Person',
        'name': 'Keno Manwar'
      }
    ],
    'address': {
      '@type': 'PostalAddress',
      'addressCountry': 'Kenya'
    },
    'areaServed': 'Kenya',
    'sameAs': [
      'https://www.youtube.com/@VAR3738',
      'https://www.tiktok.com/@var3738'
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      
      {/* 3-Stage Lifecycle (Bento Grid) - Keeping for visual impact */}
      <LifecycleBento />

      <WhoWeAre />
      
      <DetailedPillars />

      <StrategicAlignment />

      <ProvenTrackRecord />

      {/* Impact Overview (Stats) */}
      <section className="w-full py-32 bg-background border-t border-white/5 relative overflow-hidden">
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

      <PartnershipFramework />


      <DUAEventSection />
      
      <ByElectionsSection />

      <LatestDispatches />

      <TeamSection />
      
      <PartnersSection />
    </>
  );
}

