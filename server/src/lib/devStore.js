// In-memory persistent mock store for local development preview
// Used only when Supabase PostgreSQL environment variables are not yet configured

let mockFarms = [
  {
    id: "f1a2b3c4-0001-4000-8000-000000000001",
    user_id: "11111111-1111-4111-a111-111111111111",
    name: "Valley Green - North Plot",
    crop_type: "Tomato (Roma)",
    soil_type: "Clay Loam",
    region: "Central Valley Agricultural Belt",
    created_at: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: "f1a2b3c4-0002-4000-8000-000000000002",
    user_id: "11111111-1111-4111-a111-111111111111",
    name: "Sunrise Orchard Plot 4",
    crop_type: "Sweet Corn",
    soil_type: "Sandy Loam",
    region: "Eastern Plains River Basin",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

let mockRequests = [
  {
    id: "r1a2b3c4-0001-4000-8000-000000000001",
    farm_id: "f1a2b3c4-0001-4000-8000-000000000001",
    user_id: "11111111-1111-4111-a111-111111111111",
    crop_stage: "Vegetative",
    weather_condition: "Rainy",
    soil_moisture: "Waterlogged",
    symptoms: "Lower leaves displaying irregular dark brown concentric spots with chlorotic yellow halos. Marginal leaf curling observed.",
    recent_treatments: "Applied organic fish emulsion 2 weeks ago; no chemical fungicide applied.",
    created_at: new Date(Date.now() - 86400000 * 3).toISOString()
  }
];

let mockReports = [
  {
    id: "rep1-b3c4-0001-4000-8000-000000000001",
    request_id: "r1a2b3c4-0001-4000-8000-000000000001",
    user_id: "11111111-1111-4111-a111-111111111111",
    diagnosis_title: "Early Blight (Alternaria solani) with Secondary Waterlogged Root Hypoxia",
    threat_level: "High",
    immediate_actions: [
      "Improve drainage immediately by digging relief furrows around waterlogged tomato beds.",
      "Prune and safely bag all lower leaves showing target-like concentric lesions to reduce spore load.",
      "Sanitize pruning tools with 70% isopropyl alcohol or 10% bleach between plants."
    ],
    preventative_measures: [
      "Shift irrigation scheduling from overhead spraying to drip irrigation directly at root drip lines.",
      "Apply organic straw mulch around plant base to prevent soil-splash pathogens onto lower leaves.",
      "Follow strict 3-year crop rotation avoiding Solanaceae family members (potatoes, peppers, eggplants)."
    ],
    recommended_inputs: [
      {
        input_name: "Copper Hydroxide (Organic Approved Protective Fungicide)",
        type: "Fungicide / Organic",
        dosage_instructions: "2.5 kg/ha mixed with 500L water. Apply at first sign of disease and repeat every 7-10 days."
      },
      {
        input_name: "Potassium Phosphite Systemic Resistance Inducer",
        type: "Systemic Nutrient / Protectant",
        dosage_instructions: "3 mL/L water applied as foliar spray to activate systemic acquired resistance (SAR)."
      }
    ],
    created_at: new Date(Date.now() - 86400000 * 3).toISOString()
  }
];

export const devStore = {
  getFarms: (userId) => mockFarms.filter(f => f.user_id === userId),
  getFarmById: (farmId, userId) => mockFarms.find(f => f.id === farmId && (!userId || f.user_id === userId)),
  createFarm: (farmData) => {
    const newFarm = {
      id: `farm-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      created_at: new Date().toISOString(),
      ...farmData
    };
    mockFarms.unshift(newFarm);
    return newFarm;
  },
  createRequest: (requestData) => {
    const newReq = {
      id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      created_at: new Date().toISOString(),
      ...requestData
    };
    mockRequests.unshift(newReq);
    return newReq;
  },
  createReport: (reportData) => {
    const newReport = {
      id: `rep-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      created_at: new Date().toISOString(),
      ...reportData
    };
    mockReports.unshift(newReport);
    return newReport;
  },
  getReportById: (reportId, userId) => {
    const report = mockReports.find(r => r.id === reportId && (!userId || r.user_id === userId));
    if (!report) return null;
    const request = mockRequests.find(req => req.id === report.request_id);
    const farm = request ? mockFarms.find(f => f.id === request.farm_id) : null;
    return {
      ...report,
      request,
      farm
    };
  },
  getHistory: (userId) => {
    return mockReports
      .filter(r => !userId || r.user_id === userId)
      .map(report => {
        const request = mockRequests.find(req => req.id === report.request_id);
        const farm = request ? mockFarms.find(f => f.id === request.farm_id) : null;
        return {
          id: report.id,
          diagnosis_title: report.diagnosis_title,
          threat_level: report.threat_level,
          created_at: report.created_at,
          farm_name: farm?.name || 'Unknown Farm',
          crop_type: farm?.crop_type || 'Unknown Crop',
          crop_stage: request?.crop_stage || 'N/A',
          weather_condition: request?.weather_condition || 'N/A',
          symptoms: request?.symptoms || ''
        };
      });
  }
};
