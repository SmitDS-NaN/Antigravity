import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout } from 'lucide-react';

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="relative flex items-center justify-center mb-4">
          <div className="w-16 h-16 border-4 border-agro-500/20 border-t-agro-500 rounded-full animate-spin"></div>
          <Sprout className="w-7 h-7 text-agro-400 absolute animate-pulse" />
        </div>
        <p className="text-sm font-medium text-slate-300 tracking-wide">
          Verifying agricultural credentials...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
