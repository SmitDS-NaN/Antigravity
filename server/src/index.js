import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import farmRoutes from './routes/farmRoutes.js';
import advisoryRoutes from './routes/advisoryRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import { isSupabaseConfigured } from './lib/supabaseAdmin.js';
import { isGeminiConfigured } from './lib/geminiClient.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middlewares
app.use(cors({
  origin: true, // Allow frontend dev and production origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(morgan('dev'));

// System Health & Configuration Inspection Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'AgroAI Crop Advisory Platform',
    timestamp: new Date().toISOString(),
    config: {
      supabaseConfigured: isSupabaseConfigured(),
      geminiConfigured: isGeminiConfigured(),
      environment: process.env.NODE_ENV || 'development'
    }
  });
});

// Mount Core Application Routes
app.use('/api/farms', farmRoutes);
app.use('/api/advisory', advisoryRoutes);
app.use('/api/history', historyRoutes);

// Catch-all 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `API Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Centralized Production Error Handler (Prevents leakage of sensitive stack traces or raw API errors)
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Exception]:', err.stack || err.message);
  
  const statusCode = err.status || 500;
  const clientMessage = process.env.NODE_ENV === 'production'
    ? 'An unexpected error occurred while processing your request.'
    : err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: clientMessage
  });
});

// Start listening when not in Vercel serverless environment
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🌾 AgroAI Crop Advisory Server active on port ${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/api/health`);
    console.log(`   Supabase Live: ${isSupabaseConfigured() ? 'Connected' : 'Sandbox / Offline Fallback'}`);
    console.log(`   Gemini AI Live: ${isGeminiConfigured() ? 'Active (@google/genai)' : 'Agronomy Rule Engine'}`);
    console.log(`====================================================`);
  });
}

export default app;

