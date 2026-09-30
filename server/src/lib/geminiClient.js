import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || '';

export const isGeminiConfigured = () => {
  return Boolean(apiKey) && !apiKey.includes('placeholder') && apiKey.length > 10;
};

// Initialize Google GenAI client
export const ai = isGeminiConfigured() ? new GoogleGenAI({ apiKey }) : null;

// Agronomy AI System Prompt
export const AGRONOMY_SYSTEM_INSTRUCTION = 
  "You are an elite master agronomist and agricultural scientist. Your goal is to analyze farm conditions, crop stages, and described symptoms to provide accurate, scientifically backed, and practical farming advisories. You must be objective, cautious with chemical recommendations (favoring integrated pest management), and strictly format your output to match the requested JSON schema. If symptoms describe a critical unknown disease, advise immediate consultation with local agricultural extension services. Categorize the root cause across Agricultural Domains (Pest & Disease Management, Nutrient Management, Water & Irrigation, General Agronomy) and produce clear, prioritized steps.";

// Strict JSON Response Schema matching requirements
export const advisoryResponseSchema = {
  type: Type.OBJECT,
  properties: {
    diagnosis_title: { 
      type: Type.STRING, 
      description: "Short, clear title of the primary issue (e.g., 'Early Blight (Alternaria solani) with Nitrogen Deficiency')" 
    },
    threat_level: { 
      type: Type.STRING, 
      description: "Must be 'Low', 'Medium', 'High', or 'Critical'" 
    },
    immediate_actions: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "Step-by-step actions to take within 24-48 hours"
    },
    preventative_measures: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Long-term strategies to prevent recurrence"
    },
    recommended_inputs: {
      type: Type.ARRAY,
      items: { 
        type: Type.OBJECT,
        properties: {
          input_name: { type: Type.STRING, description: "Commercial or organic input name" },
          type: { type: Type.STRING, description: "e.g., Fertilizer, Fungicide, Organic, Soil Amendment, Biocontrol" },
          dosage_instructions: { type: Type.STRING, description: "Precise application rate and timing" }
        },
        required: ["input_name", "type", "dosage_instructions"]
      }
    }
  },
  required: ["diagnosis_title", "threat_level", "immediate_actions", "preventative_measures", "recommended_inputs"]
};

/**
 * Intelligent scientific fallback generator when Gemini API key is in setup mode
 */
export const generateDiagnosticFallback = (farm, diagnostic) => {
  const crop = farm?.crop_type || 'Crop';
  const weather = diagnostic.weather_condition;
  const moisture = diagnostic.soil_moisture;
  const symptoms = (diagnostic.symptoms || '').toLowerCase();
  
  let threat = 'Medium';
  let title = `Agronomic Assessment for ${crop}`;
  let immediate = [
    `Isolate affected ${crop} rows to prevent cross-contamination across the plot.`,
    `Sanitize all shears, pruning tools, and equipment with a 10% sodium hypochlorite solution.`
  ];
  let preventative = [
    `Implement drip irrigation rather than overhead sprinklers to minimize leaf wetness duration.`,
    `Follow a 3-year crop rotation schedule with non-host botanical families.`
  ];
  let inputs = [
    {
      input_name: "Copper Hydroxide or Neem Oil Extract",
      type: "Fungicide / Organic Protectant",
      dosage_instructions: "2.5 ml per liter of water, sprayed early morning during low UV index."
    },
    {
      input_name: "Chelated Micronutrient & Potassium Foliar Spray",
      type: "Nutrient",
      dosage_instructions: "Apply 2g/L water every 10 days until new foliage appears vigorous."
    }
  ];

  if (symptoms.includes('yellow') || symptoms.includes('deficiency') || symptoms.includes('pale')) {
    title = `Nutrient Chlorosis & Vascular Stress in ${crop}`;
    threat = moisture === 'Waterlogged' ? 'High' : 'Medium';
    immediate.unshift(`Check root zone drainage immediately to halt root hypoxia in ${moisture} soil conditions.`);
    inputs.unshift({
      input_name: "Calcium Ammonium Nitrate or Organic Compost Tea",
      type: "Fertilizer",
      dosage_instructions: "50 kg/hectare side-dressed at root drip line or 5L concentrated compost tea."
    });
  } else if (symptoms.includes('spot') || symptoms.includes('blight') || symptoms.includes('rot') || symptoms.includes('fung')) {
    title = `Fungal Foliar Spot Complex on ${crop}`;
    threat = (weather === 'Rainy' || moisture === 'Waterlogged') ? 'High' : 'Medium';
    immediate.unshift(`Prune and carefully destroy severely infected lower leaves showing lesions.`);
    preventative.push(`Increase plant spacing by 15-20% in future plantings to improve airflow.`);
  } else if (symptoms.includes('wilt') || symptoms.includes('dying') || symptoms.includes('drop') || symptoms.includes('pest')) {
    title = `Vascular Wilt & Pest Vector Infestation on ${crop}`;
    threat = 'Critical';
    immediate.unshift(`Inspect stem base and vascular bundles for discoloration; isolate plot perimeter.`);
    inputs.push({
      input_name: "Bacillus subtilis Bio-fungicide",
      type: "Biological / Organic",
      dosage_instructions: "5g per liter soil drench around affected plant crowns."
    });
  }

  return {
    diagnosis_title: title,
    threat_level: threat,
    immediate_actions: immediate,
    preventative_measures: preventative,
    recommended_inputs: inputs
  };
};
