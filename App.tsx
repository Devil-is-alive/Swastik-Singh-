
import React, { useState, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { User, AuthState } from './types';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Upload from './pages/Upload';
import Search from './pages/Search';
import Profile from './pages/Profile';
import ResourceDetail from './pages/ResourceDetail';

// Mock Auth Context
interface AuthContextType extends AuthState {
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="page-transition-wrapper"
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
          <Route path="/search" element={<Search />} />
          <Route 
            path="/upload" 
            element={isAuthenticated ? <Upload /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/upload/:id" 
            element={isAuthenticated ? <Upload /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/profile" 
            element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} 
          />
          <Route path="/resource/:id" element={<ResourceDetail />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const saved = localStorage.getItem('nb_auth');
    return saved ? JSON.parse(saved) : { user: null, isAuthenticated: false };
  });

  const login = (user: User) => {
    const newState = { user, isAuthenticated: true };
    setAuthState(newState);
    localStorage.setItem('nb_auth', JSON.stringify(newState));
  };

  const logout = () => {
    const newState = { user: null, isAuthenticated: false };
    setAuthState(newState);
    localStorage.removeItem('nb_auth');
  };

  const updateUser = (user: User) => {
    const newState = { ...authState, user };
    setAuthState(newState);
    localStorage.setItem('nb_auth', JSON.stringify(newState));
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, updateUser }}>
      <HashRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            <AnimatedRoutes />
          </main>
          <footer className="bg-white border-t py-6 text-center text-slate-500 text-sm">
            &copy; 2026 Neural Breach - Yugastr Hackathon. All rights reserved.
          </footer>
        </div>
      </HashRouter>
    </AuthContext.Provider>
  );
};

export default App;
