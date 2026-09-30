import { z } from 'zod';

export const CROP_STAGES = ['Seedling', 'Vegetative', 'Flowering', 'Fruiting', 'Harvest'];
export const WEATHER_CONDITIONS = ['Sunny', 'Rainy', 'Overcast', 'Drought', 'Frost'];
export const SOIL_MOISTURE_LEVELS = ['Dry', 'Optimal', 'Waterlogged'];
export const THREAT_LEVELS = ['Low', 'Medium', 'High', 'Critical'];
export const AGRICULTURAL_DOMAINS = [
  'Pest & Disease Management',
  'Nutrient Management',
  'Water & Irrigation',
  'General Agronomy'
];

export const FarmSchema = z.object({
  name: z.string().trim().min(2, 'Farm/Plot name must be at least 2 characters').max(100, 'Farm/Plot name cannot exceed 100 characters'),
  crop_type: z.string().trim().min(2, 'Primary crop type is required').max(100),
  soil_type: z.string().trim().max(50).optional().default('Loamy'),
  region: z.string().trim().max(100).optional().default('General Agricultural Region')
});

export const AdvisoryRequestSchema = z.object({
  farm_id: z.string().min(1, 'Farm ID is required'),
  crop_stage: z.enum(CROP_STAGES, {
    errorMap: () => ({ message: `Crop stage must be one of: ${CROP_STAGES.join(', ')}` })
  }),
  weather_condition: z.enum(WEATHER_CONDITIONS, {
    errorMap: () => ({ message: `Weather condition must be one of: ${WEATHER_CONDITIONS.join(', ')}` })
  }),
  soil_moisture: z.enum(SOIL_MOISTURE_LEVELS, {
    errorMap: () => ({ message: `Soil moisture must be one of: ${SOIL_MOISTURE_LEVELS.join(', ')}` })
  }),
  symptoms: z.string().trim().min(5, 'Please provide at least 5 characters detailing visible symptoms or conditions'),
  recent_treatments: z.string().trim().optional().default('')
}).refine(data => {
  // If extreme weather (Drought or Frost), ensure symptoms or precautions are detailed
  if (['Drought', 'Frost'].includes(data.weather_condition)) {
    return data.symptoms.length >= 10;
  }
  return true;
}, {
  message: 'Extreme weather conditions (Drought/Frost) require at least 10 characters describing crop stress or symptoms',
  path: ['symptoms']
});

export const AdvisoryReportValidationSchema = z.object({
  diagnosis_title: z.string().min(3),
  threat_level: z.enum(THREAT_LEVELS),
  immediate_actions: z.array(z.string()).min(1),
  preventative_measures: z.array(z.string()).min(1),
  recommended_inputs: z.array(z.object({
    input_name: z.string(),
    type: z.string(),
    dosage_instructions: z.string()
  }))
});
