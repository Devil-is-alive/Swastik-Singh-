
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Resource, PrivacyLevel } from '../types';

interface ResourceCardProps {
  resource: Resource;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  const avgRating = resource.reviews.length > 0 
    ? (resource.reviews.reduce((acc, r) => acc + r.rating, 0) / resource.reviews.length).toFixed(1)
    : 'New';

  const typeColors: Record<string, string> = {
    'Notes': 'bg-amber-100 text-amber-700',
    'Question Papers': 'bg-blue-100 text-blue-700',
    'Solutions': 'bg-green-100 text-green-700',
    'Project Reports': 'bg-purple-100 text-purple-700',
    'Study Material': 'bg-indigo-100 text-indigo-700'
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="h-full"
    >
      <Link 
        to={`/resource/${resource.id}`}
        className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-shadow group flex flex-col h-full"
      >
        <div className="p-5 flex-grow">
          <div className="flex items-center justify-between mb-3">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${typeColors[resource.type] || 'bg-slate-100 text-slate-700'}`}>
              {resource.type}
            </span>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${resource.privacy === PrivacyLevel.PRIVATE ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
              {resource.privacy}
            </span>
          </div>
          
          <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1 line-clamp-2">
            {resource.title}
          </h3>
          <p className="text-xs text-slate-500 mb-4">{resource.subject} • Sem {resource.semester}</p>
          
          <div className="flex flex-wrap gap-1 mb-4">
            {resource.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">#{tag}</span>
            ))}
          </div>
        </div>

        <div className="px-5 py-3 bg-slate-50 border-t flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">
              {resource.uploaderName[0]}
            </div>
            <span className="text-xs font-medium text-slate-600 truncate max-w-[80px]">{resource.uploaderName}</span>
          </div>
          <div className="flex items-center gap-1">
            <motion.span 
              animate={{ rotate: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2, delay: Math.random() * 2 }}
              className="text-amber-500 text-xs font-bold"
            >
              ★
            </motion.span>
            <span className="text-xs font-bold text-slate-700">{avgRating}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ResourceCard;
