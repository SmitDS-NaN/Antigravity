import { AdvisoryRequestSchema, AdvisoryReportValidationSchema } from '../schemas/zodSchemas.js';
import { 
  ai, 
  isGeminiConfigured, 
  AGRONOMY_SYSTEM_INSTRUCTION, 
  advisoryResponseSchema, 
  generateDiagnosticFallback 
} from '../lib/geminiClient.js';
import { isSupabaseConfigured, supabaseAdmin } from '../lib/supabaseAdmin.js';
import { devStore } from '../lib/devStore.js';

export const submitAdvisory = async (req, res) => {
  try {
    const userId = req.userId;

    // 1. Zod Validation of diagnostic input
    const validationResult = AdvisoryRequestSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed for advisory request parameters.',
        details: validationResult.error.format()
      });
    }

    const { farm_id, crop_stage, weather_condition, soil_moisture, symptoms, recent_treatments } = validationResult.data;

    // 2. Fetch Farm Details for contextual grounding
    let farm = null;
    if (isSupabaseConfigured() && req.supabase) {
      const { data: farmData, error: farmError } = await req.supabase
        .from('farms')
        .select('*')
        .eq('id', farm_id)
        .eq('user_id', userId)
        .single();

      if (farmError || !farmData) {
        return res.status(404).json({
          success: false,
          error: 'Farm profile not found or does not belong to the authenticated user.'
        });
      }
      farm = farmData;
    } else {
      farm = devStore.getFarmById(farm_id, userId) || {
        id: farm_id,
        name: 'Demo Farm Plot',
        crop_type: 'General Crop',
        soil_type: 'Loamy',
        region: 'Temperate Zone'
      };
    }

    // 3. AI Advisory Generation using Gemini @google/genai
    let advisoryReportContent = null;

    if (isGeminiConfigured() && ai) {
      const prompt = `
Please perform a rigorous agronomic diagnostic analysis for the following farm scenario:

FARM BASELINE:
- Farm/Plot Name: ${farm.name}
- Primary Crop: ${farm.crop_type}
- Soil Classification: ${farm.soil_type || 'Unspecified'}
- Geographical Region: ${farm.region || 'Standard Agricultural Zone'}

OBSERVED FIELD CONDITIONS:
- Current Growth Stage: ${crop_stage}
- Ambient Weather Condition: ${weather_condition}
- Soil Moisture State: ${soil_moisture}
- Visible Plant Symptoms / Anomalies: "${symptoms}"
- Recent Treatments / Chemical / Fertilizer Applications: "${recent_treatments || 'None reported'}"

AGRICULTURAL DOMAIN FOCUS:
Evaluate and address the root cause across:
1. Pest & Disease Management (biological threats, foliar or vascular pathogens)
2. Nutrient Management (macronutrient/micronutrient deficiencies or toxicities)
3. Water & Irrigation (drainage, moisture stress, evapotranspiration)
4. General Agronomy (canopy density, sanitation, cultural practices)

Provide concrete, actionable, scientifically verified recommendations strictly matching the requested JSON schema.
`;

      const candidateModels = [
        process.env.GEMINI_MODEL || 'gemini-2.5-flash',
        'gemini-3.8-flash',
        'gemini-flash-latest'
      ];

      let lastError = null;
      for (const model of candidateModels) {
        try {
          console.log(`[Gemini Request] Invoking model: ${model}`);
          const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
              systemInstruction: AGRONOMY_SYSTEM_INSTRUCTION,
              responseMimeType: 'application/json',
              responseSchema: advisoryResponseSchema,
              temperature: 0.2
            }
          });

          if (response?.text) {
            advisoryReportContent = JSON.parse(response.text);
            break;
          }
        } catch (apiErr) {
          console.warn(`[Gemini API Warning with ${model}]:`, apiErr.message);
          lastError = apiErr;
        }
      }

      if (!advisoryReportContent) {
        console.error('[Gemini Generation Failed]:', lastError?.message || 'Empty response');
        // Graceful scientific fallback if API quota or connection issue occurred
        advisoryReportContent = generateDiagnosticFallback(farm, {
          crop_stage,
          weather_condition,
          soil_moisture,
          symptoms,
          recent_treatments
        });
      }
    } else {
      // Offline / Setup Mode Fallback
      console.log('[Advisory] Gemini API key not configured or in setup mode; using agronomic expert engine.');
      advisoryReportContent = generateDiagnosticFallback(farm, {
        crop_stage,
        weather_condition,
        soil_moisture,
        symptoms,
        recent_treatments
      });
    }

    // 4. Validate output schema structure
    const reportValidation = AdvisoryReportValidationSchema.safeParse(advisoryReportContent);
    if (!reportValidation.success) {
      console.warn('[Advisory Report Schema Warning]: Output did not strictly match schema, normalizing structure.');
      advisoryReportContent = {
        diagnosis_title: advisoryReportContent.diagnosis_title || `Agronomic Evaluation for ${farm.crop_type}`,
        threat_level: ['Low', 'Medium', 'High', 'Critical'].includes(advisoryReportContent.threat_level) 
          ? advisoryReportContent.threat_level 
          : 'Medium',
        immediate_actions: Array.isArray(advisoryReportContent.immediate_actions) && advisoryReportContent.immediate_actions.length > 0
          ? advisoryReportContent.immediate_actions
          : ['Isolate affected area and monitor daily.'],
        preventative_measures: Array.isArray(advisoryReportContent.preventative_measures) && advisoryReportContent.preventative_measures.length > 0
          ? advisoryReportContent.preventative_measures
          : ['Ensure balanced soil nutrition and regular crop scouting.'],
        recommended_inputs: Array.isArray(advisoryReportContent.recommended_inputs)
          ? advisoryReportContent.recommended_inputs
          : []
      };
    }

    // 5. Persist to Database or Sandbox Store
    if (isSupabaseConfigured() && req.supabase) {
      // Insert into advisory_requests
      const { data: requestRecord, error: reqError } = await req.supabase
        .from('advisory_requests')
        .insert([
          {
            farm_id,
            user_id: userId,
            crop_stage,
            weather_condition,
            soil_moisture,
            symptoms,
            recent_treatments
          }
        ])
        .select()
        .single();

      if (reqError) {
        console.error('[Supabase Insert Request Error]:', reqError.message);
        return res.status(500).json({
          success: false,
          error: 'Failed to record advisory request in database.'
        });
      }

      // Insert into advisory_reports
      // Note: Use supabaseAdmin if service role key is required by policy, or req.supabase
      const clientForReport = supabaseAdmin || req.supabase;
      const { data: reportRecord, error: repError } = await clientForReport
        .from('advisory_reports')
        .insert([
          {
            request_id: requestRecord.id,
            user_id: userId,
            diagnosis_title: advisoryReportContent.diagnosis_title,
            threat_level: advisoryReportContent.threat_level,
            immediate_actions: advisoryReportContent.immediate_actions,
            preventative_measures: advisoryReportContent.preventative_measures,
            recommended_inputs: advisoryReportContent.recommended_inputs
          }
        ])
        .select()
        .single();

      if (repError) {
        console.error('[Supabase Insert Report Error]:', repError.message);
        return res.status(500).json({
          success: false,
          error: 'Failed to persist generated advisory report in database.'
        });
      }

      return res.status(201).json({
        success: true,
        reportId: reportRecord.id,
        data: {
          ...reportRecord,
          request: requestRecord,
          farm
        },
        message: 'Advisory report successfully generated.'
      });
    }

    // Dev Store Persistence
    const savedRequest = devStore.createRequest({
      farm_id,
      user_id: userId,
      crop_stage,
      weather_condition,
      soil_moisture,
      symptoms,
      recent_treatments
    });

    const savedReport = devStore.createReport({
      request_id: savedRequest.id,
      user_id: userId,
      diagnosis_title: advisoryReportContent.diagnosis_title,
      threat_level: advisoryReportContent.threat_level,
      immediate_actions: advisoryReportContent.immediate_actions,
      preventative_measures: advisoryReportContent.preventative_measures,
      recommended_inputs: advisoryReportContent.recommended_inputs
    });

    return res.status(201).json({
      success: true,
      reportId: savedReport.id,
      data: {
        ...savedReport,
        request: savedRequest,
        farm
      },
      isDemo: true,
      message: 'Advisory report successfully generated (Sandbox mode).'
    });

  } catch (err) {
    console.error('[submitAdvisory Error]:', err.message);
    return res.status(500).json({
      success: false,
      error: 'An unexpected error occurred during advisory processing. Please try again.'
    });
  }
};

