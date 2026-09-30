import { isSupabaseConfigured } from '../lib/supabaseAdmin.js';
import { devStore } from '../lib/devStore.js';

export const getHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const { query, threat, farmId } = req.query;

    if (isSupabaseConfigured() && req.supabase) {
      let supabaseQuery = req.supabase
        .from('advisory_reports')
        .select(`
          id,
          diagnosis_title,
          threat_level,
          created_at,
          request_id,
          advisory_requests!inner (
            id,
            farm_id,
            crop_stage,
            weather_condition,
            soil_moisture,
            symptoms,
            farms!inner (
              id,
              name,
              crop_type
            )
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (threat && threat !== 'All') {
        supabaseQuery = supabaseQuery.eq('threat_level', threat);
      }

      const { data, error } = await supabaseQuery;

      if (error) {
        console.error('[Supabase getHistory Error]:', error.message);
        return res.status(500).json({
          success: false,
          error: 'Failed to fetch advisory history from database.'
        });
      }

      // Format records cleanly for client
      let historyList = (data || []).map(item => ({
        id: item.id,
        diagnosis_title: item.diagnosis_title,
        threat_level: item.threat_level,
        created_at: item.created_at,
        farm_name: item.advisory_requests?.farms?.name || 'Plot',
        crop_type: item.advisory_requests?.farms?.crop_type || 'Crop',
        crop_stage: item.advisory_requests?.crop_stage || 'N/A',
        weather_condition: item.advisory_requests?.weather_condition || 'N/A',
        symptoms: item.advisory_requests?.symptoms || ''
      }));

      if (query) {
        const q = query.toLowerCase();
        historyList = historyList.filter(item => 
          item.diagnosis_title.toLowerCase().includes(q) ||
          item.farm_name.toLowerCase().includes(q) ||
          item.crop_type.toLowerCase().includes(q) ||
          item.symptoms.toLowerCase().includes(q)
        );
      }

      return res.status(200).json({
        success: true,
        data: historyList
      });
    }

    // Dev Store Fallback
    let devHistory = devStore.getHistory(userId);

    if (threat && threat !== 'All') {
      devHistory = devHistory.filter(item => item.threat_level === threat);
    }
    if (query) {
      const q = query.toLowerCase();
      devHistory = devHistory.filter(item => 
        item.diagnosis_title.toLowerCase().includes(q) ||
        item.farm_name.toLowerCase().includes(q) ||
        item.crop_type.toLowerCase().includes(q) ||
        item.symptoms.toLowerCase().includes(q)
      );
    }

    return res.status(200).json({
      success: true,
      data: devHistory,
      isDemo: true
    });

  } catch (err) {
    console.error('[getHistory Error]:', err.message);
    return res.status(500).json({
      success: false,
      error: 'An unexpected server error occurred while retrieving advisory history.'
    });
  }
};
