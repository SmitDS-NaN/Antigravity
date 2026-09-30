import React, { useState } from 'react';
import { CheckCircle2, Circle, Clock, ShieldCheck, Sparkles } from 'lucide-react';

export const ActionList = ({ 
  title, 
  subtitle, 
  actions = [], 
  type = 'immediate',
  threatLevel = 'Medium' 
}) => {
  const [completed, setCompleted] = useState({});

  const toggleAction = (idx) => {
    setCompleted(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const isImmediate = type === 'immediate';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
      {/* Header */}
      <div className={`p-5 border-b flex items-center justify-between ${
        isImmediate 
          ? 'bg-gradient-to-r from-red-50/70 to-amber-50/40 border-amber-100' 
          : 'bg-gradient-to-r from-emerald-50/70 to-teal-50/40 border-emerald-100'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${
            isImmediate ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
          }`}>
            {isImmediate ? <Clock className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">{title}</h3>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
        </div>

        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
          isImmediate ? 'bg-red-100/80 text-red-800' : 'bg-emerald-100/80 text-emerald-800'
        }`}>
          {isImmediate ? '⚡ Within 24-48 Hours' : '🌱 Long-Term Stewardship'}
        </span>
      </div>

      {/* Checklist items */}
      <div className="p-5 space-y-3">
        {actions.length === 0 ? (
          <p className="text-sm text-slate-400 italic">No specific actions designated.</p>
        ) : (
          actions.map((action, idx) => {
            const isDone = Boolean(completed[idx]);
            return (
              <div
                key={idx}
                onClick={() => toggleAction(idx)}
                className={`group flex items-start gap-3.5 p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isDone 
                    ? 'bg-slate-50 border-slate-200 text-slate-400' 
                    : 'bg-white border-slate-100 hover:border-agro-200 hover:bg-agro-50/20 text-slate-700 shadow-sm'
                }`}
              >
                <button
                  type="button"
                  className="mt-0.5 flex-shrink-0 focus:outline-none"
                  aria-label="Toggle task status"
                >
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 transition-transform scale-110" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 group-hover:text-agro-500 transition-colors" />
                  )}
                </button>
                <div className="flex-1 text-sm leading-relaxed">
                  <span className={isDone ? 'line-through decoration-slate-300' : 'font-medium'}>
                    {action}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      {/* Progress Footer */}
      {actions.length > 0 && (
        <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
          <span>Click any action item to mark it completed in the field.</span>
          <span className="font-semibold text-slate-600">
            {Object.values(completed).filter(Boolean).length} / {actions.length} Completed
          </span>
        </div>
      )}
    </div>
  );
};
