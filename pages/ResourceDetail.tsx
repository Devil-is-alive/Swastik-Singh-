
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../App';
import { Resource, PrivacyLevel, Review } from '../types';

const ResourceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [resource, setResource] = useState<Resource | null>(null);
  const [denied, setDenied] = useState(false);
  
  // Review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('nb_resources');
    if (saved) {
      const all: Resource[] = JSON.parse(saved);
      const found = all.find(r => r.id === id);
      if (found) {
        // Access Verification
        if (found.privacy === PrivacyLevel.PRIVATE) {
          if (!isAuthenticated || user?.college !== found.uploaderCollege) {
            setDenied(true);
            return;
          }
        }
        setResource(found);
      }
    }
  }, [id, isAuthenticated, user]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user || !resource) return;

    setSubmittingReview(true);
    
    setTimeout(() => {
      const newReview: Review = {
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        userName: user.name,
        rating,
        comment,
        createdAt: new Date().toISOString()
      };

      const saved = localStorage.getItem('nb_resources');
      if (saved) {
        const all: Resource[] = JSON.parse(saved);
        const updated = all.map(r => {
          if (r.id === resource.id) {
            const existingIdx = r.reviews.findIndex(rev => rev.userId === user.id);
            const reviews = [...r.reviews];
            if (existingIdx >= 0) reviews[existingIdx] = newReview;
            else reviews.push(newReview);
            return { ...r, reviews };
          }
          return r;
        });
        localStorage.setItem('nb_resources', JSON.stringify(updated));
        setResource(updated.find(r => r.id === resource.id) || null);
        setComment('');
        setSubmittingReview(false);
      }
    }, 500);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      const saved = localStorage.getItem('nb_resources');
      if (saved) {
        const all: Resource[] = JSON.parse(saved);
        const updated = all.filter(r => r.id !== id);
        localStorage.setItem('nb_resources', JSON.stringify(updated));
        navigate('/profile');
      }
    }
  };

  if (denied) {
    return (
      <div className="max-w-xl mx-auto mt-20 text-center">
        <div className="bg-white p-12 rounded-3xl border border-red-100 shadow-xl shadow-red-50">
          <div className="text-6xl mb-6 text-red-500">🔒</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Access Denied</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            This resource is <span className="font-bold text-red-600">private</span> and only available to students from 
            <span className="block font-bold text-slate-800 text-lg mt-2">{resource?.uploaderCollege || 'the uploader\'s college'}</span>
          </p>
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  if (!resource) return <div className="text-center py-20">Loading resource...</div>;

  const avgRating = resource.reviews.length > 0 
    ? (resource.reviews.reduce((acc, r) => acc + r.rating, 0) / resource.reviews.length).toFixed(1)
    : 'N/A';

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Top Header / Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
              {resource.type}
            </span>
            <span className="text-slate-400 text-xs">Uploaded {new Date(resource.createdAt).toLocaleDateString()}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">{resource.title}</h1>
          <p className="text-slate-500 mt-1">{resource.subject} • Semester {resource.semester}</p>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated && user?.id === resource.uploaderId ? (
            <>
              <Link to={`/upload/${resource.id}`} className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all">
                Edit
              </Link>
              <button onClick={handleDelete} className="px-5 py-2.5 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all">
                Delete
              </button>
            </>
          ) : (
            <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
              <span>⬇️</span> Download File
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="text-blue-500">📝</span> Description
            </h3>
            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
              {resource.description || 'No description provided.'}
            </p>
            
            <div className="mt-8 flex flex-wrap gap-2">
              {resource.tags.map((tag, i) => (
                <span key={i} className="px-3 py-1 bg-slate-50 text-slate-500 border rounded-lg text-sm">#{tag}</span>
              ))}
            </div>
          </section>

          {/* Review Section */}
          <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <span className="text-amber-500 text-xl">★</span> Reviews ({resource.reviews.length})
              </h3>
              <div className="text-2xl font-black text-slate-900">{avgRating} <span className="text-slate-300 font-normal">/ 5</span></div>
            </div>

            {/* Add Review Form */}
            {isAuthenticated && (
              <form onSubmit={handleSubmitReview} className="mb-10 bg-slate-50 p-6 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-4 text-sm">Write a review</h4>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(star => (
                      <button 
                        key={star} 
                        type="button"
                        onClick={() => setRating(star)}
                        className={`text-2xl transition-all ${star <= rating ? 'text-amber-400' : 'text-slate-300'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-500">{rating} out of 5 stars</span>
                </div>
                <textarea 
                  required
                  className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 mb-4"
                  placeholder="Share your feedback about this resource..."
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button 
                  disabled={submittingReview}
                  className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50"
                >
                  {submittingReview ? 'Submitting...' : 'Post Review'}
                </button>
              </form>
            )}

            {/* Review List */}
            <div className="space-y-6">
              {resource.reviews.length > 0 ? (
                resource.reviews.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(review => (
                  <div key={review.id} className="pb-6 border-b last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                          {review.userName[0]}
                        </div>
                        <span className="font-bold text-slate-800 text-sm">{review.userName}</span>
                      </div>
                      <span className="text-xs text-slate-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-0.5 text-amber-400 text-sm mb-2">
                      {Array.from({length: 5}).map((_, i) => <span key={i}>{i < review.rating ? '★' : '☆'}</span>)}
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-slate-400 py-4 italic">No reviews yet. Be the first to review!</p>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <aside className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Uploader Information</h4>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-xl font-bold text-blue-600">
                {resource.uploaderName[0]}
              </div>
              <div>
                <p className="font-bold text-slate-900">{resource.uploaderName}</p>
                <p className="text-xs text-slate-500">Member since 2024</p>
              </div>
            </div>
            <div className="space-y-3 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">College:</span>
                <span className="font-semibold text-slate-800 text-right">{resource.uploaderCollege}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Year:</span>
                <span className="font-semibold text-slate-800">{resource.yearBatch}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-600 p-6 rounded-2xl text-white shadow-lg shadow-blue-100">
            <h4 className="font-bold mb-2">Helpful Tip 💡</h4>
            <p className="text-sm text-blue-100 leading-relaxed">
              Downloaded resources are for educational purposes only. Always credit the original author when sharing.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ResourceDetail;
