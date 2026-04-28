import React from 'react';
import { Tv, Globe, PenTool, Presentation } from 'lucide-react';

const Services: React.FC = () => {
  const services = [
    { icon: <Tv size={48} />, title: 'Broadcast Panel', desc: 'Expert commentary and debate for national news programs and talk shows.' },
    { icon: <Globe size={48} />, title: 'Foreign News Analyst', desc: 'Real-time interpretation and analysis of global political and economic shifts.' },
    { icon: <PenTool size={48} />, title: 'Content Production', desc: 'Strategy and production of high-impact journalistic content and series.' },
    { icon: <Presentation size={48} />, title: 'Lectures & Seminars', desc: 'Educational sessions on international relations and modern journalism trends.' },
  ];

  return (
    <div className="pt-32 pb-20">
      <section className="py-20">
        <div className="container mx-auto px-6">
          <header className="mb-20 max-w-3xl">
             <h2 className="text-6xl font-display font-bold tracking-tighter mb-4 italic text-acid-green uppercase">Collaboration</h2>
             <p className="text-xl text-zinc-400">Professional services tailored for media outlets, academic institutions, and corporate think-tanks.</p>
          </header>

          <div className="grid md:grid-cols-2 gap-10">
            {services.map((service, i) => (
              <div key={i} className="p-12 bg-[#1a1428] border border-brand/20 group hover:border-acid-green transition-all relative overflow-hidden">
                <div className="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                  {React.cloneElement(service.icon as React.ReactElement, { size: 240 })}
                </div>
                <div className="text-acid-green mb-10">{service.icon}</div>
                <h3 className="text-3xl font-display font-bold mb-6 tracking-tighter uppercase italic">{service.title}</h3>
                <p className="text-zinc-400 text-lg leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
