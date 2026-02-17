
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../App';
import { ResourceType, PrivacyLevel, Resource } from '../types';

const Upload: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    semester: '1',
    type: ResourceType.NOTES,
    yearBatch: new Date().getFullYear().toString(),
    description: '',
    tags: '',
    privacy: PrivacyLevel.PUBLIC,
    fileName: ''
  });

  useEffect(() => {
    if (id) {
      const saved = localStorage.getItem('nb_resources');
      if (saved) {
        const resources: Resource[] = JSON.parse(saved);
        const resource = resources.find(r => r.id === id);
        if (resource) {
          if (resource.uploaderId !== user?.id) {
            navigate('/');
            return;
          }
          setFormData({
            title: resource.title,
            subject: resource.subject,
            semester: resource.semester,
            type: resource.type,
            yearBatch: resource.yearBatch,
            description: resource.description,
            tags: resource.tags.join(', '),
            privacy: resource.privacy,
            fileName: resource.fileName
          });
        }
      }
    }
  }, [id, user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    // Simulate upload delay
    setTimeout(() => {
      const saved = localStorage.getItem('nb_resources');
      let resources: Resource[] = saved ? JSON.parse(saved) : [];

      const resourceData: Resource = {
        id: id || Math.random().toString(36).substr(2, 9),
        uploaderId: user.id,
        uploaderName: user.name,
        uploaderCollege: user.college,
        title: formData.title,
        subject: formData.subject,
        semester: formData.semester,
        type: formData.type,
        yearBatch: formData.yearBatch,
        description: formData.description,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t !== ''),
        privacy: formData.privacy,
        fileName: formData.fileName || 'document.pdf',
        fileUrl: '#', // In real app, this would be the S3/Cloudinary URL
        reviews: id ? (resources.find(r => r.id === id)?.reviews || []) : [],
        createdAt: id ? (resources.find(r => r.id === id)?.createdAt || new Date().toISOString()) : new Date().toISOString()
      };

      if (id) {
        resources = resources.map(r => r.id === id ? resourceData : r);
      } else {
        resources.push(resourceData);
      }

      localStorage.setItem('nb_resources', JSON.stringify(resources));
      setLoading(false);
      navigate('/profile');
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{id ? 'Edit Resource' : 'Upload Resource'}</h2>
        <p className="text-slate-500 mb-8">Share your study materials with others.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Resource Title *</label>
              <input 
                required
                type="text" 
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Advanced Data Structures Unit 1 Notes"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Subject / Course Name *</label>
              <input 
                required
                type="text" 
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Computer Science"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Semester *</label>
              <select 
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.semester}
                onChange={(e) => setFormData({...formData, semester: e.target.value})}
              >
                {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Resource Type *</label>
              <select 
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as ResourceType})}
              >
                {Object.values(ResourceType).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Year / Batch *</label>
              <input 
                required
                type="text" 
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 2024"
                value={formData.yearBatch}
                onChange={(e) => setFormData({...formData, yearBatch: e.target.value})}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tags (Comma separated)</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. algorithm, dsa, notes"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
              <textarea 
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe what this resource covers..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Privacy Setting</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-xl flex-1 hover:bg-slate-50">
                  <input 
                    type="radio" 
                    name="privacy" 
                    className="w-4 h-4 text-blue-600"
                    checked={formData.privacy === PrivacyLevel.PUBLIC}
                    onChange={() => setFormData({...formData, privacy: PrivacyLevel.PUBLIC})}
                  />
                  <div>
                    <span className="block font-semibold text-sm">Public</span>
                    <span className="block text-xs text-slate-500">Accessible by everyone</span>
                  </div>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-xl flex-1 hover:bg-slate-50">
                  <input 
                    type="radio" 
                    name="privacy" 
                    className="w-4 h-4 text-blue-600"
                    checked={formData.privacy === PrivacyLevel.PRIVATE}
                    onChange={() => setFormData({...formData, privacy: PrivacyLevel.PRIVATE})}
                  />
                  <div>
                    <span className="block font-semibold text-sm">Private</span>
                    <span className="block text-xs text-slate-500">Only peers from {user?.college}</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">File Upload *</label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50">
                <input 
                  type="file" 
                  className="hidden" 
                  id="file-upload" 
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setFormData({...formData, fileName: e.target.files[0].name});
                    }
                  }}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="text-4xl mb-2">📄</div>
                  <p className="font-semibold text-slate-700">{formData.fileName || 'Click to select a file'}</p>
                  <p className="text-xs text-slate-500 mt-1">PDF, DOCX, Image, PPT up to 20MB</p>
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-3.5 border border-slate-300 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button 
              disabled={loading}
              type="submit"
              className={`flex-1 px-6 py-3.5 bg-blue-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-100 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}
            >
              {loading ? 'Processing...' : (id ? 'Update Resource' : 'Publish Resource')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Upload;
