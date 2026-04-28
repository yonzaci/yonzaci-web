import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { PortfolioItem } from '../types';
import ProjectCard from './ProjectCard';
import { ArrowRight } from 'lucide-react';

const PortfolioSection: React.FC = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, 'portfolio'), orderBy('createdAt', 'desc'), limit(6));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PortfolioItem));
        setItems(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <section id="portfolio" className="py-32 bg-[#0f0a1a]">
      <div className="container mx-auto px-6">
        <header className="mb-20 flex justify-between items-end">
          <div>
            <h2 className="text-6xl font-display font-bold tracking-tighter mb-4 italic text-acid-green uppercase">Portfolio</h2>
            <p className="text-zinc-400 max-w-xl">Recent broadcasting clips and analytical reports.</p>
          </div>
          <a href="/portfolio" className="text-acid-green font-bold uppercase tracking-widest text-xs flex items-center gap-2 hover:gap-4 transition-all pb-2">
            View All Work <ArrowRight size={14} />
          </a>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array(3).fill(0).map((_, i) => <div key={i} className="aspect-video bg-zinc-900 animate-pulse border border-zinc-800" />)
          ) : items.length > 0 ? (
            items.map(item => <ProjectCard key={item.id} item={item} />)
          ) : (
            <div className="col-span-full py-10 text-zinc-600 italic">No content found. Use Admin panel to add content.</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
