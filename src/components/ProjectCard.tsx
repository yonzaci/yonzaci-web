import React from 'react';
import { motion } from 'motion/react';
import { Play, FileText, ArrowRight, Calendar } from 'lucide-react';
import { PortfolioItem } from '../types';

interface ProjectCardProps {
  item: PortfolioItem;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ item }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-zinc-900 border border-zinc-800 overflow-hidden hover:border-brand transition-colors flex flex-col"
      id={`portfolio-item-${item.id}`}
    >
      <a 
        href={item.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="aspect-video relative overflow-hidden bg-zinc-800"
      >
        {item.images && item.images.length > 0 ? (
          <>
            <img 
              src={item.images[0]} 
              alt={item.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            {item.images.length > 1 && (
              <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur px-2 py-1 text-[10px] font-bold text-acid-green">
                +{item.images.length - 1} MORE
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-600">
            {item.type === 'video' ? <Play size={48} /> : <FileText size={48} />}
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className="bg-acid-green text-black text-[10px] uppercase tracking-widest font-bold px-2 py-1 shadow-[2px_2px_0px_#a855f7]">
            {item.category}
          </span>
        </div>
        {item.type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
            <div className="bg-acid-green p-3 rounded-full text-black">
              <Play size={20} fill="currentColor" />
            </div>
          </div>
        )}
      </a>

      <div className="p-5">
        <div className="flex items-center gap-2 text-zinc-500 text-xs mb-2">
          <span className="font-bold text-acid-green uppercase tracking-tighter">{item.mediaName}</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            <span>{typeof item.createdAt === 'string' ? item.createdAt : 'Recent'}</span>
          </div>
        </div>
        <h3 className="text-xl font-bold mb-2 line-clamp-2 leading-tight group-hover:text-acid-green transition-colors">
          {item.title}
        </h3>
        <p className="text-zinc-400 text-sm line-clamp-2 mb-4">
          {item.description}
        </p>
        <a 
          href={item.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-acid-green text-sm font-bold uppercase tracking-widest hover:gap-3 transition-all"
        >
          View Full {item.type === 'video' ? 'Clip' : 'Article'}
          <ArrowRight size={14} />
        </a>
      </div>

    </motion.div>
  );
};

export default ProjectCard;
