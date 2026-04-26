// TODO: Replace with a proper Köppen-Geiger raster geospatial lookup.
// This fallback dataset covers priority cities for offline / no-API-key operation.
// Each entry includes aliases for fuzzy matching.

export type KoppenFallbackRecord = {
  country: string;
  countryCode: string;
  city: string;
  aliases: string[];
  latitude: number;
  longitude: number;
  climateZone: string;
  climateLabel: string;
  source: string;
  confidence: 'fallback';
  notes: string;
};

export const KOPPEN_FALLBACKS: KoppenFallbackRecord[] = [
  // United States
  {
    country: 'United States', countryCode: 'US', city: 'Boston',
    aliases: ['boston', 'boston ma', 'boston, ma', 'boston massachusetts'],
    latitude: 42.3601, longitude: -71.0589,
    climateZone: 'Dfa', climateLabel: 'Humid Continental',
    source: 'Fallback city-level Köppen mapping', confidence: 'fallback',
    notes: 'Replace with geospatial Köppen-Geiger raster lookup.',
  },
  {
    country: 'United States', countryCode: 'US', city: 'New York',
    aliases: ['new york', 'new york city', 'nyc', 'new york ny', 'manhattan'],
    latitude: 40.7128, longitude: -74.0060,
    climateZone: 'Cfa', climateLabel: 'Humid Subtropical',
    source: 'Fallback city-level Köppen mapping', confidence: 'fallback',
    notes: 'Replace with geospatial Köppen-Geiger raster lookup.',
  },
  {
    country: 'United States', countryCode: 'US', city: 'Chicago',
    aliases: ['chicago', 'chicago il', 'chicago illinois'],
    latitude: 41.8781, longitude: -87.6298,
    climateZone: 'Dfa', climateLabel: 'Humid Continental',
    source: 'Fallback city-level Köppen mapping', confidence: 'fallback',
    notes: 'Replace with geospatial Köppen-Geiger raster lookup.',
  },
  {
    country: 'United States', countryCode: 'US', city: 'Los Angeles',
    aliases: ['los angeles', 'la', 'los angeles ca', 'los angeles california'],
    latitude: 34.0522, longitude: -118.2437,
    climateZone: 'BSk', climateLabel: 'Cold Semi-Arid / Steppe',
    source: 'Fallback city-level Köppen mapping', confidence: 'fallback',
    notes: 'Replace with geospatial Köppen-Geiger raster lookup.',
  },
  {
    country: 'United States', countryCode: 'US', city: 'Houston',
    aliases: ['houston', 'houston tx', 'houston texas'],
    latitude: 29.7604, longitude: -95.3698,
    climateZone: 'Cfa', climateLabel: 'Humid Subtropical',
    source: 'Fallback city-level Köppen mapping', confidence: 'fallback',
    notes: 'Replace with geospatial Köppen-Geiger raster lookup.',
  },
  {
    country: 'United States', countryCode: 'US', city: 'Phoenix',
    aliases: ['phoenix', 'phoenix az', 'phoenix arizona'],
    latitude: 33.4484, longitude: -112.0740,
    climateZone: 'BWh', climateLabel: 'Hot Desert',
    source: 'Fallback city-level Köppen mapping', confidence: 'fallback',
    notes: 'Replace with geospatial Köppen-Geiger raster lookup.',
  },
  {
    country: 'United States', countryCode: 'US', city: 'Seattle',
    aliases: ['seattle', 'seattle wa', 'seattle washington'],
    latitude: 47.6062, longitude: -122.3321,
    climateZone: 'Cfb', climateLabel: 'Oceanic / Marine West Coast',
    source: 'Fallback city-level Köppen mapping', confidence: 'fallback',
    notes: 'Replace with geospatial Köppen-Geiger raster lookup.',
  },
  {
    country: 'United States', countryCode: 'US', city: 'San Francisco',
    aliases: ['san francisco', 'sf', 'san francisco ca'],
    latitude: 37.7749, longitude: -122.4194,
    climateZone: 'Csb', climateLabel: 'Warm-Summer Mediterranean',
    source: 'Fallback city-level Köppen mapping', confidence: 'fallback',
    notes: 'Replace with geospatial Köppen-Geiger raster lookup.',
  },
  {
    country: 'United States', countryCode: 'US', city: 'Miami',
    aliases: ['miami', 'miami fl', 'miami florida'],
    latitude: 25.7617, longitude: -80.1918,
    climateZone: 'Aw', climateLabel: 'Tropical Savanna',
    source: 'Fallback city-level Köppen mapping', confidence: 'fallback',
    notes: 'Replace with geospatial Köppen-Geiger raster lookup.',
  },
  {
    country: 'United States', countryCode: 'US', city: 'Denver',
    aliases: ['denver', 'denver co', 'denver colorado'],
    latitude: 39.7392, longitude: -104.9903,
    climateZone: 'BSk', climateLabel: 'Cold Semi-Arid / Steppe',
    source: 'Fallback city-level Köppen mapping', confidence: 'fallback',
    notes: 'Replace with geospatial Köppen-Geiger raster lookup.',
  },
  {
    country: 'United States', countryCode: 'US', city: 'Minneapolis',
    aliases: ['minneapolis', 'minneapolis mn', 'minneapolis minnesota'],
    latitude: 44.9778, longitude: -93.2650,
    climateZone: 'Dfb', climateLabel: 'Warm-Summer Humid Continental',
    source: 'Fallback city-level Köppen mapping', confidence: 'fallback',
    notes: 'Replace with geospatial Köppen-Geiger raster lookup.',
  },
  // Middle East
  {
    country: 'United Arab Emirates', countryCode: 'AE', city: 'Dubai',
    aliases: ['dubai', 'dubai uae', 'dubai, uae', 'dubai united arab emirates'],
    latitude: 25.2048, longitude: 55.2708,
    climateZone: 'BWh', climateLabel: 'Hot Desert',
    source: 'Fallback city-level Köppen mapping', confidence: 'fallback',
    notes: 'Replace with geospatial Köppen-Geiger raster lookup.',
  },
  {
    country: 'United Arab Emirates', countryCode: 'AE', city: 'Abu Dhabi',
    aliases: ['abu dhabi', 'abu dhabi uae', 'abudhabi'],
    latitude: 24.4539, longitude: 54.3773,
    climateZone: 'BWh', climateLabel: 'Hot Desert',
    source: 'Fallback city-level Köppen mapping', confidence: 'fallback',
    notes: 'Replace with geospatial Köppen-Geiger raster lookup.',
  },
  {
    country: 'Oman', countryCode: 'OM', city: 'Salalah',
    aliases: ['salalah', 'salalah oman'],
    latitude: 17.0151, longitude: 54.0924,
    climateZone: 'BSh', climateLabel: 'Hot Semi-Arid / Desert',
    source: 'Fallback city-level Köppen mapping', confidence: 'fallback',
    notes: 'Replace with geospatial Köppen-Geiger raster lookup.',
  },
  {
    country: 'Oman', countryCode: 'OM', city: 'Muscat',
    aliases: ['muscat', 'muscat oman'],
    latitude: 23.5880, longitude: 58.3829,
    climateZone: 'BWh', climateLabel: 'Hot Desert',
    source: 'Fallback city-level Köppen mapping', confidence: 'fallback',
    notes: 'Replace with geospatial Köppen-Geiger raster lookup.',
  },
  {
    country: 'Qatar', countryCode: 'QA', city: 'Doha',
    aliases: ['doha', 'doha qatar'],
    latitude: 25.2854, longitude: 51.5310,
    climateZone: 'BWh', climateLabel: 'Hot Desert',
    source: 'Fallback city-level Köppen mapping', confidence: 'fallback',
    notes: 'Replace with geospatial Köppen-Geiger raster lookup.',
  },
  {
    country: 'Saudi Arabia', countryCode: 'SA', city: 'Riyadh',
    aliases: ['riyadh', 'riyadh saudi arabia', 'riyadh ksa'],
    latitude: 24.6877, longitude: 46.7219,
    climateZone: 'BWh', climateLabel: 'Hot Desert',
    source: 'Fallback city-level Köppen mapping', confidence: 'fallback',
    notes: 'Replace with geospatial Köppen-Geiger raster lookup.',
  },
  // South Asia
  {
    country: 'India', countryCode: 'IN', city: 'Delhi',
    aliases: ['delhi', 'new delhi', 'new delhi india', 'delhi india'],
    latitude: 28.6139, longitude: 77.2090,
    climateZone: 'Cwa', climateLabel: 'Humid Subtropical / Monsoon',
    source: 'Fallback city-level Köppen mapping', confidence: 'fallback',
    notes: 'Replace with geospatial Köppen-Geiger raster lookup.',
  },
  {
    country: 'India', countryCode: 'IN', city: 'Mumbai',
    aliases: ['mumbai', 'mumbai india', 'bombay'],
    latitude: 19.0760, longitude: 72.8777,
    climateZone: 'Aw', climateLabel: 'Tropical Savanna',
    source: 'Fallback city-level Köppen mapping', confidence: 'fallback',
    notes: 'Replace with geospatial Köppen-Geiger raster lookup.',
  },
  {
    country: 'India', countryCode: 'IN', city: 'Bengaluru',
    aliases: ['bengaluru', 'bangalore', 'bangalore india', 'bengaluru india'],
    latitude: 12.9716, longitude: 77.5946,
    climateZone: 'Aw', climateLabel: 'Tropical Savanna',
    source: 'Fallback city-level Köppen mapping', confidence: 'fallback',
    notes: 'Replace with geospatial Köppen-Geiger raster lookup.',
  },
  {
    country: 'India', countryCode: 'IN', city: 'Chennai',
    aliases: ['chennai', 'madras', 'chennai india'],
    latitude: 13.0827, longitude: 80.2707,
    climateZone: 'Aw', climateLabel: 'Tropical Savanna',
    source: 'Fallback city-level Köppen mapping', confidence: 'fallback',
    notes: 'Replace with geospatial Köppen-Geiger raster lookup.',
  },
  // Southeast Asia
  {
    country: 'Vietnam', countryCode: 'VN', city: 'Ho Chi Minh City',
    aliases: ['ho chi minh city', 'hcmc', 'ho chi minh', 'saigon', 'ho chi minh city vietnam'],
    latitude: 10.8231, longitude: 106.6297,
    climateZone: 'Aw', climateLabel: 'Tropical Savanna',
    source: 'Fallback city-level Köppen mapping', confidence: 'fallback',
    notes: 'Replace with geospatial Köppen-Geiger raster lookup.',
  },
  {
    country: 'Vietnam', countryCode: 'VN', city: 'Hanoi',
    aliases: ['hanoi', 'hanoi vietnam', 'ha noi'],
    latitude: 21.0285, longitude: 105.8542,
    climateZone: 'Cwa', climateLabel: 'Humid Subtropical / Monsoon',
    source: 'Fallback city-level Köppen mapping', confidence: 'fallback',
    notes: 'Replace with geospatial Köppen-Geiger raster lookup.',
  },
  {
    country: 'Singapore', countryCode: 'SG', city: 'Singapore',
    aliases: ['singapore'],
    latitude: 1.3521, longitude: 103.8198,
    climateZone: 'Af', climateLabel: 'Tropical Rainforest',
    source: 'Fallback city-level Köppen mapping', confidence: 'fallback',
    notes: 'Replace with geospatial Köppen-Geiger raster lookup.',
  },
  {
    country: 'Thailand', countryCode: 'TH', city: 'Bangkok',
    aliases: ['bangkok', 'bangkok thailand'],
    latitude: 13.7563, longitude: 100.5018,
    climateZone: 'Aw', climateLabel: 'Tropical Savanna',
    source: 'Fallback city-level Köppen mapping', confidence: 'fallback',
    notes: 'Replace with geospatial Köppen-Geiger raster lookup.',
  },
  // East Asia
  {
    country: 'China', countryCode: 'CN', city: 'Shanghai',
    aliases: ['shanghai', 'shanghai china'],
    latitude: 31.2304, longitude: 121.4737,
    climateZone: 'Cfa', climateLabel: 'Humid Subtropical',
    source: 'Fallback city-level Köppen mapping', confidence: 'fallback',
    notes: 'Replace with geospatial Köppen-Geiger raster lookup.',
  },
  {
    country: 'China', countryCode: 'CN', city: 'Beijing',
    aliases: ['beijing', 'beijing china', 'peking'],
    latitude: 39.9042, longitude: 116.4074,
    climateZone: 'Dwa', climateLabel: 'Humid Continental / Monsoon',
    source: 'Fallback city-level Köppen mapping', confidence: 'fallback',
    notes: 'Replace with geospatial Köppen-Geiger raster lookup.',
  },
  // Canada
  {
    country: 'Canada', countryCode: 'CA', city: 'Toronto',
    aliases: ['toronto', 'toronto canada', 'toronto ontario'],
    latitude: 43.6532, longitude: -79.3832,
    climateZone: 'Dfb', climateLabel: 'Warm-Summer Humid Continental',
    source: 'Fallback city-level Köppen mapping', confidence: 'fallback',
    notes: 'Replace with geospatial Köppen-Geiger raster lookup.',
  },
  {
    country: 'Canada', countryCode: 'CA', city: 'Vancouver',
    aliases: ['vancouver', 'vancouver canada', 'vancouver bc'],
    latitude: 49.2827, longitude: -123.1207,
    climateZone: 'Cfb', climateLabel: 'Oceanic / Marine West Coast',
    source: 'Fallback city-level Köppen mapping', confidence: 'fallback',
    notes: 'Replace with geospatial Köppen-Geiger raster lookup.',
  },
  {
    country: 'Canada', countryCode: 'CA', city: 'Montreal',
    aliases: ['montreal', 'montreal canada', 'montreal quebec'],
    latitude: 45.5017, longitude: -73.5673,
    climateZone: 'Dfb', climateLabel: 'Warm-Summer Humid Continental',
    source: 'Fallback city-level Köppen mapping', confidence: 'fallback',
    notes: 'Replace with geospatial Köppen-Geiger raster lookup.',
  },
  // Latin America
  {
    country: 'Chile', countryCode: 'CL', city: 'Santiago',
    aliases: ['santiago', 'santiago chile'],
    latitude: -33.4489, longitude: -70.6693,
    climateZone: 'Csb', climateLabel: 'Warm-Summer Mediterranean',
    source: 'Fallback city-level Köppen mapping', confidence: 'fallback',
    notes: 'Replace with geospatial Köppen-Geiger raster lookup.',
  },
  {
    country: 'Mexico', countryCode: 'MX', city: 'Mexico City',
    aliases: ['mexico city', 'ciudad de mexico', 'cdmx', 'mexico city mexico'],
    latitude: 19.4326, longitude: -99.1332,
    climateZone: 'Cwb', climateLabel: 'Subtropical Highland',
    source: 'Fallback city-level Köppen mapping', confidence: 'fallback',
    notes: 'Replace with geospatial Köppen-Geiger raster lookup.',
  },
  {
    country: 'Brazil', countryCode: 'BR', city: 'São Paulo',
    aliases: ['sao paulo', 'são paulo', 'sao paulo brazil'],
    latitude: -23.5505, longitude: -46.6333,
    climateZone: 'Cfa', climateLabel: 'Humid Subtropical',
    source: 'Fallback city-level Köppen mapping', confidence: 'fallback',
    notes: 'Replace with geospatial Köppen-Geiger raster lookup.',
  },
  {
    country: 'Colombia', countryCode: 'CO', city: 'Bogotá',
    aliases: ['bogota', 'bogotá', 'bogota colombia'],
    latitude: 4.7110, longitude: -74.0721,
    climateZone: 'Cwb', climateLabel: 'Subtropical Highland',
    source: 'Fallback city-level Köppen mapping', confidence: 'fallback',
    notes: 'Replace with geospatial Köppen-Geiger raster lookup.',
  },
  // Africa
  {
    country: 'Kenya', countryCode: 'KE', city: 'Nairobi',
    aliases: ['nairobi', 'nairobi kenya'],
    latitude: -1.2921, longitude: 36.8219,
    climateZone: 'Cwb', climateLabel: 'Subtropical Highland',
    source: 'Fallback city-level Köppen mapping', confidence: 'fallback',
    notes: 'Replace with geospatial Köppen-Geiger raster lookup.',
  },
  {
    country: 'South Africa', countryCode: 'ZA', city: 'Cape Town',
    aliases: ['cape town', 'cape town south africa'],
    latitude: -33.9249, longitude: 18.4241,
    climateZone: 'Csb', climateLabel: 'Warm-Summer Mediterranean',
    source: 'Fallback city-level Köppen mapping', confidence: 'fallback',
    notes: 'Replace with geospatial Köppen-Geiger raster lookup.',
  },
  // Europe
  {
    country: 'United Kingdom', countryCode: 'GB', city: 'London',
    aliases: ['london', 'london uk', 'london england', 'london united kingdom'],
    latitude: 51.5074, longitude: -0.1278,
    climateZone: 'Cfb', climateLabel: 'Oceanic / Marine West Coast',
    source: 'Fallback city-level Köppen mapping', confidence: 'fallback',
    notes: 'Replace with geospatial Köppen-Geiger raster lookup.',
  },
  {
    country: 'Netherlands', countryCode: 'NL', city: 'Amsterdam',
    aliases: ['amsterdam', 'amsterdam netherlands'],
    latitude: 52.3676, longitude: 4.9041,
    climateZone: 'Cfb', climateLabel: 'Oceanic / Marine West Coast',
    source: 'Fallback city-level Köppen mapping', confidence: 'fallback',
    notes: 'Replace with geospatial Köppen-Geiger raster lookup.',
  },
  {
    country: 'Germany', countryCode: 'DE', city: 'Berlin',
    aliases: ['berlin', 'berlin germany'],
    latitude: 52.5200, longitude: 13.4050,
    climateZone: 'Dfb', climateLabel: 'Warm-Summer Humid Continental',
    source: 'Fallback city-level Köppen mapping', confidence: 'fallback',
    notes: 'Replace with geospatial Köppen-Geiger raster lookup.',
  },
  {
    country: 'Sweden', countryCode: 'SE', city: 'Stockholm',
    aliases: ['stockholm', 'stockholm sweden'],
    latitude: 59.3293, longitude: 18.0686,
    climateZone: 'Dfb', climateLabel: 'Warm-Summer Humid Continental',
    source: 'Fallback city-level Köppen mapping', confidence: 'fallback',
    notes: 'Replace with geospatial Köppen-Geiger raster lookup.',
  },
  {
    country: 'Spain', countryCode: 'ES', city: 'Madrid',
    aliases: ['madrid', 'madrid spain'],
    latitude: 40.4168, longitude: -3.7038,
    climateZone: 'BSk', climateLabel: 'Cold Semi-Arid / Steppe',
    source: 'Fallback city-level Köppen mapping', confidence: 'fallback',
    notes: 'Replace with geospatial Köppen-Geiger raster lookup.',
  },
  // Australia
  {
    country: 'Australia', countryCode: 'AU', city: 'Sydney',
    aliases: ['sydney', 'sydney australia'],
    latitude: -33.8688, longitude: 151.2093,
    climateZone: 'Cfa', climateLabel: 'Humid Subtropical',
    source: 'Fallback city-level Köppen mapping', confidence: 'fallback',
    notes: 'Replace with geospatial Köppen-Geiger raster lookup.',
  },
  {
    country: 'Australia', countryCode: 'AU', city: 'Melbourne',
    aliases: ['melbourne', 'melbourne australia'],
    latitude: -37.8136, longitude: 144.9631,
    climateZone: 'Cfb', climateLabel: 'Oceanic / Marine West Coast',
    source: 'Fallback city-level Köppen mapping', confidence: 'fallback',
    notes: 'Replace with geospatial Köppen-Geiger raster lookup.',
  },
];

// Default fallback when no city match is found
export const DEFAULT_KOPPEN_FALLBACK = {
  climateZone: 'Cfa',
  climateLabel: 'Humid Subtropical (global fallback)',
  source: 'koppen_fallback' as const,
  confidence: 'fallback' as const,
  notes: 'No specific climate data for this location. Using global default fallback (Cfa — Humid Subtropical). Replace with geospatial raster lookup.',
  warnings: ['Precise Köppen climate zone unavailable. A conservative global fallback (Cfa) was applied. Results may not reflect local climate conditions.'],
};
