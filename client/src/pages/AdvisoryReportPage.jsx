import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../lib/api';
import { Layout } from '../components/Layout';
import { ReportBadge } from '../components/ReportBadge';
import { ActionList } from '../components/ActionList';
import { InputRecommendationTable } from '../components/InputRecommendationTable';
import { 
  Sprout, 
  ArrowLeft, 
  Printer, 
  Calendar, 
  MapPin, 
  Layers, 
  CloudSun, 
  Droplets, 
  AlertOctagon, 
  FileText,
  Activity,
  PlusCircle,
  Share2
} from 'lucide-react';

export const AdvisoryReportPage = () => {
  const { reportId } = useParams();
  const { token } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await apiClient(`/advisory/${reportId}`, {}, token);
        if (response?.data) {
          setReport(response.data);
        } else {
          throw new Error('Report data not found');
        }
      } catch (err) {
        console.error('[Error fetching advisory report]:', err);
        setError(err.message || 'Failed to load advisory report.');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportId, token]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white rounded-3xl p-12 border border-slate-200 animate-pulse text-center">
            <p className="text-sm font-semibold text-slate-500">Formatting agronomic advisory report...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !report) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-4">
          <AlertOctagon className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Advisory Report Unavailable</h2>
          <p className="text-xs text-slate-500">{error || 'This report does not exist or has been removed.'}</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </Layout>
    );
  }

  const threat = report.threat_level || 'Medium';

  // Dynamic banner colors based on threat level
  const threatBannerStyles = {
    Low: 'from-emerald-900/90 via-emerald-800 to-teal-900 border-emerald-700/50',
    Medium: 'from-amber-950/90 via-amber-900 to-stone-900 border-amber-700/50',
    High: 'from-orange-950/95 via-orange-900 to-stone-900 border-orange-700/50',
    Critical: 'from-red-950 via-red-900 to-slate-950 border-red-700/60'
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8 print:p-0">
        {/* Navigation & Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-colors"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Print / Export PDF</span>
            </button>
            <Link
              to={report.farm ? `/advisory/request/${report.farm.id}` : '/farms/new'}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-agro-600 hover:bg-agro-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Diagnostic</span>
            </Link>
          </div>
        </div>

        {/* Hero Report Diagnosis Card (Theme dynamic by Threat Level) */}
        <div className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-tr ${threatBannerStyles[threat] || threatBannerStyles.Medium} border text-white shadow-xl relative overflow-hidden`}>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase font-mono tracking-widest text-slate-300">
                Official Agronomic Advisory Report
              </span>
            </div>
            <ReportBadge level={threat} size="lg" />
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-4">
            {report.diagnosis_title}
          </h1>

          {/* Farm and timestamp bar */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-4 border-t border-white/10">
            <span className="flex items-center gap-1.5 font-medium text-white">
              <Sprout className="w-4 h-4 text-agro-400" />
              {report.farm?.name || 'Farm Plot'} • {report.farm?.crop_type || 'Crop'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-400" />
              {report.farm?.region || 'Standard Agricultural Belt'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              {new Date(report.created_at).toLocaleDateString()} at {new Date(report.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {/* Observation Parameters Grounding Grid */}
        {report.request && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              Diagnostic Field Observations Grounding
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[11px] text-slate-400 font-medium">Crop Stage</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{report.request.crop_stage}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[11px] text-slate-400 font-medium">Ambient Weather</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{report.request.weather_condition}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[11px] text-slate-400 font-medium">Soil Moisture</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{report.request.soil_moisture}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[11px] text-slate-400 font-medium">Soil Type</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{report.farm?.soil_type || 'Loamy'}</p>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
              <div>
                <span className="font-semibold text-slate-700">Observed Symptoms: </span>
                <span className="text-slate-600">"{report.request.symptoms}"</span>
              </div>
              {report.request.recent_treatments && (
                <div>
                  <span className="font-semibold text-slate-700">Recent Applications: </span>
                  <span className="text-slate-600">"{report.request.recent_treatments}"</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step-by-Step Action Plan */}
        <div className="space-y-6">
          <ActionList
            title="Immediate Containment & Remediation Actions"
            subtitle="Prioritized intervention protocol to execute within 24 to 48 hours"
            actions={report.immediate_actions}
            type="immediate"
            threatLevel={threat}
          />

          <ActionList
            title="Long-Term Preventative & Agronomic Stewardship"
            subtitle="Cultural practices, crop rotation sequences, and soil microbiome resilience"
            actions={report.preventative_measures}
            type="preventative"
            threatLevel={threat}
          />

          <InputRecommendationTable
            inputs={report.recommended_inputs}
          />
        </div>

        {/* Legal Extension Disclaimer */}
        <div className="p-5 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-500 leading-relaxed text-center">
          <p className="font-semibold text-slate-700 mb-1">Official Agronomy Advisory Notice</p>
          Recommendations generated by AgroAI are grounded in scientifically verified agronomic principles and integrated pest management (IPM) guidelines. Always consult your regional agricultural extension agent or certified crop advisor before large-scale application of restricted agrochemicals.
        </div>
      </div>
    </Layout>
  );
};
