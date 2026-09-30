import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sprout, 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  LogOut, 
  Menu, 
  X, 
  Sparkles, 
  ShieldCheck, 
  Leaf,
  ChevronRight
} from 'lucide-react';

export const Layout = ({ children }) => {
  const { user, logout, isConfigured } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Register Farm', path: '/farms/new', icon: PlusCircle },
    { name: 'Advisory History', path: '/history', icon: History },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Top App Bar */}
      <header className="md:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-agro-500 flex items-center justify-center text-white">
            <Sprout className="w-5 h-5" />
          </div>
          <span className="font-bold text-base tracking-tight text-white">AgroAI</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 text-white w-4/5 max-w-xs h-full p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-agro-500 flex items-center justify-center text-white">
                    <Sprout className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-base leading-tight">AgroAI Assistant</h2>
                    <p className="text-xs text-slate-400">Gemini Agronomy</p>
                  </div>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Nav Links */}
              <nav className="mt-6 space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        active 
                          ? 'bg-agro-600 text-white shadow-sm' 
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Mobile User Profile Footer */}
            <div className="pt-6 border-t border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-agro-700/60 border border-agro-500/40 flex items-center justify-center text-white font-bold text-sm">
                  {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'A'}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold text-white truncate">
                    {user?.user_metadata?.full_name || 'Agronomist'}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 text-red-400 hover:bg-slate-700 hover:text-red-300 text-xs font-semibold transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col justify-between w-64 lg:w-72 bg-slate-900 text-white p-6 border-r border-slate-800 min-h-screen sticky top-0">
        <div>
          {/* Brand Logo */}
          <Link to="/dashboard" className="flex items-center gap-3 mb-8 px-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-agro-600 to-agro-400 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white leading-tight">
                AgroAI <span className="text-agro-400">Pro</span>
              </h1>
              <p className="text-xs text-slate-400 font-medium">Crop Advisory Assistant</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                    active 
                      ? 'bg-agro-600 text-white shadow-md' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </div>
                  {active && <ChevronRight className="w-4 h-4 text-agro-200" />}
                </Link>
              );
            })}
          </nav>

          {/* Quick Engine Status Card */}
          <div className="mt-8 p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-xs">
            <div className="flex items-center gap-2 text-agro-400 font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gemini Agronomy AI</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Active diagnostic engine running structured agronomy analysis models.
            </p>
          </div>
        </div>

        {/* User Account & Logout */}
        <div className="pt-6 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-agro-800/80 border border-agro-600/40 flex items-center justify-center text-white font-bold text-sm shadow">
              {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'A'}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-semibold text-white truncate">
                {user?.user_metadata?.full_name || 'Agronomist Officer'}
              </p>
              <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-red-950/40 text-slate-300 hover:text-red-300 border border-slate-700 hover:border-red-900/50 text-xs font-medium transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Notification / Context Strip */}
        <div className="bg-white border-b border-slate-200/80 px-6 py-2.5 hidden sm:flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Leaf className="w-3.5 h-3.5 text-agro-600" />
            <span>Field Intelligence Network</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className={`w-2 h-2 rounded-full ${isConfigured ? 'bg-emerald-500' : 'bg-amber-400'}`}></span>
              <span>{isConfigured ? 'Supabase Database Connected' : 'Sandbox Evaluation Active'}</span>
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
};
