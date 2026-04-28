import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import AdminPanel from './components/AdminPanel';
import Home from './pages/Home';
import About from './pages/About';
import Portfolio from './pages/Portfolio';
import Services from './pages/Services';
import Contact from './pages/Contact';
import { Mail } from 'lucide-react';

export default function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen text-zinc-100">
        <Navbar onAdminClick={() => setIsAdminOpen(true)} />
        
        {isAdminOpen && <AdminPanel onClose={() => setIsAdminOpen(false)} />}

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <footer className="py-20 border-t border-brand/10 bg-zinc-950">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-brand flex items-center justify-center font-display font-bold text-white italic shadow-[2px_2px_0px_#bef264]">Y</div>
                <span className="font-display font-bold text-xl tracking-tighter uppercase transition-colors hover:text-acid-green">yonzaci professional</span>
              </div>
              <div className="flex flex-wrap justify-center gap-8 text-[11px] uppercase tracking-widest font-bold text-zinc-500">
                <Link to="/about" className="hover:text-acid-green transition-colors">Career</Link>
                <Link to="/portfolio" className="hover:text-acid-green transition-colors">Portfolio</Link>
                <Link to="/contact" className="hover:text-acid-green transition-colors">Inquiry</Link>
                <span className="opacity-30">© 2026 yonzaci. All Rights Reserved.</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

