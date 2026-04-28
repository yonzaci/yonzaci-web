import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ShieldAlert } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  onAdminClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onAdminClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: 'hero' },
    { name: 'About', href: 'about' },
    { name: 'Portfolio', href: 'portfolio' },
    { name: 'Services', href: 'services' },
    { name: 'Contact', href: 'contact' },
  ];

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const element = document.getElementById(href);
      if (element) {
        const offset = 80; // Navbar height
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        setIsMobileOpen(false);
      }
    }
  };

  return (
    <nav 
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-[#0f0a1a]/90 backdrop-blur-md border-b border-brand/20 py-4' : 'bg-transparent py-6'
      }`}
      id="main-navbar"
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group" onClick={(e) => handleNavClick(e, 'hero')}>
          <div className="w-8 h-8 bg-brand flex items-center justify-center font-display font-bold text-white italic shadow-[2px_2px_0px_#bef264]">Y</div>
          <span className="font-display font-bold text-2xl tracking-tighter uppercase transition-colors group-hover:text-acid-green">yonzaci</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={location.pathname === '/' ? `#${link.href}` : `/#${link.href}`}
              onClick={(e) => handleNavClick(e, link.href)}
              className={`text-sm font-bold uppercase tracking-[0.2em] transition-colors hover:text-white ${
                location.hash === `#${link.href}` ? 'text-acid-green' : 'text-zinc-400'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <button 
            onClick={onAdminClick}
            className="text-white/20 hover:text-acid-green transition-colors p-2"
            title="Admin Login"
            id="nav-admin-trigger"
          >
            <ShieldAlert size={16} />
          </button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0f0a1a] border-b border-brand/20 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={location.pathname === '/' ? `#${link.href}` : `/#${link.href}`}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-lg font-bold uppercase tracking-widest text-white hover:text-acid-green transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <button 
                onClick={() => {
                  setIsMobileOpen(false);
                  onAdminClick();
                }}
                className="text-acid-green font-bold uppercase tracking-widest flex items-center gap-2"
              >
                <ShieldAlert size={18} />
                Admin Access
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

