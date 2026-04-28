import React from 'react';
import { Phone, Mail, Instagram, Youtube, Video } from 'lucide-react';
import { SiteConfig } from '../types';

interface ContactSectionProps {
  config: SiteConfig;
}

const ContactSection: React.FC<ContactSectionProps> = ({ config }) => {
  return (
    <section id="contact" className="py-32">
      <div className="container mx-auto px-6">
        <div className="bg-brand text-white p-12 md:p-20 relative overflow-hidden shadow-[20px_20px_0px_#bef264]">
          <div className="relative z-10 grid md:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-5xl md:text-7xl font-display font-bold tracking-tighter mb-10 leading-none italic uppercase">Inquiry</h2>
              <div className="space-y-8">
                <a href={`tel:${config.phone}`} className="flex items-center gap-6 group">
                  <div className="w-14 h-14 bg-white/10 flex items-center justify-center rounded-full group-hover:bg-white group-hover:text-brand transition-all">
                    <Phone size={24} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-widest opacity-60">Hotline</div>
                    <div className="text-2xl font-bold italic">{config.phone}</div>
                  </div>
                </a>
                <a href={`mailto:${config.email}`} className="flex items-center gap-6 group">
                  <div className="w-14 h-14 bg-white/10 flex items-center justify-center rounded-full group-hover:bg-white group-hover:text-brand transition-all">
                    <Mail size={24} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-widest opacity-60">Mail</div>
                    <div className="text-2xl font-bold italic">{config.email}</div>
                  </div>
                </a>
                {config.instagram && (
                  <a href={config.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-6 group text-acid-green">
                    <div className="w-14 h-14 bg-white/10 flex items-center justify-center rounded-full group-hover:bg-white group-hover:text-brand transition-all">
                      <Instagram size={24} />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold tracking-widest opacity-60">Instagram</div>
                      <div className="text-2xl font-bold italic">Official Account</div>
                    </div>
                  </a>
                )}
                {config.youtube && (
                  <a href={config.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center gap-6 group text-white">
                    <div className="w-14 h-14 bg-white/10 flex items-center justify-center rounded-full group-hover:bg-[#ff0000] group-hover:text-white transition-all">
                      <Youtube size={24} />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold tracking-widest opacity-60">YouTube</div>
                      <div className="text-2xl font-bold italic">Channel</div>
                    </div>
                  </a>
                )}
              </div>
            </div>
            
            <div className="bg-[#0f0a1a]/50 p-8 border border-white/10">
               <h3 className="text-xl font-bold uppercase tracking-widest mb-8 text-acid-green italic">Urgent Broadcast Request</h3>
               <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Name" className="bg-black/20 border border-white/20 px-4 py-3 outline-none focus:border-acid-green transition-colors" />
                    <input type="text" placeholder="Media" className="bg-black/20 border border-white/20 px-4 py-3 outline-none focus:border-acid-green transition-colors" />
                  </div>
                  <input type="email" placeholder="Email" className="w-full bg-black/20 border border-white/20 px-4 py-3 outline-none focus:border-acid-green transition-colors" />
                  <textarea placeholder="Request details..." className="w-full bg-black/20 border border-white/20 px-4 py-3 outline-none focus:border-acid-green transition-colors min-h-[150px]"></textarea>
                  <button className="w-full bg-acid-green text-[#0f0a1a] font-bold py-4 uppercase tracking-[0.2em] hover:bg-white transition-all shadow-[4px_4px_0px_#a855f7]">
                    Send to yonzaci
                  </button>
               </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
