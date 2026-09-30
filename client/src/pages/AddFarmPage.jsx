import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../lib/api';
import { Layout } from '../components/Layout';
import { FarmSchema, SOIL_TYPES } from '../schemas/zodSchemas';
import { Sprout, MapPin, Layers, ArrowLeft, PlusCircle, AlertCircle, Check } from 'lucide-react';

export const AddFarmPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(FarmSchema),
    defaultValues: {
      name: '',
      crop_type: '',
      soil_type: 'Loamy',
      region: ''
    }
  });

  const selectedSoil = watch('soil_type');

  const onSubmit = async (data) => {
    setSubmitting(true);
    setServerError('');
    try {
      await apiClient('/farms', {
        method: 'POST',
        body: JSON.stringify(data)
      }, token);

      navigate('/dashboard');
    } catch (err) {
      console.error('[Add Farm Error]:', err);
      setServerError(err.message || 'Failed to create farm profile.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Top Breadcrumb */}
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
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Register New Farm Plot</h1>
              <p className="text-xs text-slate-500">Record baseline soil classification and primary crop parameters</p>
            </div>
          </div>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Registration Form Card */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
          {/* Plot Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Farm or Plot Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. North Acre Tomato Field, Sunrise Orchard Plot 2"
              {...register('name')}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-agro-500 focus:border-agro-500 shadow-sm"
            />
            {errors.name && (
              <p className="text-xs text-red-600 mt-1 font-medium">{errors.name.message}</p>
            )}
          </div>

          {/* Primary Crop */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Primary Crop Type <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Tomato (Roma), Sweet Corn, Soybean, Wheat"
              {...register('crop_type')}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-agro-500 focus:border-agro-500 shadow-sm"
            />
            {errors.crop_type && (
              <p className="text-xs text-red-600 mt-1 font-medium">{errors.crop_type.message}</p>
            )}
          </div>

          {/* Soil Classification */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Soil Classification Baseline <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-slate-400 mb-3">Determines water retention curve and cation exchange capacity</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {SOIL_TYPES.map((soil) => {
                const isSelected = selectedSoil === soil;
                return (
                  <button
                    type="button"
                    key={soil}
                    onClick={() => setValue('soil_type', soil, { shouldValidate: true })}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-all ${
                      isSelected
                        ? 'border-agro-600 bg-agro-50 text-agro-900 ring-2 ring-agro-500/20 shadow-sm font-semibold'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <span>{soil}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-agro-600" />}
                  </button>
                );
              })}
            </div>
            {errors.soil_type && (
              <p className="text-xs text-red-600 mt-1 font-medium">{errors.soil_type.message}</p>
            )}
          </div>

          {/* Region */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Geographical Region / Climate Belt <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. Central Valley, North Plains River Basin"
                {...register('region')}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-agro-500 focus:border-agro-500 shadow-sm"
              />
            </div>
            {errors.region && (
              <p className="text-xs text-red-600 mt-1 font-medium">{errors.region.message}</p>
            )}
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link
              to="/dashboard"
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-agro-600 hover:bg-agro-700 text-white font-semibold text-xs shadow-sm hover:shadow transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{submitting ? 'Registering...' : 'Save Farm Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};
