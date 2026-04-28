import React from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, ChevronRight } from 'lucide-react';

interface HeroProps {
  tagline: string;
  subTagline: string;
  heroImageUrl?: string;
  onContactClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ tagline, subTagline, heroImageUrl, onContactClick }) => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-32 pb-20 overflow-hidden news-grid" id="hero">
      {heroImageUrl && (
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImageUrl} 
            className="w-full h-full object-cover opacity-30 mix-blend-luminosity" 
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent" />
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-zinc-950 to-transparent z-0" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="h-[2px] w-12 bg-acid-green" />
            <span className="text-acid-green uppercase tracking-[0.3em] font-bold text-xs">Professional Journalist & Commentator</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl font-display font-bold leading-[1] mb-8 tracking-tighter"
          >
            {tagline || "Interpreting the Scene, Reading the Flow."}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-zinc-400 mb-10 max-w-2xl font-light leading-relaxed border-l-4 border-brand pl-6"
          >
            {subTagline || "Freelance Journalist • Foreign News Analyst • Political Commentator"}
          </motion.p>


          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <button 
              onClick={onContactClick}
              className="bg-brand hover:bg-brand/90 text-white px-8 py-4 font-bold flex items-center gap-3 transition-all group"
              id="cta-interview-inquiry"
            >
              Inquiry for Interview
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <a 
              href="tel:+821000000000"
              className="border border-zinc-700 hover:border-zinc-500 bg-zinc-900/50 backdrop-blur px-8 py-4 font-bold flex items-center gap-3 transition-all"
              id="cta-direct-call"
            >
              <Phone size={18} />
              Direct Call
            </a>
          </motion.div>
        </div>
      </div>

      {/* Decorative vertical lines */}
      <div className="absolute right-0 top-0 h-full w-[1px] bg-zinc-800/50 mr-[20%] hidden lg:block" />
      <div className="absolute left-0 top-0 h-full w-[1px] bg-zinc-800/50 ml-[10%] hidden lg:block" />
    </section>
  );
};

export default Hero;
