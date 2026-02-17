
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../App';
import { Resource, PrivacyLevel, ResourceType } from '../types';
import ResourceCard from '../components/ResourceCard';

const Search: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [filters, setFilters] = useState({
    subject: '',
    semester: '',
    type: '',
    privacy: '',
    sortBy: 'latest'
  });

  useEffect(() => {
    const saved = localStorage.getItem('nb_resources');
    if (saved) {
      setResources(JSON.parse(saved));
    }
  }, []);

  const filteredResources = useMemo(() => {
    return resources.filter(r => {
      const isAccessible = r.privacy === PrivacyLevel.PUBLIC || (isAuthenticated && r.uploaderCollege === user?.college);
      if (!isAccessible) return false;

      const query = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || 
        r.title.toLowerCase().includes(query) || 
        r.subject.toLowerCase().includes(query) || 
        r.tags.some(t => t.toLowerCase().includes(query));

      const matchesSubject = !filters.subject || r.subject.toLowerCase().includes(filters.subject.toLowerCase());
      const matchesSemester = !filters.semester || r.semester === filters.semester;
      const matchesType = !filters.type || r.type === filters.type;
      const matchesPrivacy = !filters.privacy || r.privacy === filters.privacy;

      return matchesSearch && matchesSubject && matchesSemester && matchesType && matchesPrivacy;
    }).sort((a, b) => {
      if (filters.sortBy === 'latest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (filters.sortBy === 'rating') {
        const ratingA = a.reviews.length ? a.reviews.reduce((acc, rv) => acc + rv.rating, 0) / a.reviews.length : 0;
        const ratingB = b.reviews.length ? b.reviews.reduce((acc, rv) => acc + rv.rating, 0) / b.reviews.length : 0;
        return ratingB - ratingA;
      }
      if (filters.sortBy === 'popular') return b.reviews.length - a.reviews.length;
      return 0;
    });
  }, [resources, searchQuery, filters, isAuthenticated, user]);

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 space-y-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-2xl border border-slate-200 sticky top-24"
        >
          <h2 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="text-blue-600">⚡</span> Filters
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Sort By</label>
              <select 
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                value={filters.sortBy}
                onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
              >
                <option value="latest">Latest Uploads</option>
                <option value="rating">Highest Rated</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Semester</label>
              <select 
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                value={filters.semester}
                onChange={(e) => setFilters({...filters, semester: e.target.value})}
              >
                <option value="">All Semesters</option>
                {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Type</label>
              <select 
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
              >
                <option value="">All Types</option>
                {Object.values(ResourceType).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFilters({subject: '', semester: '', type: '', privacy: '', sortBy: 'latest'})}
              className="w-full text-xs font-bold text-blue-600 hover:text-blue-800 pt-2 border-t mt-4"
            >
              Reset All Filters
            </motion.button>
          </div>
        </motion.div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <input 
            type="text" 
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-blue-500 text-lg transition-all"
            placeholder="Search by title, subject, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-slate-300">🔍</div>
        </motion.div>

        <div className="flex items-center justify-between">
          <p className="text-slate-500 text-sm">Showing <span className="font-bold text-slate-900">{filteredResources.length}</span> resources</p>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredResources.map(resource => (
              <motion.div 
                key={resource.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <ResourceCard resource={resource} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredResources.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32 bg-white rounded-3xl border border-dashed border-slate-200"
          >
            <div className="text-5xl mb-4">🏜️</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No results found</h3>
            <p className="text-slate-500">Try adjusting your search or filters.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Search;
