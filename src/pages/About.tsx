import React from 'react';
import { motion } from 'motion/react';
import { Globe } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="pt-32 pb-20">
      <section className="py-20 news-grid bg-fixed">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="relative inline-block mb-10">
                <div className="absolute -inset-4 bg-brand/10 border border-brand/20 -z-10 h-full w-full italic" />
                <h2 className="text-4xl font-display font-bold uppercase tracking-widest italic text-acid-green">Identity & Vision</h2>
              </div>
              <p className="text-xl text-zinc-300 leading-relaxed mb-8">
                yonzaci is a name synonymous with accuracy and depth. With over a decade of field experience, I provide real-time interpretations of global shifts.
              </p>
              <div className="space-y-6">
                {[
                  { value: '15+', label: 'Years of Experience' },
                  { value: '2k+', label: 'Broadcast Appearances' },
                  { value: '500+', label: 'Published Articles' }
                ].map((stat, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="text-4xl font-display font-bold text-acid-green italic w-20 tracking-tighter group-hover:scale-110 transition-transform">
                      {stat.value}
                    </div>
                    <div className="text-zinc-500 uppercase tracking-widest text-sm font-bold">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-zinc-900 border border-brand/30 p-8 relative"
            >
              <div className="aspect-[4/5] bg-[#1a1428] relative z-10 overflow-hidden">
                 <div className="absolute inset-0 flex items-center justify-center text-brand/20">
                   <Globe size={120} strokeWidth={0.5} />
                 </div>
                 <div className="absolute bottom-6 left-6 z-20">
                    <div className="bg-brand text-white px-4 py-2 font-display font-bold text-sm tracking-widest uppercase shadow-[4px_4px_0px_#bef264]">
                      OFFICIAL PRESS CARD
                    </div>
                 </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-brand/10 border border-acid-green/20 -z-10" />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-brand/10 border border-acid-green/20 -z-10" />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
