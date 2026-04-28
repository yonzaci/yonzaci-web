import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { PortfolioItem } from '../types';
import ProjectCard from '../components/ProjectCard';
import { ArrowRight } from 'lucide-react';

const Portfolio: React.FC = () => {
  const [videos, setVideos] = useState<PortfolioItem[]>([]);
  const [articles, setArticles] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, 'portfolio'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PortfolioItem));
        setVideos(data.filter(item => item.type === 'video'));
        setArticles(data.filter(item => item.type === 'article'));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="pt-32 pb-20">
      <section className="py-20">
        <div className="container mx-auto px-6">
          <header className="mb-20">
            <h2 className="text-6xl font-display font-bold tracking-tighter mb-4 italic text-acid-green uppercase">Portfolio</h2>
            <p className="text-zinc-400 max-w-xl">Curated selection of broadcasting clips and analytical reports.</p>
          </header>

          <div className="mb-24">
            <h3 className="text-2xl font-display font-bold mb-10 border-l-4 border-brand pl-4 tracking-widest uppercase">Video Archives</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading ? (
                Array(3).fill(0).map((_, i) => <div key={i} className="aspect-video bg-zinc-900 animate-pulse" />)
              ) : videos.length > 0 ? (
                videos.map(item => <ProjectCard key={item.id} item={item} />)
              ) : (
                <div className="col-span-full py-10 text-zinc-600 italic">No video content found.</div>
              )}
            </div>
          </div>

          <div>
             <h3 className="text-2xl font-display font-bold mb-10 border-l-4 border-brand pl-4 tracking-widest uppercase">Analytical Articles</h3>
             <div className="grid md:grid-cols-2 gap-8">
               {articles.map(item => (
                 <motion.a 
                   key={item.id}
                   href={item.url}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="group p-8 border border-brand/10 hover:border-acid-green/50 hover:bg-brand/5 transition-all flex flex-col justify-between h-full bg-[#1a1428]"
                 >
                   <div>
                     <div className="flex items-center gap-3 mb-6">
                       <span className="text-xs font-bold text-acid-green italic tracking-widest uppercase">{item.mediaName}</span>
                       <span className="w-1 h-1 bg-zinc-700 rounded-full" />
                       <span className="text-xs text-zinc-500 font-medium">{item.createdAt}</span>
                     </div>
                     <h3 className="text-2xl font-bold mb-4 group-hover:text-acid-green transition-colors">
                       {item.title}
                     </h3>
                     <p className="text-zinc-400 line-clamp-3 mb-8">
                       {item.description}
                     </p>
                   </div>
                   <div className="flex items-center gap-2 text-acid-green font-bold uppercase tracking-widest text-xs">
                     Read report <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                   </div>
                 </motion.a>
               ))}
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
