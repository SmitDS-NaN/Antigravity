import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../lib/api';
import { Layout } from '../components/Layout';
import { ReportBadge } from '../components/ReportBadge';
import { 
  History, 
  Search, 
  Filter, 
  Calendar, 
  Sprout, 
  ArrowRight, 
  PlusCircle, 
  CloudSun,
  FileText
} from 'lucide-react';

export const HistoryPage = () => {
  const { token } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedThreat, setSelectedThreat] = useState('All');

  const fetchHistory = async () => {
    setLoading(true);
    try {
      let endpoint = '/history';
      const params = new URLSearchParams();
      if (searchQuery) params.append('query', searchQuery);
      if (selectedThreat !== 'All') params.append('threat', selectedThreat);
      
      const queryString = params.toString();
      if (queryString) endpoint += `?${queryString}`;

      const res = await apiClient(endpoint, {}, token);
      if (res?.data) {
        setHistory(res.data);
      }
    } catch (err) {
      console.error('[Error loading history]:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [token, selectedThreat]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchHistory();
  };

  const threatFilters = ['All', 'Critical', 'High', 'Medium', 'Low'];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-agro-50 text-agro-700">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Advisory History Log</h1>
              <p className="text-xs text-slate-500">Historical archive of diagnostic assessments and crop treatment plans</p>
            </div>
          </div>

          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4 text-agro-400" />
            <span>New Advisory</span>
          </Link>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search diagnosis, crop, or plot..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-agro-500 focus:border-agro-500"
            />
          </form>

          {/* Threat Level Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <span className="text-xs text-slate-400 font-semibold mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Threat:</span>
            </span>
            {threatFilters.map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedThreat(lvl)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  selectedThreat === lvl
                    ? 'bg-agro-600 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* History List */}
        {loading ? (
          <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center animate-pulse">
            <p className="text-xs text-slate-400">Loading historical timeline...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center">
            <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No Advisory Reports Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {searchQuery || selectedThreat !== 'All' 
                ? 'Try adjusting your search criteria or threat level filter.'
                : 'Diagnose your first farm plot to build an agronomy tracking history.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <Link
                key={item.id}
                to={`/advisory/${item.id}`}
                className="block bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-agro-300 transition-all group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5">
                      <ReportBadge level={item.threat_level} size="sm" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-agro-700 transition-colors">
                        {item.diagnosis_title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="font-semibold text-slate-700 flex items-center gap-1">
                          <Sprout className="w-3.5 h-3.5 text-agro-600" />
                          {item.farm_name} ({item.crop_type})
                        </span>
                        <span>•</span>
                        <span>Stage: {item.crop_stage}</span>
                        <span>•</span>
                        <span>Weather: {item.weather_condition}</span>
                      </div>
                      {item.symptoms && (
                        <p className="text-xs text-slate-400 mt-2 line-clamp-1 italic">
                          "{item.symptoms}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400 self-end sm:self-center">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                    <div className="p-2 rounded-xl bg-slate-50 group-hover:bg-agro-50 text-slate-400 group-hover:text-agro-700 transition-colors">
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};
