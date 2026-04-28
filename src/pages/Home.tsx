import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import PortfolioSection from '../components/PortfolioSection';
import ServicesSection from '../components/ServicesSection';
import ContactSection from '../components/ContactSection';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { SiteConfig } from '../types';

const Home: React.FC = () => {
  const [config, setConfig] = useState<SiteConfig>({
    tagline: 'Interpreting the Scene, Reading the Flow.',
    subTagline: 'Freelance Journalist • Foreign News Analyst • Political Commentator',
    heroImageUrl: '',
    aboutText: 'yonzaci is a name synonymous with accuracy and depth. With over a decade of field experience, I provide real-time interpretations of global shifts.',
    stat1Value: '15+', stat1Label: 'Years of Experience',
    stat2Value: '2k+', stat2Label: 'Broadcast Appearances',
    stat3Value: '500+', stat3Label: 'Published Articles',
    servicesHeadline: 'SERVICES & COLLABORATION',
    servicesSubline: 'Available for regular panels, spot analysis, and content advisory across diverse media formats.',
    phone: '+82 10 0000 0000',
    email: 'contact@yonzaci.com',
    instagram: '',
    youtube: ''
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'config'));
        if (!snapshot.empty) {
          setConfig(snapshot.docs[0].data() as SiteConfig);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchConfig();
  }, []);
  
  const scrollToContact = () => {
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="pb-20">
      <Hero 
        tagline={config.tagline}
        subTagline={config.subTagline}
        heroImageUrl={config.heroImageUrl}
        onContactClick={scrollToContact}
      />

      {/* Trust Badges */}
      <section className="bg-[#1a1428] border-y border-brand/20 py-12 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all">
            <span className="font-display font-bold text-2xl tracking-tighter text-acid-green">BBC NEWS</span>
            <span className="font-display font-bold text-2xl tracking-tighter italic text-acid-green">Al Jazeera</span>
            <span className="font-display font-bold text-2xl tracking-tighter text-acid-green">NY Times</span>
            <span className="font-display font-bold text-2xl tracking-tighter uppercase text-acid-green">Reuters</span>
            <span className="font-display font-bold text-2xl tracking-tighter text-acid-green">Arirang TV</span>
          </div>
        </div>
      </section>

      <AboutSection config={config} />
      <PortfolioSection />
      <ServicesSection config={config} />
      <ContactSection config={config} />
    </div>
  );
};

export default Home;
