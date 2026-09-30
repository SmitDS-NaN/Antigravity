import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../lib/api';
import { Layout } from '../components/Layout';
import { DiagnosticForm } from '../components/DiagnosticForm';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { Sprout, ArrowLeft, AlertCircle } from 'lucide-react';

export const AdvisoryRequestPage = () => {
  const { farmId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [farms, setFarms] = useState([]);
  const [loadingFarms, setLoadingFarms] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const res = await apiClient('/farms', {}, token);
        if (res?.data) {
          setFarms(res.data);
        }
      } catch (err) {
        console.error('[Error loading farms]:', err);
        setErrorMsg('Failed to load farm profiles. Please try refreshing.');
      } finally {
        setLoadingFarms(false);
      }
    };

    fetchFarms();
  }, [token]);

  const handleDiagnosticSubmit = async (formData) => {
    setSubmitting(true);
    setErrorMsg('');

    try {
      const response = await apiClient('/advisory', {
        method: 'POST',
        body: JSON.stringify(formData)
      }, token);

      if (response?.reportId) {
        navigate(`/advisory/${response.reportId}`);
      } else {
        throw new Error('Advisory report ID missing from server response.');
      }
    } catch (err) {
      console.error('[Advisory Request Error]:', err);
      setErrorMsg(err.message || 'Could not generate advisory report. Please try again.');
      setSubmitting(false);
    }
  };

  const currentFarm = farms.find(f => f.id === farmId);

  return (
    <Layout>
      {/* Loading Overlay with rotating agricultural messages */}
      <LoadingOverlay
        isVisible={submitting}
        subtitle={currentFarm ? `${currentFarm.name} (${currentFarm.crop_type})` : 'Farm Plot'}
      />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Breadcrumb Header */}
        <div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-agro-50 text-agro-700">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Crop Diagnostic Request</h1>
              <p className="text-xs text-slate-500">
                Input observable symptoms and field metrics for structured Gemini agronomic analysis
              </p>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Diagnostic Form */}
        {loadingFarms ? (
          <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center animate-pulse">
            <p className="text-sm text-slate-400">Loading farm profiles...</p>
          </div>
        ) : farms.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-dashed border-slate-300 text-center">
            <p className="text-sm font-semibold text-slate-700 mb-2">No farms found</p>
            <p className="text-xs text-slate-400 mb-4">Please register a farm plot before initiating an advisory request.</p>
            <Link
              to="/farms/new"
              className="px-4 py-2 bg-agro-600 text-white rounded-xl text-xs font-semibold"
            >
              Register Farm Now
            </Link>
          </div>
        ) : (
          <DiagnosticForm
            farms={farms}
            selectedFarmId={farmId}
            onSubmit={handleDiagnosticSubmit}
            isSubmitting={submitting}
          />
        )}
      </div>
    </Layout>
  );
};
