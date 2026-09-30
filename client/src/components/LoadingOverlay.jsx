import React, { useState, useEffect } from 'react';
import { Sprout, BrainCircuit, Droplets, Sun, Wind, ShieldAlert } from 'lucide-react';

const MESSAGES = [
  { text: "Analyzing soil moisture and environmental metrics...", icon: Droplets },
  { text: "Consulting Gemini Agricultural Diagnostic Models...", icon: BrainCircuit },
  { text: "Evaluating foliar symptoms and pathological vectors...", icon: Sprout },
  { text: "Cross-referencing integrated pest management protocols...", icon: ShieldAlert },
  { text: "Calculating optimal dosage rates and immediate mitigation steps...", icon: Sun },
  { text: "Synthesizing localized scientific crop advisory...", icon: Wind }
];

export const LoadingOverlay = ({ isVisible, subtitle }) => {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % MESSAGES.length);
    }, 2400);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  const currentStep = MESSAGES[currentIdx];
  const StepIcon = currentStep.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md transition-opacity">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl border border-agro-100 text-center relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-agro-400/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Dynamic Graphic Icon */}
        <div className="relative mx-auto w-24 h-24 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-agro-100 border-t-agro-600 animate-spin"></div>
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-agro-600 to-emerald-400 flex items-center justify-center text-white shadow-lg animate-pulse">
            <StepIcon className="w-8 h-8 transition-all duration-300" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          Generating AI Crop Advisory
        </h3>

        {/* Dynamic rotating message */}
        <div className="h-12 flex items-center justify-center">
          <p className="text-sm font-medium text-agro-700 animate-fadeIn transition-opacity duration-300">
            {currentStep.text}
          </p>
        </div>

        {/* Subtitle or context */}
        {subtitle && (
          <p className="text-xs text-slate-400 mt-2">
            Targeting: <span className="font-semibold text-slate-600">{subtitle}</span>
          </p>
        )}

        {/* Progress bar animation */}
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-6">
          <div className="bg-gradient-to-r from-agro-500 to-emerald-400 h-full rounded-full animate-indeterminate"></div>
        </div>
      </div>
    </div>
  );
};
