import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../lib/api';
import { Layout } from '../components/Layout';
import { FarmCard } from '../components/FarmCard';
import { ReportBadge } from '../components/ReportBadge';
import { 
  Sprout, 
  PlusCircle, 
  Activity, 
  History, 
  ArrowRight, 
  AlertTriangle, 
  Layers, 
  Calendar,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

export const DashboardPage = () => {
  const { user, token } = useAuth();
  const [farms, setFarms] = useState([]);
  const [recentHistory, setRecentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [farmsRes, historyRes] = await Promise.all([
        apiClient('/farms', {}, token),
        apiClient('/history', {}, token)
      ]);

      if (farmsRes?.data) setFarms(farmsRes.data);
      if (historyRes?.data) setRecentHistory(historyRes.data.slice(0, 5));
    } catch (err) {
      console.error('[Dashboard fetch error]:', err);
      setError(err.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [token]);

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome & Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-agro-50 text-agro-700 text-xs font-semibold mb-2">
              <Sprout className="w-3.5 h-3.5" />
              <span>Field Diagnostics Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Hello, {user?.user_metadata?.full_name || 'Agronomist'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Monitor parcel health, detect pathological vectors, and dispatch AI mitigation advisories.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchDashboardData}
              className="p-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
              title="Refresh Dashboard"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <Link
              to="/farms/new"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4 text-agro-400" />
              <span>Register Plot</span>
            </Link>
          </div>
        </div>

        {/* High-Level Field Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-agro-50 text-agro-600 flex items-center justify-center">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Registered Farms</p>
              <p className="text-2xl font-bold text-slate-900">{farms.length}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Advisories Run</p>
              <p className="text-2xl font-bold text-slate-900">{recentHistory.length}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Status</p>
              <p className="text-sm font-bold text-slate-900 mt-1">Active Scouting</p>
            </div>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-3">
            <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Registered Farms Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Your Registered Farm Profiles</h2>
              <p className="text-xs text-slate-500">Select a plot to run diagnostics or record crop status</p>
            </div>
            {farms.length > 0 && (
              <span className="text-xs text-slate-500 font-medium">
                Showing {farms.length} {farms.length === 1 ? 'plot' : 'plots'}
              </span>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse h-56"></div>
              ))}
            </div>
          ) : farms.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-agro-50 text-agro-600 flex items-center justify-center mx-auto mb-4">
                <Sprout className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">No Farm Plots Registered Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                Register your first farm plot with soil characteristics and primary crop to begin running precision AI diagnostics.
              </p>
              <Link
                to="/farms/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-agro-600 text-white font-semibold text-xs shadow-sm hover:bg-agro-700 transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Register First Farm</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {farms.map((farm) => (
                <FarmCard key={farm.id} farm={farm} />
              ))}
            </div>
          )}
        </div>

        {/* Recent Advisories Timeline Snippet */}
        {recentHistory.length > 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Recent Field Advisories</h3>
                  <p className="text-xs text-slate-500">Historical timeline of generated mitigation reports</p>
                </div>
              </div>
              <Link
                to="/history"
                className="text-xs font-semibold text-agro-600 hover:text-agro-700 flex items-center gap-1"
              >
                <span>View All History</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {recentHistory.map((item) => (
                <Link
                  key={item.id}
                  to={`/advisory/${item.id}`}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 px-2 rounded-xl transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <ReportBadge level={item.threat_level} size="sm" />
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 group-hover:text-agro-700 transition-colors">
                        {item.diagnosis_title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {item.farm_name} • {item.crop_type} ({item.crop_stage})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 group-hover:text-agro-600 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
