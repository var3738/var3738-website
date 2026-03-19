'use client';

import TeamCard from './TeamCard';

const team = [
  {
    name: 'Ivy Muchoki',
    position: 'National Cordinator/ Cofounder',
    image: 'IvyMuchoki.jpeg',
  },
  {
    name: 'Keno Manwar',
    position: 'Founder',
    image: 'KenoManwar.jpeg',
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
    <section className="w-full py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="text-6xl font-black mb-4 italic uppercase tracking-tighter leading-none">
            The <span className="bg-[#022855] text-white px-4 border-4 border-black inline-block transform -rotate-1">Command</span>
          </h2>
          <p className="text-xl font-bold max-w-2xl text-black/70">
            A coalition of builders, dreamers, and agitators. Driving the movement forward through collective action and strategic vision.
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
