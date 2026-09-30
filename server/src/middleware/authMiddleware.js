import { supabaseAdmin, createUserClient, isSupabaseConfigured } from '../lib/supabaseAdmin.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Missing or malformed Authorization header.'
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication token is empty.'
      });
    }

    // If Supabase is fully configured, verify JWT with Supabase Auth
    if (isSupabaseConfigured() && supabaseAdmin) {
      const { data, error } = await supabaseAdmin.auth.getUser(token);

      if (error || !data?.user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid or expired session. Please log in again.'
        });
      }

      req.user = data.user;
      req.userId = data.user.id;
      req.token = token;
      req.supabase = createUserClient(token) || supabaseAdmin;
      return next();
    }

    // Local Development / Demo Sandbox Mode (when Supabase credentials are placeholder)
    // Supports instant testing and evaluation of the application UI/UX
    const devUserId = '11111111-1111-4111-a111-111111111111';
    req.user = {
      id: devUserId,
      email: 'agronomist@farmdemo.org',
      user_metadata: { full_name: 'Lead Agronomist' }
    };
    req.userId = devUserId;
    req.token = token;
    req.supabase = null;
    return next();
  } catch (err) {
    console.error('[Auth Middleware Error]:', err.message);
    return res.status(500).json({
      success: false,
      error: 'Internal authentication service error.'
    });
  }
};