export const getAdvisoryReport = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (isSupabaseConfigured() && req.supabase) {
      // Fetch report
      const { data: report, error: repError } = await req.supabase
        .from('advisory_reports')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (repError || !report) {
        return res.status(404).json({
          success: false,
          error: 'Advisory report not found or access denied.'
        });
      }

      // Fetch linked request
      const { data: request } = await req.supabase
        .from('advisory_requests')
        .select('*')
        .eq('id', report.request_id)
        .single();

      // Fetch linked farm
      let farm = null;
      if (request?.farm_id) {
        const { data: farmData } = await req.supabase
          .from('farms')
          .select('*')
          .eq('id', request.farm_id)
          .single();
        farm = farmData;
      }

      return res.status(200).json({
        success: true,
        data: {
          ...report,
          request,
          farm
        }
      });
    }

    // Dev Store Fallback
    const reportData = devStore.getReportById(id, userId);
    if (!reportData) {
      return res.status(404).json({
        success: false,
        error: 'Advisory report not found.'
      });
    }

    return res.status(200).json({
      success: true,
      data: reportData,
      isDemo: true
    });
  } catch (err) {
    console.error('[getAdvisoryReport Error]:', err.message);
    return res.status(500).json({
      success: false,
      error: 'An unexpected error occurred while fetching the advisory report.'
    });
  }
};
