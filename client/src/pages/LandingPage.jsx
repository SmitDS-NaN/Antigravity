import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sprout, 
  BrainCircuit, 
  ShieldCheck, 
  Layers, 
  ArrowRight, 
  CheckCircle, 
  Activity, 
  Droplets, 
  SunMedium, 
  Sparkles,
  Smartphone,
  ShieldAlert
} from 'lucide-react';

export const LandingPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-900 text-white selection:bg-agro-500 selection:text-white">
      {/* Top Navbar */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-agro-500 to-emerald-400 flex items-center justify-center text-slate-950 font-bold shadow-glow-agro">
            <Sprout className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            AgroAI <span className="text-agro-400">Pro</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-agro-500 hover:bg-agro-400 text-slate-950 font-semibold text-sm transition-all shadow-glow-agro"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-agro-500 hover:bg-agro-400 text-slate-950 font-semibold text-sm transition-all shadow-glow-agro"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-20 text-center relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-agro-500/15 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-agro-950/80 border border-agro-700/60 text-agro-300 text-xs font-semibold mb-8 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Powered by Google Gemini 2.5 Flash & Supabase RLS</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
          AI-Powered Precision <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-agro-400 via-emerald-300 to-teal-300">
            Crop Diagnostics & Advisory
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          Democratizing expert agricultural intelligence. Analyze soil metrics, ambient weather, and visual plant symptoms to output structured, scientifically sound mitigation plans in seconds.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to={user ? "/dashboard" : "/login"}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-agro-500 to-emerald-400 hover:from-agro-400 hover:to-emerald-300 text-slate-950 font-bold text-base shadow-glow-agro hover:scale-[1.02] active:scale-[0.99] transition-all"
          >
            <span>{user ? "Open Field Dashboard" : "Start Free Crop Diagnostic"}</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <a
            href="#features"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-white font-medium text-base border border-slate-700 transition-all"
          >
            <span>Explore Agronomy Engine</span>
          </a>
        </div>

        {/* Live Metrics Proof */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-10 border-t border-slate-800">
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-white">4</p>
            <p className="text-xs text-slate-400 mt-1">Core Agronomy Domains</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-agro-400">100%</p>
            <p className="text-xs text-slate-400 mt-1">Strict JSON Schema Output</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-white">&lt; 3s</p>
            <p className="text-xs text-slate-400 mt-1">Real-time Inference</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-emerald-400">Field-Ready</p>
            <p className="text-xs text-slate-400 mt-1">Mobile Responsive UI</p>
          </div>
        </div>
      </section>

      {/* Target Domains Section */}
      <section id="features" className="py-20 bg-slate-950 border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Comprehensive Agronomic Domain Expertise
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-3">
              Engineered to replace ambiguous chat responses with rigorous, structured action checklists across four scientific domains.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Domain 1 */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-agro-500/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-red-950/60 border border-red-800/50 flex items-center justify-center text-red-400 mb-5">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Pest & Disease</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Identification and integrated management of bacterial, fungal, and insect threats with biological controls.
              </p>
            </div>

            {/* Domain 2 */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-agro-500/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-amber-950/60 border border-amber-800/50 flex items-center justify-center text-amber-400 mb-5">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Nutrient Management</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Detection of nitrogen, phosphorus, and micronutrient deficiencies with targeted dosage protocols.
              </p>
            </div>

            {/* Domain 3 */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-agro-500/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-blue-950/60 border border-blue-800/50 flex items-center justify-center text-blue-400 mb-5">
                <Droplets className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Water & Irrigation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Mitigation for hypoxic waterlogged soil and extreme drought stress with localized moisture balancing.
              </p>
            </div>

            {/* Domain 4 */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-agro-500/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950/60 border border-emerald-800/50 flex items-center justify-center text-emerald-400 mb-5">
                <Sprout className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">General Agronomy</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Plant canopy spacing, field sanitation, crop rotation sequences, and soil stewardship.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Structured Output Preview Section */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <div className="bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-3xl p-8 sm:p-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-agro-500/10 border border-agro-500/30 text-agro-400 text-xs font-semibold mb-4">
                <BrainCircuit className="w-4 h-4" />
                <span>Zero Hallucination Schema</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold text-white leading-tight">
                Not a Generic Chatbot. <br />
                A True Field Action Plan.
              </h2>
              <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
                Farmers in the field need clear, decisive instructions. AgroAI enforces structured schema outputs with 24-48 hour immediate mitigations, preventive rotation tactics, and precise chemical dosage rates.
              </p>
              
              <ul className="mt-6 space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-agro-400 flex-shrink-0" />
                  <span>Immediate 24-48 hour containment checklist</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-agro-400 flex-shrink-0" />
                  <span>Long-term preventive crop rotation & soil strategies</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-agro-400 flex-shrink-0" />
                  <span>Exact inputs with organic and IPM-certified dosages</span>
                </li>
              </ul>
            </div>

            {/* Mock Report Card */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-lg text-left text-xs font-mono space-y-3 text-slate-300">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-[11px]">
                <span className="text-agro-400 font-bold">DIAGNOSIS_OUTPUT.JSON</span>
                <span className="px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 font-semibold">
                  THREAT: HIGH
                </span>
              </div>
              <p className="text-white font-bold text-sm">
                Early Blight (Alternaria solani) & Chlorosis
              </p>
              <div className="space-y-1.5 pt-2 text-slate-400">
                <p className="text-agro-300 font-semibold">// Immediate 24-48h Actions:</p>
                <p>1. Prune and bag lower foliage showing target spot lesions.</p>
                <p>2. Dig relief furrows to alleviate root waterlogging.</p>
              </div>
              <div className="space-y-1.5 pt-2 text-slate-400">
                <p className="text-blue-300 font-semibold">// Recommended Input:</p>
                <p>Product: Copper Hydroxide (Fungicide / Organic)</p>
                <p>Rate: 2.5 kg/ha in 500L water applied at dawn.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 text-center text-xs text-slate-500">
        <p>© 2026 AgroAI Assistant. Built with Google Gemini AI & Supabase PostgreSQL.</p>
      </footer>
    </div>
  );
};
