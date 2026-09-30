import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthForm } from '../components/AuthForm';
import { Sprout, ArrowLeft, Leaf } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleAuthSuccess = () => {
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between relative overflow-hidden text-slate-100">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-agro-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Top Bar */}
      <header className="px-6 py-6 max-w-7xl mx-auto w-full flex items-center justify-between z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Leaf className="w-3.5 h-3.5 text-agro-400" />
          <span>Secure Agronomy Portal</span>
        </div>
      </header>

      {/* Center Auth Card */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 z-10">
        <AuthForm onSuccess={handleAuthSuccess} />
      </div>

      {/* Bottom Footer Note */}
      <footer className="py-6 text-center text-xs text-slate-600 z-10">
        AgroAI • Enterprise Agricultural Knowledge & Precision Diagnostics
      </footer>
    </div>
  );
};
