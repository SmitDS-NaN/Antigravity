import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AdvisoryRequestSchema, CROP_STAGES, WEATHER_CONDITIONS, SOIL_MOISTURE_LEVELS } from '../schemas/zodSchemas';
import { 
  Sprout, 
  CloudSun, 
  Droplets, 
  FileText, 
  Sparkles, 
  ShieldAlert, 
  Pill, 
  Sun, 
  CloudRain, 
  Cloud, 
  Flame, 
  Snowflake,
  CheckCircle2
} from 'lucide-react';

const weatherIcons = {
  Sunny: Sun,
  Rainy: CloudRain,
  Overcast: Cloud,
  Drought: Flame,
  Frost: Snowflake,
};

export const DiagnosticForm = ({ farms = [], selectedFarmId, onSubmit, isSubmitting }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(AdvisoryRequestSchema),
    defaultValues: {
      farm_id: selectedFarmId || (farms.length > 0 ? farms[0].id : ''),
      crop_stage: 'Vegetative',
      weather_condition: 'Sunny',
      soil_moisture: 'Optimal',
      symptoms: '',
      recent_treatments: ''
    }
  });

  const selectedCropStage = watch('crop_stage');
  const selectedWeather = watch('weather_condition');
  const selectedMoisture = watch('soil_moisture');

  const selectedFarm = farms.find(f => f.id === watch('farm_id'));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* 1. Target Farm Selection */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-agro-50 text-agro-700">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">Select Target Farm / Plot</h3>
            <p className="text-xs text-slate-500">Choose the registered parcel experiencing crop distress</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Farm Profile <span className="text-red-500">*</span>
            </label>
            <select
              {...register('farm_id')}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-agro-500 focus:border-agro-500 shadow-sm"
            >
              {farms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} — ({f.crop_type})
                </option>
              ))}
            </select>
            {errors.farm_id && (
              <p className="text-xs text-red-600 mt-1 font-medium">{errors.farm_id.message}</p>
            )}
          </div>

          {selectedFarm && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1 text-slate-600">
              <p><span className="font-semibold text-slate-700">Primary Crop:</span> {selectedFarm.crop_type}</p>
              <p><span className="font-semibold text-slate-700">Soil Baseline:</span> {selectedFarm.soil_type || 'Loamy'}</p>
              <p><span className="font-semibold text-slate-700">Region:</span> {selectedFarm.region || 'Standard'}</p>
            </div>
          )}
        </div>
      </div>

      {/* 2. Phenological Growth Stage */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <label className="block text-sm font-semibold text-slate-900 mb-1">
          Current Crop Growth Stage <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-slate-500 mb-4">
          Biological phase informs pesticide tolerance and nutrient uptake curves
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {CROP_STAGES.map((stage) => {
            const isSelected = selectedCropStage === stage;
            return (
              <button
                type="button"
                key={stage}
                onClick={() => setValue('crop_stage', stage, { shouldValidate: true })}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all ${
                  isSelected 
                    ? 'border-agro-600 bg-agro-50 text-agro-800 ring-2 ring-agro-500/20 shadow-sm font-semibold' 
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <div className={`w-8 h-8 rounded-full mb-1.5 flex items-center justify-center ${
                  isSelected ? 'bg-agro-600 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  <Sprout className="w-4 h-4" />
                </div>
                <span>{stage}</span>
              </button>
            );
          })}
        </div>
        {errors.crop_stage && (
          <p className="text-xs text-red-600 mt-2 font-medium">{errors.crop_stage.message}</p>
        )}
      </div>

      {/* 3. Environmental Conditions (Weather & Soil Moisture) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-1">
            Current Field Weather Condition <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-slate-500 mb-3">Weather drives fungal spore dispersion and evapotranspiration</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {WEATHER_CONDITIONS.map((cond) => {
              const isSelected = selectedWeather === cond;
              const Icon = weatherIcons[cond] || CloudSun;
              return (
                <button
                  type="button"
                  key={cond}
                  onClick={() => setValue('weather_condition', cond, { shouldValidate: true })}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-medium transition-all ${
                    isSelected 
                      ? 'border-agro-600 bg-agro-50 text-agro-900 ring-2 ring-agro-500/20 shadow-sm font-semibold' 
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-agro-600' : 'text-slate-400'}`} />
                  <span>{cond}</span>
                </button>
              );
            })}
          </div>
          {errors.weather_condition && (
            <p className="text-xs text-red-600 mt-1 font-medium">{errors.weather_condition.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-1">
            Soil Moisture Status <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-slate-500 mb-3">Evaluates root aeration, hypoxic stress, or drought wilting</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SOIL_MOISTURE_LEVELS.map((moisture) => {
              const isSelected = selectedMoisture === moisture;
              return (
                <button
                  type="button"
                  key={moisture}
                  onClick={() => setValue('soil_moisture', moisture, { shouldValidate: true })}
                  className={`flex items-center justify-between p-3.5 rounded-xl border text-xs font-medium transition-all ${
                    isSelected 
                      ? 'border-agro-600 bg-agro-50 text-agro-900 ring-2 ring-agro-500/20 shadow-sm font-semibold' 
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Droplets className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span>{moisture}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-agro-600" />}
                </button>
              );
            })}
          </div>
          {errors.soil_moisture && (
            <p className="text-xs text-red-600 mt-1 font-medium">{errors.soil_moisture.message}</p>
          )}
        </div>
      </div>

      {/* 4. Visible Symptoms & Recent Treatments */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-agro-600" />
              <span>Visible Crop Symptoms & Field Anomalies</span>
              <span className="text-red-500">*</span>
            </label>
            <span className="text-[11px] text-slate-400">Min 5 characters</span>
          </div>
          <p className="text-xs text-slate-500 mb-2">
            Describe leaf discoloration, lesions, stem lesions, wilting patterns, or insect feeding signs.
          </p>
          <textarea
            {...register('symptoms')}
            rows={4}
            placeholder="e.g. Lower leaves showing concentric brown spots with yellow halos. Leaf margins curling upwards and slight stem discolouration near the soil line."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-agro-500 focus:border-agro-500 shadow-sm"
          ></textarea>
          {errors.symptoms && (
            <p className="text-xs text-red-600 mt-1 font-medium">{errors.symptoms.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-1.5">
            <Pill className="w-4 h-4 text-slate-500" />
            <span>Recent Treatments / Fertilizers / Agrochemicals (Optional)</span>
          </label>
          <p className="text-xs text-slate-500 mb-2">
            List any sprays, nitrogen doses, or soil drenches applied in the past 14 days.
          </p>
          <textarea
            {...register('recent_treatments')}
            rows={2}
            placeholder="e.g. Applied 20-20-20 NPK foliar spray 5 days ago; no chemical fungicide applied yet this season."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-agro-500 focus:border-agro-500 shadow-sm"
          ></textarea>
        </div>
      </div>

      {/* Submit CTA */}
      <div className="flex items-center justify-end gap-4 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-agro-600 to-emerald-600 hover:from-agro-700 hover:to-emerald-700 text-white font-semibold text-sm shadow-md hover:shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4 text-agro-200" />
          <span>{isSubmitting ? 'Consulting Gemini AI...' : 'Generate Expert Advisory Report'}</span>
        </button>
      </div>
    </form>
  );
};
