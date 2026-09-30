import React from 'react';
import { FlaskConical, Beaker, Tag, Info } from 'lucide-react';

export const InputRecommendationTable = ({ inputs = [] }) => {
  if (!inputs || inputs.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
        <FlaskConical className="w-10 h-10 text-slate-300 mx-auto mb-2" />
        <p className="text-slate-500 text-sm">No chemical or commercial inputs recommended for this case.</p>
        <p className="text-xs text-slate-400 mt-1">Cultural controls and mechanical adjustments are favored.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Card Header */}
      <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">Recommended Agricultural Inputs</h3>
            <p className="text-xs text-slate-500 mt-0.5">Scientific dosages and targeted application instructions</p>
          </div>
        </div>
        <span className="text-xs bg-blue-50 text-blue-700 font-medium px-2.5 py-1 rounded-full border border-blue-200">
          {inputs.length} {inputs.length === 1 ? 'Input' : 'Inputs'} Specified
        </span>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
              <th className="py-3.5 px-6">Input / Product</th>
              <th className="py-3.5 px-6">Category</th>
              <th className="py-3.5 px-6">Dosage & Application Protocol</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {inputs.map((item, index) => (
              <tr key={index} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-4 px-6 font-semibold text-slate-900">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-agro-500 flex-shrink-0"></span>
                    <span>{item.input_name}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                    <Tag className="w-3 h-3 text-slate-500" />
                    {item.type || 'Treatment'}
                  </span>
                </td>
                <td className="py-4 px-6 text-slate-600 leading-relaxed max-w-md">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-agro-600 flex-shrink-0 mt-0.5" />
                    <span>{item.dosage_instructions}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View for On-Field Farmers */}
      <div className="md:hidden divide-y divide-slate-100 p-4 space-y-4">
        {inputs.map((item, index) => (
          <div key={index} className="pt-3 first:pt-0">
            <div className="flex items-center justify-between gap-2 mb-2">
              <h4 className="font-semibold text-slate-900 text-sm">{item.input_name}</h4>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                {item.type}
              </span>
            </div>
            <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-start gap-2">
              <Beaker className="w-4 h-4 text-agro-600 flex-shrink-0 mt-0.5" />
              <span>{item.dosage_instructions}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Cautious Agronomy Note */}
      <div className="p-4 bg-amber-50/50 border-t border-amber-100 text-xs text-amber-800 flex items-center gap-2">
        <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
        <span>Always perform a small jar compatibility test before tank-mixing chemicals and observe pre-harvest intervals (PHI).</span>
      </div>
    </div>
  );
};
