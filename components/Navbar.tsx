
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">NB</div>
          <span className="font-bold text-xl tracking-tight hidden sm:inline">Neural Breach</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/search" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Browse</Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/upload" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Upload</Link>
              <div className="flex items-center gap-4 border-l pl-4 ml-2">
                <Link to="/profile" className="flex items-center gap-2 group">
                  <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden border border-slate-300">
                    {user?.profilePic ? (
                      <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-bold text-slate-500">{user?.name[0].toUpperCase()}</span>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 hidden md:inline">{user?.name}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-slate-600 hover:text-blue-600 font-medium px-4 py-2">Login</Link>
              <Link to="/register" className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
