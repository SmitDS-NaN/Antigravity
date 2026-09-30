import { FarmSchema } from '../schemas/zodSchemas.js';
import { isSupabaseConfigured } from '../lib/supabaseAdmin.js';
import { devStore } from '../lib/devStore.js';

export const getFarms = async (req, res) => {
  try {
    const userId = req.userId;

    if (isSupabaseConfigured() && req.supabase) {
      const { data, error } = await req.supabase
        .from('farms')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[Supabase getFarms Error]:', error.message);
        return res.status(500).json({
          success: false,
          error: 'Failed to retrieve farm profiles from database.'
        });
      }

      return res.status(200).json({
        success: true,
        data: data || []
      });
    }

    // Local dev mode fallback
    const farms = devStore.getFarms(userId);
    return res.status(200).json({
      success: true,
      data: farms,
      isDemo: true
    });
  } catch (err) {
    console.error('[getFarms Controller Error]:', err.message);
    return res.status(500).json({
      success: false,
      error: 'An unexpected server error occurred while retrieving farms.'
    });
  }
};

export const createFarm = async (req, res) => {
  try {
    const userId = req.userId;
    
    // Validate request body with Zod
    const validationResult = FarmSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed for farm details.',
        details: validationResult.error.format()
      });
    }

    const { name, crop_type, soil_type, region } = validationResult.data;

    if (isSupabaseConfigured() && req.supabase) {
      const { data, error } = await req.supabase
        .from('farms')
        .insert([
          {
            user_id: userId,
            name,
            crop_type,
            soil_type: soil_type || 'Loamy',
            region: region || 'General Agricultural Region'
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('[Supabase createFarm Error]:', error.message);
        return res.status(500).json({
          success: false,
          error: 'Could not create farm profile in database.'
        });
      }

      return res.status(201).json({
        success: true,
        data,
        message: 'Farm profile successfully created.'
      });
    }

    // Local dev mode
    const newFarm = devStore.createFarm({
      user_id: userId,
      name,
      crop_type,
      soil_type: soil_type || 'Loamy',
      region: region || 'General Agricultural Region'
    });

    return res.status(201).json({
      success: true,
      data: newFarm,
      isDemo: true,
      message: 'Farm profile successfully created (Sandbox mode).'
    });
  } catch (err) {
    console.error('[createFarm Controller Error]:', err.message);
    return res.status(500).json({
      success: false,
      error: 'An unexpected server error occurred while creating the farm profile.'
    });
  }
};
