
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../App';
import { Resource, PrivacyLevel } from '../types';
import ResourceCard from '../components/ResourceCard';

const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [recentResources, setRecentResources] = useState<Resource[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('nb_resources');
    if (saved) {
      const all: Resource[] = JSON.parse(saved);
      const accessible = all.filter(r => {
        if (r.privacy === PrivacyLevel.PUBLIC) return true;
        return isAuthenticated && r.uploaderCollege === user?.college;
      });
      setRecentResources(accessible.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4));
    }
  }, [isAuthenticated, user]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-white rounded-3xl p-8 md:p-16 border border-slate-200 shadow-sm overflow-hidden relative">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 -z-0"
        ></motion.div>
        
        <div className="relative z-10 max-w-2xl">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6"
          >
            Share knowledge, <span className="text-blue-600">breach</span> the barriers.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-slate-600 mb-8"
          >
            The ultimate hub for college students to upload, manage, and discover academic resources. Secure, collaborative, and tailored for your institution.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/search" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                Browse Resources
              </Link>
            </motion.div>
            {!isAuthenticated && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/register" className="inline-block bg-white text-slate-700 border border-slate-300 px-8 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all">
                  Join Now
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Featured/Recent Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Recently Uploaded</h2>
          <Link to="/search" className="text-blue-600 font-semibold hover:underline">View all</Link>
        </div>
        
        {recentResources.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {recentResources.map(resource => (
              <motion.div key={resource.id} variants={itemVariants}>
                <ResourceCard resource={resource} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300"
          >
            <p className="text-slate-500 mb-4">No resources available yet.</p>
            <Link to="/upload" className="text-blue-600 font-bold hover:underline">Be the first to upload</Link>
          </motion.div>
        )}
      </section>

      {/* Stats/Features Section */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {[
          { title: 'Secure Access', desc: 'Resources marked private are only visible to your college peers.', icon: '🔒' },
          { title: 'Rich Filtering', desc: 'Find exactly what you need by subject, semester, or resource type.', icon: '🔍' },
          { title: 'Peer Reviews', desc: 'Check ratings and reviews to find the best quality notes and materials.', icon: '⭐' }
        ].map((item, i) => (
          <motion.div 
            key={i} 
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-300 transition-colors cursor-default"
          >
            <div className="text-3xl mb-4">{item.icon}</div>
            <h3 className="text-lg font-bold mb-2">{item.title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </motion.section>
    </div>
  );
};

export default Home;
