// TODO: Replace placeholder data with validated Köppen climate zone mappings from a real climate dataset.

export type CityClimateRecord = {
  climateZone: string;
  climateLabel: string;
  country: string;
  confidence: 'placeholder' | 'validated';
};

// Keys: "city|country" — both lowercased and trimmed
export const CITY_CLIMATE_MAP: Record<string, CityClimateRecord> = {
  'boston|united states': {
    climateZone: 'Dfa',
    climateLabel: 'Humid Continental',
    country: 'United States',
    confidence: 'placeholder',
  },
  'boston|usa': {
    climateZone: 'Dfa',
    climateLabel: 'Humid Continental',
    country: 'United States',
    confidence: 'placeholder',
  },
  'dubai|united arab emirates': {
    climateZone: 'BWh',
    climateLabel: 'Hot Desert',
    country: 'United Arab Emirates',
    confidence: 'placeholder',
  },
  'dubai|uae': {
    climateZone: 'BWh',
    climateLabel: 'Hot Desert',
    country: 'United Arab Emirates',
    confidence: 'placeholder',
  },
  'salalah|oman': {
    climateZone: 'BSh',
    climateLabel: 'Hot Semi-Arid / Desert',
    country: 'Oman',
    confidence: 'placeholder',
  },
  'delhi|india': {
    climateZone: 'Cwa',
    climateLabel: 'Humid Subtropical / Monsoon',
    country: 'India',
    confidence: 'placeholder',
  },
  'new delhi|india': {
    climateZone: 'Cwa',
    climateLabel: 'Humid Subtropical / Monsoon',
    country: 'India',
    confidence: 'placeholder',
  },
  'toronto|canada': {
    climateZone: 'Dfb',
    climateLabel: 'Warm-Summer Humid Continental',
    country: 'Canada',
    confidence: 'placeholder',
  },
  'santiago|chile': {
    climateZone: 'Csb',
    climateLabel: 'Warm-Summer Mediterranean',
    country: 'Chile',
    confidence: 'placeholder',
  },
  'mexico city|mexico': {
    climateZone: 'Cwb',
    climateLabel: 'Subtropical Highland',
    country: 'Mexico',
    confidence: 'placeholder',
  },
  'ho chi minh city|vietnam': {
    climateZone: 'Aw',
    climateLabel: 'Tropical Savanna',
    country: 'Vietnam',
    confidence: 'placeholder',
  },
  'new york|united states': {
    climateZone: 'Cfa',
    climateLabel: 'Humid Subtropical',
    country: 'United States',
    confidence: 'placeholder',
  },
  'new york|usa': {
    climateZone: 'Cfa',
    climateLabel: 'Humid Subtropical',
    country: 'United States',
    confidence: 'placeholder',
  },
  'chicago|united states': {
    climateZone: 'Dfa',
    climateLabel: 'Humid Continental',
    country: 'United States',
    confidence: 'placeholder',
  },
  'london|united kingdom': {
    climateZone: 'Cfb',
    climateLabel: 'Oceanic / Marine West Coast',
    country: 'United Kingdom',
    confidence: 'placeholder',
  },
  'london|uk': {
    climateZone: 'Cfb',
    climateLabel: 'Oceanic / Marine West Coast',
    country: 'United Kingdom',
    confidence: 'placeholder',
  },
  'singapore|singapore': {
    climateZone: 'Af',
    climateLabel: 'Tropical Rainforest',
    country: 'Singapore',
    confidence: 'placeholder',
  },
  'sydney|australia': {
    climateZone: 'Cfa',
    climateLabel: 'Humid Subtropical',
    country: 'Australia',
    confidence: 'placeholder',
  },
  'riyadh|saudi arabia': {
    climateZone: 'BWh',
    climateLabel: 'Hot Desert',
    country: 'Saudi Arabia',
    confidence: 'placeholder',
  },
  'abu dhabi|united arab emirates': {
    climateZone: 'BWh',
    climateLabel: 'Hot Desert',
    country: 'United Arab Emirates',
    confidence: 'placeholder',
  },
  'doha|qatar': {
    climateZone: 'BWh',
    climateLabel: 'Hot Desert',
    country: 'Qatar',
    confidence: 'placeholder',
  },
  'nairobi|kenya': {
    climateZone: 'Cwb',
    climateLabel: 'Subtropical Highland',
    country: 'Kenya',
    confidence: 'placeholder',
  },
  'amsterdam|netherlands': {
    climateZone: 'Cfb',
    climateLabel: 'Oceanic / Marine West Coast',
    country: 'Netherlands',
    confidence: 'placeholder',
  },
  'berlin|germany': {
    climateZone: 'Dfb',
    climateLabel: 'Warm-Summer Humid Continental',
    country: 'Germany',
    confidence: 'placeholder',
  },
  'stockholm|sweden': {
    climateZone: 'Dfb',
    climateLabel: 'Warm-Summer Humid Continental',
    country: 'Sweden',
    confidence: 'placeholder',
  },
};

export const DEFAULT_CLIMATE_ZONE = 'Cfa';
export const DEFAULT_CLIMATE_LABEL = 'Humid Subtropical (default fallback)';
