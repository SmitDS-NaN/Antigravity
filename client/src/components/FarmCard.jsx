import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, MapPin, Layers, ArrowRight, Activity } from 'lucide-react';

export const FarmCard = ({ farm }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 p-6 flex flex-col justify-between group hover:border-agro-300">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="p-3 rounded-xl bg-agro-50 text-agro-700 group-hover:bg-agro-600 group-hover:text-white transition-colors duration-200">
            <Sprout className="w-6 h-6" />
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
            Plot Active
          </span>
        </div>

        {/* Farm Name & Primary Crop */}
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-agro-700 transition-colors">
          {farm.name}
        </h3>
        <p className="text-sm font-semibold text-agro-600 mt-0.5">
          {farm.crop_type}
        </p>

        {/* Metadata Details */}
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span className="text-slate-400">Soil:</span>
            <span className="font-medium text-slate-700">{farm.soil_type || 'Loamy Soil'}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span className="text-slate-400">Region:</span>
            <span className="font-medium text-slate-700 truncate">{farm.region || 'Standard Zone'}</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <Link
          to={`/advisory/request/${farm.id}`}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-agro-600 text-white text-xs font-semibold hover:bg-agro-700 shadow-sm hover:shadow active:scale-[0.99] transition-all"
        >
          <Activity className="w-4 h-4" />
          <span>New Advisory</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
