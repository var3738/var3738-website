'use client';

import TeamCard from './TeamCard';

const team = [
  {
    name: 'Keno Manwar',
    position: 'Founder',
    image: 'KenoManwar.jpeg',
  },
  {
    name: 'Ivy Muchoki',
    position: 'National Cordinator/ Cofounder',
    image: 'IvyMuchoki.jpeg',
  },
  {
    name: 'Madzao Rocha',
    position: 'Founding youth Leader',
    image: 'MadzaoRocha.jpeg',
  },
  {
    name: 'Sincere Shem',
    position: 'Youth Thought leader/ Host',
    image: 'SincereShem.jpeg',
  },
  {
    name: 'Benjamin Mkapa',
    position: 'Youth Thought Advocate',
    image: 'BenjaminMkapa.jpeg',
  },
];

export default function TeamSection() {
  return (
    <section className="w-full py-32 bg-background relative overflow-hidden">
      <div className="glow-orb top-0 right-0 opacity-5"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-20">
           <h2 className="mb-6 font-black tracking-tighter">
             The <br />
             <span className="text-primary italic">Movement</span> Creators
           </h2>
           <p className="text-white/40 max-w-xl text-lg font-medium">
             A professional coalition of builders, dreamers, and agitators. Redefining power through structured civic engagement.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member) => (
            <TeamCard
              key={member.name}
              name={member.name}
              position={member.position}
              image={member.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
