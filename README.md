# AgroAI | AI-Powered Agriculture Crop Advisory Assistant

A production-grade, end-to-end precision agricultural diagnostic and management platform. Empowers farmers, agronomists, and agricultural extension officers to analyze field conditions, soil parameters, and observable symptoms to generate structured, scientifically backed crop disease mitigations and long-term stewardship plans powered by **Google Gemini AI** and **Supabase PostgreSQL**.

---

## 🌟 Key Features

1. **Secure Authentication & Data Isolation**
   - Supabase Auth (Email / Password registration and login).
   - PostgreSQL Row Level Security (RLS) policies guaranteeing strict data privacy per user.
   - Server-side Supabase JWT verification on every API route.

2. **Interactive Farm Profile Management**
   - Register farm plots with soil classification (Clay, Sandy, Loamy, Silt, etc.) and geographical climate belt.
   - Farm-specific tracking and historical diagnostic timeline.

3. **AI Crop Diagnostics Engine**
   - Captures biological growth stages (*Seedling, Vegetative, Flowering, Fruiting, Harvest*).
   - Monitors environmental parameters (*Sunny, Rainy, Overcast, Drought, Frost*) and root zone soil moisture (*Dry, Optimal, Waterlogged*).
   - Rich descriptions of foliar anomalies, lesions, and recent chemical or fertilizer applications.

4. **Guaranteed Structured JSON Action Plans**
   - Powered by `@google/genai` with strict `responseSchema` enforcement.
   - Dynamic threat assessment levels (**Low, Medium, High, Critical**) dynamically styling the user interface.
   - **Immediate 24-48 Hour Actions**: Step-by-step containment with interactive field checklists.
   - **Long-Term Preventive Measures**: Crop rotation, canopy spacing, and biological soil health.
   - **Recommended Agricultural Inputs Table**: Product classifications, active ingredients, and precise application rates.

5. **Historical Advisory Log & Search**
   - Historical tracking of past advisories with filtering by threat levels and instant search.
   - One-click print / PDF export for field workers.

6. **Mobile-First Responsive Field UI**
   - Built with Tailwind CSS, Lucide React, and modern typography optimized for outdoor mobile use by farmers.

---

## 🏗️ Technology Architecture

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, React Hook Form, Zod Resolver, React Router DOM, `@supabase/supabase-js`.
- **Backend**: Node.js, Express.js, `@google/genai` (Official Google GenAI SDK), `@supabase/supabase-js`, Zod, CORS, Express Rate Limit.
- **Database & Auth**: Supabase PostgreSQL & Supabase Auth.
- **AI Engine**: Google Gemini API (`gemini-2.5-flash` / `gemini-3.8-flash`) with structured schema output.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- A **Supabase account** (free tier at [supabase.com](https://supabase.com))
- A **Google Gemini API Key** from [Google AI Studio](https://aistudio.google.com/)

---

### 2. Database Setup (Supabase PostgreSQL)

1. Open your Supabase Project Dashboard and navigate to the **SQL Editor**.
2. Open [`supabase/schema.sql`](file:///c:/Users/SMIT/OneDrive/Documents/Anitigravity/Hackathon-1/supabase/schema.sql).
3. Copy and run the entire script. It automatically configures:
   - `farms` table with foreign key to `auth.users(id)`
   - `advisory_requests` table
   - `advisory_reports` table
   - Performance indexes on `user_id` and `farm_id`
   - Row Level Security (RLS) policies for user data isolation.

---

### 3. Environment Configuration

#### Backend Configuration:
Create or edit `server/.env`:
```env
PORT=5000
NODE_ENV=development

# Supabase Settings (Project Settings > API)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

#### Frontend Configuration:
Create or edit `client/.env`:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://localhost:5000/api
```

> **Note on Sandbox Mode**: If credentials are not yet configured, the platform automatically boots in **Evaluation Sandbox Mode**, enabling complete interactive walkthroughs, one-click login, and expert agronomic generation.

---

### 4. Installation & Running

Install all dependencies across root, server, and client:
```bash
npm run install:all
```

Run both backend server and frontend client concurrently:
```bash
npm run dev
```

- **Frontend Client**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`
- **Health Endpoint**: `http://localhost:5000/api/health`

---

## 📱 Application Routes

| Route | Description | Protection |
|---|---|---|
| `/` | Landing page explaining value proposition and agronomic domains | Public |
| `/login` | Supabase Auth sign in / sign up + One-click Demo | Public |
| `/dashboard` | Parcel overview, quick stats, recent advisories | Protected |
| `/farms/new` | Register new farm plot with soil baseline | Protected |
| `/advisory/request/:farmId` | Field observation diagnostic form | Protected |
| `/advisory/:reportId` | Structured AI Advisory report with threat badge | Protected |
| `/history` | Searchable historical log and threat filters | Protected |

---

## 🛡️ Security & Resiliency
- Strict JWT authentication via `authMiddleware` on all API endpoints.
- Rate limiting on `/api/advisory` (30 requests per 15-minute window) to prevent API abuse.
- Zod schema validation on both client and server before triggering database writes or Gemini API requests.
- Standardized error handling preventing database or AI error leakage to the client.
