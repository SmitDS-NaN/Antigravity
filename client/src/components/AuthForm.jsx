import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sprout, Mail, Lock, User, ArrowRight, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

export const AuthForm = ({ onSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, register, loginAsDemo, isConfigured } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    try {
      if (isRegister) {
        if (!fullName.trim()) {
          throw new Error('Please enter your full name or title.');
        }
        await register(email, password, fullName);
      } else {
        await login(email, password);
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('[Auth Error]:', err);
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoClick = () => {
    loginAsDemo();
    if (onSuccess) onSuccess();
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl p-8 relative overflow-hidden">
      {/* Decorative top header glow */}
      <div className="absolute -top-16 -right-16 w-36 h-36 bg-agro-200/40 rounded-full blur-2xl pointer-events-none"></div>

      {/* Brand Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-agro-600 to-agro-400 text-white shadow-md mb-3">
          <Sprout className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          {isRegister ? 'Join AgroAI Network' : 'Welcome Back'}
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          {isRegister 
            ? 'Create your agronomy profile to diagnose and track field plots' 
            : 'Sign in to access your farm diagnostics and AI crop advisories'}
        </p>
      </div>

      {/* Error alert */}
      {errorMsg && (
        <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegister && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name / Title <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dr. Evelyn Vance"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-agro-500 focus:border-agro-500"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="agronomist@farm.org"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-agro-500 focus:border-agro-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-agro-500 focus:border-agro-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 px-4 rounded-xl bg-agro-600 hover:bg-agro-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
        >
          <span>{submitting ? 'Authenticating...' : isRegister ? 'Create Account' : 'Sign In'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-6 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200"></div>
        </div>
        <span className="relative bg-white px-3 text-xs text-slate-400">or evaluate instantly</span>
      </div>

      {/* One-Click Demo Mode button */}
      <button
        type="button"
        onClick={handleDemoClick}
        className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium text-xs flex items-center justify-center gap-2 transition-colors"
      >
        <Sparkles className="w-4 h-4 text-agro-600" />
        <span>One-Click Agronomist Demo Sign In</span>
      </button>

      {/* Toggle between Login and Register */}
      <div className="mt-6 text-center text-xs text-slate-500">
        {isRegister ? (
          <p>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => { setIsRegister(false); setErrorMsg(''); }}
              className="font-semibold text-agro-600 hover:underline"
            >
              Sign In
            </button>
          </p>
        ) : (
          <p>
            Don't have an agronomy account?{' '}
            <button
              type="button"
              onClick={() => { setIsRegister(true); setErrorMsg(''); }}
              className="font-semibold text-agro-600 hover:underline"
            >
              Register here
            </button>
          </p>
        )}
      </div>
    </div>
  );
};
