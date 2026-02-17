
import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { Resource } from '../types';
import ResourceCard from '../components/ResourceCard';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [myResources, setMyResources] = useState<Resource[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(user?.bio || '');

  useEffect(() => {
    const saved = localStorage.getItem('nb_resources');
    if (saved) {
      const all: Resource[] = JSON.parse(saved);
      setMyResources(all.filter(r => r.uploaderId === user?.id));
    }
  }, [user]);

  const handleUpdateBio = () => {
    if (user) {
      updateUser({ ...user, bio });
      setIsEditing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Profile Header */}
      <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-8">
        <div className="w-32 h-32 rounded-3xl bg-blue-50 border border-blue-100 flex items-center justify-center text-5xl font-bold text-blue-600 shadow-inner">
          {user?.name[0]}
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">{user?.name}</h2>
          <p className="text-blue-600 font-bold mb-4">{user?.college}</p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <span className="px-4 py-1.5 bg-slate-100 rounded-lg text-sm font-semibold text-slate-600">Branch: {user?.branch}</span>
            <span className="px-4 py-1.5 bg-slate-100 rounded-lg text-sm font-semibold text-slate-600">Semester: {user?.semester}</span>
          </div>
        </div>
        <div className="w-full md:w-1/3 bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-800 text-sm">Bio</h3>
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className="text-xs text-blue-600 font-bold">Edit</button>
            )}
          </div>
          {isEditing ? (
            <div className="space-y-3">
              <textarea 
                className="w-full p-3 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                rows={3}
              />
              <div className="flex gap-2">
                <button onClick={handleUpdateBio} className="flex-1 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg">Save</button>
                <button onClick={() => setIsEditing(false)} className="flex-1 py-2 bg-slate-200 text-slate-600 text-xs font-bold rounded-lg">Cancel</button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic">
              {user?.bio || 'You haven\'t added a bio yet.'}
            </p>
          )}
        </div>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center">
          <p className="text-3xl font-black text-slate-900 mb-1">{myResources.length}</p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Resources Uploaded</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center">
          <p className="text-3xl font-black text-slate-900 mb-1">
            {myResources.reduce((acc, r) => acc + r.reviews.length, 0)}
          </p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Reviews Received</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center">
          <p className="text-3xl font-black text-slate-900 mb-1">
            {myResources.length > 0 ? (myResources.reduce((acc, r) => {
              const rAvg = r.reviews.length > 0 ? r.reviews.reduce((sum, rv) => sum + rv.rating, 0) / r.reviews.length : 0;
              return acc + rAvg;
            }, 0) / myResources.filter(r => r.reviews.length > 0).length || 0).toFixed(1) : '0.0'}
          </p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Average Rating</p>
        </div>
      </section>

      {/* User Uploads Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-slate-900">Your Resources</h3>
          <button 
            onClick={() => window.location.hash = '/upload'}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all text-sm"
          >
            + Upload New
          </button>
        </div>

        {myResources.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {myResources.map(resource => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-20 rounded-3xl border border-dashed border-slate-300 text-center">
            <p className="text-slate-500 font-medium mb-4">You haven't uploaded any resources yet.</p>
            <p className="text-slate-400 text-sm">Start sharing with your community to build your academic profile.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Profile;
