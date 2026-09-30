import { z } from 'zod';

export const CROP_STAGES = ['Seedling', 'Vegetative', 'Flowering', 'Fruiting', 'Harvest'];
export const WEATHER_CONDITIONS = ['Sunny', 'Rainy', 'Overcast', 'Drought', 'Frost'];
export const SOIL_MOISTURE_LEVELS = ['Dry', 'Optimal', 'Waterlogged'];
export const SOIL_TYPES = ['Clay', 'Sandy', 'Loamy', 'Silt', 'Peaty', 'Chalky', 'Saline'];

export const FarmSchema = z.object({
  name: z.string().trim().min(2, 'Farm/Plot name must be at least 2 characters').max(100, 'Farm/Plot name cannot exceed 100 characters'),
  crop_type: z.string().trim().min(2, 'Primary crop type is required (e.g. Tomato, Corn, Wheat)').max(100),
  soil_type: z.string().trim().min(1, 'Please select or enter a soil type').max(50),
  region: z.string().trim().min(2, 'Geographical region or climate zone is required').max(100)
});

export const AdvisoryRequestSchema = z.object({
  farm_id: z.string().min(1, 'Please select a farm profile'),
  crop_stage: z.enum(CROP_STAGES, {
    errorMap: () => ({ message: 'Please select a valid crop growth stage' })
  }),
  weather_condition: z.enum(WEATHER_CONDITIONS, {
    errorMap: () => ({ message: 'Please select current weather condition' })
  }),
  soil_moisture: z.enum(SOIL_MOISTURE_LEVELS, {
    errorMap: () => ({ message: 'Please select current soil moisture level' })
  }),
  symptoms: z.string().trim().min(5, 'Please provide at least 5 characters detailing visible symptoms or anomalies'),
  recent_treatments: z.string().trim().optional()
}).refine(data => {
  if (['Drought', 'Frost'].includes(data.weather_condition)) {
    return data.symptoms.length >= 10;
  }
  return true;
}, {
  message: 'Extreme weather conditions (Drought or Frost) require at least 10 characters describing crop stress or symptoms',
  path: ['symptoms']
});
