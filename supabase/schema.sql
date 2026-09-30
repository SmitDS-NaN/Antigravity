-- ==============================================================================
-- AI-Powered Agriculture Crop Advisory Assistant
-- Production Supabase PostgreSQL Schema & Row Level Security (RLS) Setup
-- ==============================================================================

-- 1. Farms Table: Stores baseline farm metadata per user
CREATE TABLE IF NOT EXISTS public.farms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    crop_type VARCHAR(100) NOT NULL,
    soil_type VARCHAR(50),
    region VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Advisory Requests Table: Stores field observations & diagnostic parameters
CREATE TABLE IF NOT EXISTS public.advisory_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    crop_stage VARCHAR(50),
    weather_condition VARCHAR(50),
    soil_moisture VARCHAR(50),
    symptoms TEXT,
    recent_treatments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Advisory Reports Table: Stores structured Gemini AI agronomy diagnosis & recommendations
CREATE TABLE IF NOT EXISTS public.advisory_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES public.advisory_requests(id) ON DELETE CASCADE UNIQUE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    diagnosis_title VARCHAR(255) NOT NULL,
    threat_level VARCHAR(20) CHECK (threat_level IN ('Low', 'Medium', 'High', 'Critical')),
    immediate_actions JSONB NOT NULL,
    preventative_measures JSONB NOT NULL,
    recommended_inputs JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- Indexes for High Performance & Query Optimization
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_farms_user_id ON public.farms(user_id);
CREATE INDEX IF NOT EXISTS idx_advisory_requests_user_id ON public.advisory_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_advisory_requests_farm_id ON public.advisory_requests(farm_id);
CREATE INDEX IF NOT EXISTS idx_advisory_reports_user_id ON public.advisory_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_advisory_reports_request_id ON public.advisory_reports(request_id);

-- ==============================================================================
-- Row Level Security (RLS) Configuration
-- ==============================================================================
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisory_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisory_reports ENABLE ROW LEVEL SECURITY;

-- Clean existing policies if re-running
DROP POLICY IF EXISTS "Users can view their own farms" ON public.farms;
DROP POLICY IF EXISTS "Users can insert their own farms" ON public.farms;
DROP POLICY IF EXISTS "Users can update their own farms" ON public.farms;
DROP POLICY IF EXISTS "Users can delete their own farms" ON public.farms;

DROP POLICY IF EXISTS "Users can view their own requests" ON public.advisory_requests;
DROP POLICY IF EXISTS "Users can insert their own requests" ON public.advisory_requests;
DROP POLICY IF EXISTS "Users can update their own requests" ON public.advisory_requests;
DROP POLICY IF EXISTS "Users can delete their own requests" ON public.advisory_requests;

DROP POLICY IF EXISTS "Users can view their own reports" ON public.advisory_reports;
DROP POLICY IF EXISTS "Service role can insert reports" ON public.advisory_reports;
DROP POLICY IF EXISTS "Users can insert their own reports" ON public.advisory_reports;

-- Policies for Farms
CREATE POLICY "Users can view their own farms" 
    ON public.farms FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own farms" 
    ON public.farms FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own farms" 
    ON public.farms FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own farms" 
    ON public.farms FOR DELETE 
    USING (auth.uid() = user_id);

-- Policies for Advisory Requests
CREATE POLICY "Users can view their own requests" 
    ON public.advisory_requests FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own requests" 
    ON public.advisory_requests FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own requests" 
    ON public.advisory_requests FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own requests" 
    ON public.advisory_requests FOR DELETE 
    USING (auth.uid() = user_id);

-- Policies for Advisory Reports
CREATE POLICY "Users can view their own reports" 
    ON public.advisory_reports FOR SELECT 
    USING (auth.uid() = user_id);

-- Allow service role or authenticated backend user to insert reports
CREATE POLICY "Service role can insert reports" 
    ON public.advisory_reports FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Users can insert their own reports" 
    ON public.advisory_reports FOR INSERT 
    WITH CHECK (auth.uid() = user_id);
